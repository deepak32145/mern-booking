import { useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { useQuery } from "@tanstack/react-query";
import { searchHotels } from "../api-client";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypeFilter from "../components/HotelTypeFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("");
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    sortOption: sortOption,
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
  };
  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevstars) =>
      event.target.checked
        ? [...prevstars, starRating]
        : prevstars.filter((star) => star != starRating),
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevHotelType) =>
      event.target.checked
        ? [...prevHotelType, hotelType]
        : prevHotelType.filter((data) => data != hotelType),
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSelectedFacilities((prevdata) =>
      event.target.checked
        ? [...prevdata, value]
        : prevdata.filter((data) => data != value),
    );
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchHotels", searchParams],
    queryFn: ({ queryKey }) => searchHotels(queryKey[1] as typeof searchParams),
  });
  console.log("data", data);
  if (isLoading) return <p>Loading....</p>;
  if (error) return <p>Error occured</p>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter By:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypeFilter
            selectedHotelsType={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice || 0}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {data?.pagination.total} Hotels found{" "}
            {search.destination ? `in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star rating</option>
            <option value="pricePerNightAsc">
              Price per Night(low to high)
            </option>
            <option value="pricePerNightDesc">
              Price per Night (high to low)
            </option>
          </select>
        </div>
        {data?.data.map((hotel) => (
          <SearchResultsCard hotel={hotel} />
        ))}
        <Pagination
          page={data?.pagination.page || 1}
          pages={data?.pagination.pages || 1}
          onPageChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
};

export default Search;
