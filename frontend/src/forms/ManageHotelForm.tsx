import { FormProvider, useForm } from "react-hook-form";
import type { HotelType } from "../../../backend/src/models/hotel";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImageSection from "./ImageSection";
import { useEffect } from "react";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricerPerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: File[];
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

type props = {
  hotel?: HotelType | undefined;
  onSave: (data: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ hotel, onSave, isLoading }: props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [hotel]);

  const onSubmit = handleSubmit((data: HotelFormData) => {
    console.log("submit data", data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("pricePerNight", data.pricerPerNight.toString());
    formData.append("starRating", data.starRating.toString());
    formData.append("adultCount", data.adultCount.toString());
    formData.append("childCount", data.childCount.toString());
    formData.append(`facilities`, JSON.stringify(data.facilities));
    if (data.imageUrls) {
      data.imageUrls.forEach((content) => {
        formData.append(`imageUrls`, content);
      });
    }
    Array.from(data.imageFiles).forEach((data) =>{
      formData.append("imageFiles" , data)
    })

    onSave(formData);
  });
  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestSection />
        <ImageSection />
        <span className="flex justify-end">
          <button
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Hotel"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
