import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import useIdentifiableCollectionReducer from "@/hooks/useIdentifiableCollectionReducer";
import React from "react";
import fetchCanteens from "@/api/canteens/fetchCanteens";
import { Canteen } from "@/app/types";

type CanteenCollectionProviderProps = {
  children: React.ReactElement;
};

export default function CanteenCollectionProvider(
  props: CanteenCollectionProviderProps,
) {
  const [canteenCollection, dispatchCanteenCollectionAction] =
    useIdentifiableCollectionReducer<Canteen>({
      items: [],
      loading: false,
      error_message: null,
    });

  React.useEffect(() => {
    dispatchCanteenCollectionAction({ type: "FETCH" });

    fetchCanteens()
      .then((canteens) =>
        dispatchCanteenCollectionAction({
          type: "PUT",
          payload: { items: canteens },
        }),
      )
      .catch((error) => {
        dispatchCanteenCollectionAction({
          type: "ERROR",
          payload: { error_message: error },
        });
      });
  }, []);

  return (
    <CanteenCollectionContext.Provider
      value={{
        canteenCollection: canteenCollection,
        dispatchCanteenCollectionAction: dispatchCanteenCollectionAction,
      }}
    >
      {props.children}
    </CanteenCollectionContext.Provider>
  );
}
