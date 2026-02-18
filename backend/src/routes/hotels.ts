import Hotel, { HotelSearchResponse } from "../models/hotel";
import express, { Request, Response } from "express";

const router = express.Router();

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

export default router;
