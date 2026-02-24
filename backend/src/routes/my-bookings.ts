import express , {Request , Response} from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";    
import { HotelType } from "../models/hotel";

const router = express.Router();

router.get("/" , verifyToken , async(req : Request , res : Response) =>{
    try {
        const hotels = await Hotel.find({
            bookings : {$elemMatch : {userId : req.userId}}
        });
        if(hotels) {
            const results = hotels.map((data) =>{
                const userBookings = data.bookings.filter(
                    (booking) => booking.userId == req.userId
                );
                const hotelWithUserBookings : HotelType = {
                    ...data.toObject(),
                    bookings : userBookings
                };
                return hotelWithUserBookings;
            })
            res.status(200).send(results);
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message : "something went wrong"});
    }
});

export default router;