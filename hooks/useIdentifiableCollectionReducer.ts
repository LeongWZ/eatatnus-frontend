import React from "react";
import Identifiable from "@/store/interfaces/Identifiable";
import IdentifiableCollection from "@/store/interfaces/IdentifiableCollection";

export interface IdentifiableCollectionAction<T extends Identifiable> {
  type: "LOAD" | "PUT" | "PATCH" | "ERROR";
  payload?: {
    items?: T[];
    item?: T;
    errorMessage?: string;
  };
}

function identifiableCollectionReducer<T extends Identifiable>(
  state: IdentifiableCollection<T>,
  action: IdentifiableCollectionAction<T>,
): IdentifiableCollection<T> {
  switch (action.type) {
    case "LOAD":
      return { ...state, loading: true, errorMessage: null };
    case "PUT":
      return {
        items: action.payload?.items ?? [],
        loading: false,
        errorMessage: null,
      };
    case "PATCH":
      return {
        items: state.items.map((item) =>
          item.id === action.payload?.item?.id ? action.payload?.item : item,
        ),
        loading: false,
        errorMessage: null,
      };
    case "ERROR":
      return { ...state, errorMessage: action.payload?.errorMessage ?? null };
    default:
      throw new Error(
        `Invalid action type: ${action.type} in identifiableCollectionReducer`,
      );
  }
}

export default function useIdentifiableCollectionReducer<
  T extends Identifiable,
>(initState: IdentifiableCollection<T>) {
  return React.useReducer<
    React.Reducer<IdentifiableCollection<T>, IdentifiableCollectionAction<T>>
  >(identifiableCollectionReducer, initState);
}
