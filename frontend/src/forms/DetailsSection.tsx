import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Add Hotel</h1>
      <label className="text-gray-700 font-semibold">
        Hotel Name
        <input
          type="text"
          className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>
      <div className="flex gap-4 w-full">
        <label className="text-gray-700 font-semibold flex-1">
          City
          <input
            type="text"
            {...register("city", { required: "This field is required" })}
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.city && (
            <span className="text-red-500"> {errors.city.message}</span>
          )}
        </label>
        <label className="text-gray-700 font-semibold flex-1">
          Country
          <input
            type="text"
            {...register("country", { required: "This field is required" })}
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold">
        Description
        <textarea
          rows={10}
          {...register("description", { required: "This field is required" })}
          className="border rounded w-full py-1 px-2 font-small"
        ></textarea>
        {errors.description && (
          <span className="text-red-500"> {errors.description.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Price per night
        <input
          type="number"
          min={1}
          {...register("pricePerNight", {
            required: "This field is required",
          })}
          className="border rounded w-full py-1 px-2 font-normal"
        />
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Star Rating
        <select {...register("starRating" , {required : "This field is required"})} className="border rounded w-full p-2 text-gray-700 font-normal">
          <option  value="" className="text-sm font-bol">
            Select a Rating
          </option>
          {[1, 2, 3, 4, 5].map((data , index) => {
            return <option key={index} value={data}>{data}</option>;
          })}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message}</span>
        )}
      </label>
    </div>
  );
};

export default DetailsSection;
