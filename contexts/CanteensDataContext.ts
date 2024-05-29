import { Canteen } from "@/app/types";
import { CanteensData, CanteensDataAction } from "@/hooks/useCanteenReducer"
import React from "react";
import { Dispatch } from "react";

type CanteensDataContextType = {
    canteensData: CanteensData;
    dispatchCanteensData: Dispatch<CanteensDataAction>;
}

const CanteensDataContext = React.createContext<CanteensDataContextType>({
    canteensData: {
        data: new Map<number, Canteen>(),
        loading: false,
        error_message: null,
    },
    dispatchCanteensData: canteensDataAction => {}
});

export default CanteensDataContext;