import { Canteen } from "@/app/types";
import {
  IdentifiableCollection,
  IdentifiableCollectionAction,
} from "@/hooks/useIdentifiableCollectionReducer";
import React from "react";
import { Dispatch } from "react";

type CanteenCollectionReducer = {
  canteenCollection: IdentifiableCollection<Canteen>;
  dispatchCanteenCollectionAction: Dispatch<
    IdentifiableCollectionAction<Canteen>
  >;
};

const CanteenCollectionContext = React.createContext<CanteenCollectionReducer>({
  canteenCollection: {
    items: [],
    loading: false,
    error_message: null,
  },
  dispatchCanteenCollectionAction: (action) => {},
});

export default CanteenCollectionContext;
