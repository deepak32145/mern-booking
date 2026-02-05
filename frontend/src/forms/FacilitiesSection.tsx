import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";
import { hotelFacilities } from "../config/hotel-option-config";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-5 gap-3">
        {hotelFacilities.map((data, index) => (
          <label key={index} className="text-sm flex gap-1 text-gray-700">
            <input
              type="checkbox"
              value={data}
              key={index}
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "Select atleast one facility";
                  }
                },
              })}
            />
            {data}
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500">{errors.facilities.message}</span>
      )}
    </div>
  );
};
export default FacilitiesSection;
