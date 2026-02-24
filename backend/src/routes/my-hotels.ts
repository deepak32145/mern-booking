import express, { Request, Response } from "express";
import multer from "multer";
import verifyToken from "../middleware/auth";
import cloudinary from "cloudinary";
import { HotelType } from "../models/hotel";
import Hotel from "../models/hotel";
import { body, validationResult } from "express-validator";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/",
  verifyToken,
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      // parse facilities safely
      newHotel.facilities =
        typeof req.body.facilities === "string"
          ? JSON.parse(req.body.facilities)
          : (req.body.facilities ?? []);

      // cast numbers
      newHotel.adultCount = Number(req.body.adultCount);
      newHotel.childCount = Number(req.body.childCount);
      newHotel.pricePerNight = Number(req.body.pricePerNight);
      newHotel.starRating = Number(req.body.starRating);

      // upload images
      const imageUrls = await uploadImages(files);
      newHotel.imageUrls = imageUrls;

      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId || "";

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).json(hotel);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "something went wrong" });
    }
  },
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/:hotelId" , verifyToken , async(req : Request , res : Response) =>{
  console.log('req params' , req.params);
  const id = req.params.hotelId.toString();
  try{
    const hotels = await Hotel.findOne({
      _id : id 
    });
    console.log('hotels' , hotels);
    res.json(hotels);
  }
  catch(err){
    res.status(500).json({message : "something went wrong"});
  }
})



router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const hotelData: HotelType = req.body;
      console.log("hotel data", hotelData);
      hotelData.lastUpdated = new Date();
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        hotelData,
        { new: true },
      );
      if (!hotel) {
        return res.status(500).json({ message: "Technical Error" });
      }
      let updatedImagesUrls;
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        updatedImagesUrls = await uploadImages(files);
      }

      if (hotel) {
        hotel.imageUrls = [
          ...(updatedImagesUrls || []),
          ...(hotelData.imageUrls || []),
        ];
        await hotel.save();
        return res.status(201).json(hotel);
      } else {
        return res.status(400).json({ message: "not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "something went wrong" });
    }
  },
);

async function uploadImages(image: Express.Multer.File[]) {
  const uploadPromises = image.map(async (data) => {
    const b64 = Buffer.from(data.buffer).toString("base64");
    let dataURL = "data:" + data.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURL);
    return res.url;
  });
  const imagesUrls = await Promise.all(uploadPromises);
  return imagesUrls;
}

export default router;
