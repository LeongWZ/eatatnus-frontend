import { createSlice } from "@reduxjs/toolkit";
import { Stall } from "@/app/types";
import IdentifiableCollection from "../interfaces/IdentifiableCollection";

const initialState: IdentifiableCollection<Stall> = {
  items: [],
  loading: false,
  errorMessage: null,
};

const slice = createSlice({
  name: "stallCollection",
  initialState: initialState,
  reducers: {
    loadStallCollectionAction: (state: IdentifiableCollection<Stall>) => ({
      ...state,
      loading: true,
      errorMessage: null,
    }),
    putStallCollectionAction: (
      state: IdentifiableCollection<Stall>,
      { payload: { items } }: { payload: { items: Stall[] } },
    ) => ({
      items: items,
      loading: false,
      errorMessage: null,
    }),
    patchStallCollectionAction: (
      state: IdentifiableCollection<Stall>,
      { payload: { item } }: { payload: { item: Stall } },
    ) => ({
      items: state.items.map((Stall: Stall) =>
        Stall.id === item.id ? item : Stall,
      ),
      loading: false,
      errorMessage: null,
    }),
    errorStallCollectionAction: (
      state: IdentifiableCollection<Stall>,
      { payload: { errorMessage } }: { payload: { errorMessage: string } },
    ) => ({
      ...state,
      loading: false,
      errorMessage: errorMessage,
    }),
  },
});

export const {
  loadStallCollectionAction,
  putStallCollectionAction,
  patchStallCollectionAction,
  errorStallCollectionAction,
} = slice.actions;

export default slice.reducer;
