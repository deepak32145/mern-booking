import * as APIclient from "../api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import ManageHotelForm from "../forms/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import { useParams } from "react-router-dom";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const {
    data: hotel,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchHotelById" , hotelId],
    queryFn: () => APIclient.fetchHoteLById(hotelId || ""),
    enabled: !!hotelId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: APIclient.editHotel,
    onSuccess: async (data) => {
      console.log("data", data);
      showToast("updated hotel data", "SUCCESS");
    },
    onError: (error: Error) => {
      showToast("failed to update hotel", "ERROR");
      console.log(error);
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    console.log('hotelformdata' , hotelFormData);
    mutate(hotelFormData);
  };
  if (isLoading) return <p>Loading....</p>;
  if (error) return <p>Error occured</p>;
  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isPending} />
  );
};

export default EditHotel;
