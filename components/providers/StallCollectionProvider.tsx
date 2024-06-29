import StallCollectionContext from "@/contexts/StallCollectionContext";
import useIdentifiableCollectionReducer from "@/hooks/useIdentifiableCollectionReducer";
import React from "react";
import fetchStalls from "@/api/stalls/fetchStalls";
import { Stall } from "@/app/types";

type StallCollectionProviderProps = {
  children: React.ReactElement;
};

export default function StallCollectionProvider(
  props: StallCollectionProviderProps,
) {
  const [stallCollection, dispatchStallCollectionAction] =
    useIdentifiableCollectionReducer<Stall>({
      items: [],
      loading: false,
      error_message: null,
    });

  React.useEffect(() => {
    dispatchStallCollectionAction({ type: "FETCH" });

    fetchStalls()
      .then((stalls) =>
        dispatchStallCollectionAction({
          type: "PUT",
          payload: { items: stalls },
        }),
      )
      .catch((error) => {
        dispatchStallCollectionAction({
          type: "ERROR",
          payload: { error_message: error },
        });
      });
  }, []);

  return (
    <StallCollectionContext.Provider
      value={{
        stallCollection: stallCollection,
        dispatchStallCollectionAction: dispatchStallCollectionAction,
      }}
    >
      {props.children}
    </StallCollectionContext.Provider>
  );
}
