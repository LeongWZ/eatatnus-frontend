import { Canteen } from "@/app/types";
import { CanteensData, CanteensDataAction } from "@/hooks/useCanteenReducer"
import React from "react";
import { Dispatch } from "react";

type CanteensDataReducer = {
    canteensData: CanteensData;
    dispatchCanteensData: Dispatch<CanteensDataAction>;
}

const CanteensDataContext = React.createContext<CanteensDataReducer>({
    canteensData: {
        data: [],
        loading: false,
        error_message: null,
    },
    dispatchCanteensData: canteensDataAction => {}
});

export default CanteensDataContext;