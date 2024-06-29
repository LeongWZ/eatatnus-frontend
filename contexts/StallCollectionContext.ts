import { Stall } from "@/app/types";
import {
  IdentifiableCollection,
  IdentifiableCollectionAction,
} from "@/hooks/useIdentifiableCollectionReducer";
import React from "react";
import { Dispatch } from "react";

type StallCollectionReducer = {
  stallCollection: IdentifiableCollection<Stall>;
  dispatchStallCollectionAction: Dispatch<IdentifiableCollectionAction<Stall>>;
};

const StallCollectionContext = React.createContext<StallCollectionReducer>({
  stallCollection: {
    items: [],
    loading: false,
    error_message: null,
  },
  dispatchStallCollectionAction: (action) => {},
});

export default StallCollectionContext;
