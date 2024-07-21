import { createSlice } from "@reduxjs/toolkit";
import { CaloricTrackerEntry } from "@/app/types";
import IdentifiableCollection from "../interfaces/IdentifiableCollection";

const initialState: IdentifiableCollection<CaloricTrackerEntry> = {
  items: [],
  loading: false,
  errorMessage: null,
};

const slice = createSlice({
  name: "caloricTrackerEntryCollection",
  initialState: initialState,
  reducers: {
    loadCaloricTrackerEntryCollectionAction: (
      state: IdentifiableCollection<CaloricTrackerEntry>,
    ) => ({
      ...state,
      loading: true,
      errorMessage: null,
    }),
    putCaloricTrackerEntryCollectionAction: (
      state: IdentifiableCollection<CaloricTrackerEntry>,
      { payload: { items } }: { payload: { items: CaloricTrackerEntry[] } },
    ) => ({
      items: items,
      loading: false,
      errorMessage: null,
    }),
    patchCaloricTrackerEntryCollectionAction: (
      state: IdentifiableCollection<CaloricTrackerEntry>,
      { payload: { item } }: { payload: { item: CaloricTrackerEntry } },
    ) => ({
      items: state.items.map((caloricTrackerEntry: CaloricTrackerEntry) =>
        caloricTrackerEntry.id === item?.id ? item : caloricTrackerEntry,
      ),
      loading: false,
      errorMessage: null,
    }),
    errorCaloricTrackerEntryCollectionAction: (
      state: IdentifiableCollection<CaloricTrackerEntry>,
      { payload: { errorMessage } }: { payload: { errorMessage: string } },
    ) => ({
      ...state,
      loading: false,
      errorMessage: errorMessage,
    }),
  },
});

export const {
  loadCaloricTrackerEntryCollectionAction,
  putCaloricTrackerEntryCollectionAction,
  patchCaloricTrackerEntryCollectionAction,
  errorCaloricTrackerEntryCollectionAction,
} = slice.actions;

export default slice.reducer;
