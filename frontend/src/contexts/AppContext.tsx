import React, { useState, useContext } from "react";
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiclient from "../api-client";
import { loadStripe, type Stripe } from "@stripe/stripe-js";

const STRIPE_KEY =
  "pk_test_51T2c927hK2Ni3TuS5r3cH4vR5eDj80ehhkUAXTSs67EoyhcGCGlZxhQ5RpCdate1AsrJYlLiW92EC7CyqS6WqecG00fDxQEC50";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose?: () => void;
};
type AppContext = {
  showToast: (message: string, type: "SUCCESS" | "ERROR") => void;
  isLoggedIn: boolean;
  stripePromise : Promise<Stripe | null>;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_KEY);
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
        stripePromise
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
