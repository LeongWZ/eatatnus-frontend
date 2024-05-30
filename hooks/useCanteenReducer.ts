import { Canteen } from "@/app/types"
import React from "react";

export type CanteensData = {
    data: Map<number, Canteen>;
    loading: boolean;
    error_message: string | null;
}

export type CanteensDataAction = {
    type: "FETCH" | "GET" | "PATCH" | "ERROR";
    payload?: {
        canteens?: Canteen[],
        canteen?: Canteen,
        error_message?: string
    }
}

function canteensDataReducer(state: CanteensData, action: CanteensDataAction): CanteensData {
    switch (action.type) {
        case "FETCH":
            return { ...state, loading: true, error_message: null }
        case "GET":
            const newData = new Map<number, Canteen>();
            action.payload?.canteens?.forEach(canteen => {
                newData.set(canteen.id, canteen);
            });
            return { data: newData, loading: false, error_message: null }
        case "PATCH":
            const canteen = action.payload?.canteen;
            if (canteen) {
                state.data.set(canteen.id, canteen);
            }
            return { ...state, loading: false, error_message: null }
        case "ERROR":
            return { ...state, error_message: action.payload?.error_message ?? null }
        default:
            throw new Error("Invalid action type: " + action.type + " in canteensDataReducer");
    }
}

export default function useCanteensDataReducer(initState: CanteensData) {
    return React.useReducer(canteensDataReducer, initState);
}