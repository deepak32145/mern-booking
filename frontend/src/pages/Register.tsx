import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../contexts/AppContext";

export type formDataRegister = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { showToast } = useAppContext();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<formDataRegister>();
  console.log("register", register);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: apiClient.registerUser,
    onSuccess: async (
      data: Awaited<ReturnType<typeof apiClient.registerUser>>,
    ) => {
      console.log("data", data);
      showToast("Registration successful", "SUCCESS");
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast("Registration failed: " + error.message, "ERROR");
      alert(error.message);
    },
  });
  const onSubmit = handleSubmit((data) => {
    console.log("data", data);
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col  gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            {...register("firstName", { required: "This field is required" })}
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm">First Name is required</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            {...register("lastName", { required: "This field is required" })}
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm">Last Name is required</span>
          )}
        </label>
        <label>
          Email
          <input
            type="email"
            {...register("email", { required: "This field is required" })}
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">Email is required</span>
          )}
        </label>
        <label>
          Password
          <input
            type="password"
            {...register("password", {
              required: "password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">Password is required</span>
          )}
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("confirmPassword", {
              validate: (val: string) => {
                if (!val) {
                  return "This field is required";
                } else if (getValues("password") !== val) {
                  return "Passwords do not match";
                }
              },
            })}
          ></input>
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">Passwords do not match</span>
          )}
        </label>
        <span>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </span>
      </div>
    </form>
  );
};

export default Register;
