import React, { useState, useContext } from "react";
import Toast from "../components/Toast";

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
  return (
    <AppContext.Provider
      value={{
        showToast: (message: string, type: "SUCCESS" | "ERROR") => {
          setToast({ message, type });
        },
        isLoggedIn: false,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={toast.onClose || (() => {})}
        />
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
