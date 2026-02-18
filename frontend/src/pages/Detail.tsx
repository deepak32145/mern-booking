import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm";
const Detail = () => {
  const { hotelId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["searchSpecificHotel", hotelId],
    queryFn: () => apiClient.getHotelById(hotelId as string),
  });
  console.log("data", data);
  if (!data) return <>Nothing</>;
  if (isLoading) return <p>Loading....</p>;
  if (error) return <p>Error occured</p>;
  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: data.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{data.name}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {data.imageUrls.map((image) => (
          <div className="h-75">
            <img
              src={image}
              alt={data.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {data.facilities.map((data) => (
          <div className="border border-slate-300 rounded-sm p-3">{data}</div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">
          {data.description}
          <div className="h-fit">
            <GuestInfoForm
              pricePerNight={data.pricePerNight}
              hotelId={data._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Detail;
