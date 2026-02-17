import mongoose from "mongoose";

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

const hotelSchema = new mongoose.Schema<HotelType>({
  userId: { type: String },
  name: { type: String },
  city: { type: String },
  country: { type: String },
  description: { type: String },
  type: { type: String },
  adultCount: { type: Number },
  childCount: { type: Number },
  facilities: [{ type: String }],
  pricePerNight: { type: Number },
  starRating: { type: Number },
  imageUrls: [{ type: String }],
  lastUpdated: { type: Date },
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);

export default Hotel;
