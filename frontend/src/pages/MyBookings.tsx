import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const { data: myBookingData } = useQuery({
    queryKey: ["myBookingsData"],
    queryFn: () => apiClient.myBookings(),
  });
  if (!myBookingData || myBookingData.length == 0) {
    return <span>No Hotels found</span>;
  }
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {myBookingData.map((data) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
          <div className="lg:w-full lg:h-62.5">
            <img
              src={data.imageUrls[0]}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-75">
            <div className="text-2xl font-bold">{data.name}</div>
            <div className="text-xs font-normal">
              {data.city}, {data.country}
            </div>
            {data.bookings.map((booking) => (
              <div>
                <div>
                  <span className="font-bold mr-2">Dates:</span>
                  <span>
                    {new Date(booking.checkIn).toDateString()}
                    {new Date(booking.checkOut).toDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-bold mr-2">Guests:</span>
                  <span>
                    {booking.adultCount} adults , {booking.childCount} children
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
