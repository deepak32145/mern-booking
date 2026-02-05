import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";

const ImageSection = () => {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<HotelFormData>();
  const existingImageUrls = watch("imageUrls");
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string,
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url != imageUrl),
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="grid grid-cols-6 gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url, index) => (
              <div key={index} className="relative-group">
                <img src={url} className="min-h-full object-cover" />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                  onClick={(event) => handleDelete(event, url)}
                ></button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          {...register("imageFiles", {
            validate: (data) => {
              const totalFileLength =
                data.length + (existingImageUrls?.length || 0);
              if (totalFileLength == 0) {
                return "please upload a file";
              }
              if (totalFileLength > 6) {
                return "Total files cannot be more than 6";
              }
              return true;
            },
            onChange: (event) =>{
              console.log(event.target.files);
            }
          })}
        />
        {errors.imageFiles && (
          <span className="text-red-500">{errors.imageFiles.message}</span>
        )}
      </div>
    </div>
  );
};
export default ImageSection;
