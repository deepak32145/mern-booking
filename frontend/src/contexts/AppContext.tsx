import React, { useState, useContext } from "react";
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiclient from "../api-client";


type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose?: () => void;
};
type AppContext = {
  showToast: (message: string, type: "SUCCESS" | "ERROR") => void;
  isLoggedIn: boolean;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { isError } = useQuery({
    queryKey: ["validateToken"],
    queryFn: apiclient.validateToken,
    retry: false,
  });
  return (
    <AppContext.Provider
      value={{
        showToast: (message: string, type: "SUCCESS" | "ERROR") => {
          setToast({ message, type });
        },
        isLoggedIn: !isError,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
