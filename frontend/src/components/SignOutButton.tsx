import * as ApiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const mutation = useMutation({
    mutationFn: ApiClient.logout,
    onSuccess: (data: Awaited<ReturnType<typeof ApiClient.logout>>) => {
      console.log(data);
      showToast("Logout successful", "SUCCESS");
      queryClient.invalidateQueries({ queryKey: ["validateToken"] });
    },
    onError: (err: Error) => {
      console.log(err);
      showToast("Somethin went wrong", "ERROR");
    },
  });

  const   handleClick =  () =>{
    mutation.mutate();
  }

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100 "
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
