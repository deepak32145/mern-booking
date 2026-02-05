import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "@tanstack/react-query";
import { addHotel } from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm";

const Hotel = () => {
  const { showToast } = useAppContext();

  const { mutate, isPending  } = useMutation({
    mutationFn: addHotel,
    onSuccess: async (data: Awaited<ReturnType<typeof addHotel>>) => {
      console.log("data", data);
      showToast("added hotel", "SUCCESS");
    },
    onError: (err: Error) => {
      console.log(err);
      showToast("Something went wrong try again later", "ERROR");
    },
  });

  const handleSave = (hotelFormData : FormData) =>{
    console.log('hotelFormData', hotelFormData);
    mutate(hotelFormData);
  }

  return (
    <ManageHotelForm onSave={handleSave} isLoading={isPending } />
  )
};

export default Hotel;
