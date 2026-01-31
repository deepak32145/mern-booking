import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../contexts/AppContext";
export type SignInFormData = {
  email: string;
  password: string;
};

const Signin = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apiClient.login,
    onSuccess: (data: Awaited<ReturnType<typeof apiClient.login>>) => {
      showToast("Login Successful", "SUCCESS");
      console.log("data", data);
      queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast("Login Failed: " + error.message, "ERROR");
      alert(error.message);
    },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();
  const submit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  return (
    <form className="flex flex-col gap-5" onSubmit={submit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "this field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          {...register("password", {
            required: "This field is requried",
            minLength: {
              value: 6,
              message: "password should be atleast 6 characters",
            },
          })}
          className="border rounded w-full py-1 px-2 font-normal"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not registered?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </span>
        <button
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
          type="submit"
        >
          Login
        </button>
      </span>
    </form>
  );
};

export default Signin;
