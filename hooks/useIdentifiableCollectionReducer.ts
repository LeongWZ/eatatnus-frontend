import React from "react";

type Identifiable = {
  id: number;
};

export interface IdentifiableCollection<T extends Identifiable> {
  items: T[];
  loading: boolean;
  error_message: string | null;
}

export interface IdentifiableCollectionAction<T extends Identifiable> {
  type: "FETCH" | "PUT" | "PATCH" | "ERROR";
  payload?: {
    items?: T[];
    item?: T;
    error_message?: string;
  };
}

function identifiableCollectionReducer<T extends Identifiable>(
  state: IdentifiableCollection<T>,
  action: IdentifiableCollectionAction<T>,
): IdentifiableCollection<T> {
  switch (action.type) {
    case "FETCH":
      return { ...state, loading: true, error_message: null };
    case "PUT":
      return {
        items: action.payload?.items ?? [],
        loading: false,
        error_message: null,
      };
    case "PATCH":
      return {
        items: state.items.map((item) =>
          item.id === action.payload?.item?.id ? action.payload?.item : item,
        ),
        loading: false,
        error_message: null,
      };
    case "ERROR":
      return { ...state, error_message: action.payload?.error_message ?? null };
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
