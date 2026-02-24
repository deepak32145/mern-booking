import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import BookingForm from "../forms/BookingForm";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { useAppContext } from "../contexts/AppContext";
import { Elements } from "@stripe/react-stripe-js";
const Booking = () => {
  const search = useSearchContext();
  const { hotelId } = useParams();
  const {stripePromise} = useAppContext();
  const numberOfNights =
    search.checkIn && search.checkOut
      ? Math.ceil(
          Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
            (1000 * 60 * 60 * 24),
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
  const { data: paymentIntentData } = useQuery({
    queryKey: ["createPaymentIntent"],
    queryFn: () =>
      apiClient.paymentIntent(
        hotelId as string,
        numberOfNights.toString() as string,
      ),
      enabled : !!hotelId && numberOfNights > 0
  });
  console.log("userdata", userData);
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
      {userData && paymentIntentData && (
        <Elements options={{
            clientSecret : paymentIntentData.clientSecret
        }} stripe={stripePromise}>
            <BookingForm currentUser = {userData} paymentIntent ={paymentIntentData} />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
