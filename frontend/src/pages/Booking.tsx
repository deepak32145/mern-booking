import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useState } from "react";
import BookingForm from "../forms/BookingForm";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
const Booking = () => {
  const search = useSearchContext();
  const { hotelId } = useParams();
  const numberOfNights =
    search.checkIn && search.checkOut
      ? Math.ceil(
          Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;
  const { data: hotelData } = useQuery({
    queryKey: ["searchHotelData", hotelId],
    queryFn: () => apiClient.fetchHoteLById(hotelId as string),
  });
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => apiClient.getUserInfo(),
  });
  console.log('userdata' , userData);
  if (!hotelData) return <>No hotel found</>;
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotelData}
      />
    </div>
  );
};

export default Booking;
