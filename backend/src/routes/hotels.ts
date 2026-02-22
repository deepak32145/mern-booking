import verifyToken from "../middleware/auth";
import Hotel, { BookingType, HotelSearchResponse } from "../models/hotel";
import express, { Request, Response } from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY as string);

router.get("/search", async (req: Request, res: Response) => {
  try {
    // ✅ FIX 1
    const query = constructSearchQuery(req.query);

    let sortOptions: any = {};

    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 }; // default sort
    }

    const pageSize = 5;
    const pageNumber = parseInt(req.query.page as string) || 1;
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: "gbp",
      metadata: {
        hotelId,
        userId: req.userId || 1,
      },
    });
    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }
    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };
    res.send(response);
  },
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntent;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string,
      );
      if (!paymentIntent) {
        return res.status(400).json({ message: "payment intent not found" });
      }
      if (
        paymentIntent.metadata.hotelId != req.params.hotelId ||
        paymentIntent.metadata.userId != req.userId
      ) {
        return res.status(400).json({ message: "payment mismatch" });
      }
      if (paymentIntent.status != "succeeded") {
        return res.status(400).json({
          message: `payment inent not succedded ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        },
      );
      if (!hotel) {
        return res.status(400).json({ message: "hotel not found" });
      }

      await hotel?.save();
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server Error" });
    }
  },
);

const constructSearchQuery = (queryParams: any) => {
  const constructedQuery: any = {};

  // Destination filter
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: { $regex: queryParams.destination, $options: "i" } },
      { country: { $regex: queryParams.destination, $options: "i" } },
    ];
  }

  if (queryParams.name) {
    constructedQuery.name = {
      $regex: queryParams.name,
      $options: "i",
    };
  }

  // Adult count
  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  // Child count
  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  // Facilities (multiple allowed)
  if (queryParams.facilities) {
    const facilities = Array.isArray(queryParams.facilities)
      ? queryParams.facilities
      : [queryParams.facilities];

    constructedQuery.facilities = { $all: facilities };
  }

  // Types
  if (queryParams.types) {
    const types = Array.isArray(queryParams.types)
      ? queryParams.types
      : [queryParams.types];

    constructedQuery.type = { $in: types };
  }

  // Stars
  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : [parseInt(queryParams.stars)];

    constructedQuery.starRating = { $in: starRatings };
  }

  // ✅ FIX 2 (numeric comparison)
  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }

  return constructedQuery;
};

export default router;
