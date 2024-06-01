import CanteensDataContext from "@/contexts/CanteensDataContext";
import useCanteensDataReducer from "@/hooks/useCanteenReducer";
import React from "react";
import { Canteen } from "@/app/types";
import fetchCanteens from "@/api/canteens/fetchCanteens";

type CanteensDataProviderProps = {
  children: React.ReactNode;
};

export default function CanteensDataProvider(props: CanteensDataProviderProps) {
  const [canteensData, dispatchCanteensData] = useCanteensDataReducer({
    data: [],
    loading: false,
    error_message: null,
  });

  React.useEffect(() => {
    dispatchCanteensData({ type: "FETCH" });

    fetchCanteens()
      .then(canteens =>
        dispatchCanteensData({
          type: "GET",
          payload: { canteens: canteens },
        })
      )
      .catch((error) => {
        dispatchCanteensData({ type: "ERROR", payload: { error_message: error } });
      });
  }, []);

  return (
    <CanteensDataContext.Provider
      value={{
        canteensData: canteensData,
        dispatchCanteensData: dispatchCanteensData,
      }}
    >
      {props.children}
    </CanteensDataContext.Provider>
  );
}
