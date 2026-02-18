import { useForm, useWatch } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";
import { useAppContext } from "../contexts/AppContext";
type Props = {
  pricePerNight: number;
  hotelId: string;
};

type GuestFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  console.log("loggedin", isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<GuestFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  const checkIn = useWatch({ control, name: "checkIn" });
  const checkOut = useWatch({ control, name: "checkOut" });

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSubmit = (data: GuestFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount,
    );
    navigate("/sign-in", { state: { from: location } });
  };
  const onSignInClick = (data: GuestFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount,
    );
    navigate(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">{pricePerNight}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSignInClick) : handleSubmit(onSubmit)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={checkIn}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Checkin date"
              wrapperClassName="min-w-full"
              className="min-w-full bg-white p-2"
              onChange={(date: Date | null) =>
                date && setValue("checkIn", date)
              }
            />
          </div>
          <div>
            <DatePicker
              required
              selected={checkOut}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="checkout date"
              wrapperClassName="min-w-full"
              className="min-w-full bg-white p-2"
              onChange={(date: Date | null) =>
                date && setValue("checkOut", date)
              }
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Adults:
              <input
                type="number"
                min={1}
                max={20}
                className="w-full p-1 focus:outline-none font-bol"
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be atleast one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="items-center flex">
                Children
              <input
                min={1}
                max={20}
                type="number"
                placeholder="children"
                className="w-full p-1 focus:outline-none font-bold"
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500">{errors.adultCount.message}</span>
            )}
          </div>
          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
