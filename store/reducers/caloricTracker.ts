import { createSlice } from "@reduxjs/toolkit";
import { CaloricTrackerEntry, CaloricTracker } from "@/app/types";

type CaloricTrackerState = {
  id: number | null;
  userId: number | null;
  caloricTrackerEntries: CaloricTrackerEntry[];
  loading: boolean;
  errorMessage: string | null;
  isUnassigned: boolean;
};

const initialState: CaloricTrackerState = {
  id: null,
  userId: null,
  caloricTrackerEntries: [],
  loading: false,
  errorMessage: null,
  isUnassigned: true,
};

const slice = createSlice({
  name: "caloricTracker",
  initialState: initialState,
  reducers: {
    loadCaloricTrackerAction: (state: CaloricTrackerState) => ({
      ...state,
      loading: true,
      errorMessage: null,
    }),
    putCaloricTrackerAction: (
      state: CaloricTrackerState,
      {
        payload: { caloricTracker },
      }: { payload: { caloricTracker: CaloricTracker } },
    ) => ({
      ...caloricTracker,
      loading: false,
      errorMessage: null,
      isUnassigned: false,
    }),
    editCaloricTrackerEntryAction: (
      state: CaloricTrackerState,
      { payload: { item } }: { payload: { item: CaloricTrackerEntry } },
    ) => ({
      ...state,
      items: state.caloricTrackerEntries.map(
        (caloricTrackerEntry: CaloricTrackerEntry) =>
          caloricTrackerEntry.id === item?.id ? item : caloricTrackerEntry,
      ),
      loading: false,
      errorMessage: null,
    }),
    addCaloricTrackerEntryAction: (
      state: CaloricTrackerState,
      { payload: { item } }: { payload: { item: CaloricTrackerEntry } },
    ) => ({
      ...state,
      items: [item].concat(state.caloricTrackerEntries),
      loading: false,
      errorMessage: null,
      isUnassigned: false,
    }),
    errorCaloricTrackerAction: (
      state: CaloricTrackerState,
      { payload: { errorMessage } }: { payload: { errorMessage: string } },
    ) => ({
      ...state,
      loading: false,
      errorMessage: errorMessage,
    }),
  },
});

export const {
  loadCaloricTrackerAction,
  putCaloricTrackerAction,
  editCaloricTrackerEntryAction,
  addCaloricTrackerEntryAction,
  errorCaloricTrackerAction,
} = slice.actions;

export default slice.reducer;
