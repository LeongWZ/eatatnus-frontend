import { createSlice } from "@reduxjs/toolkit";
import { CaloricTrackerEntry, CaloricTracker, Food } from "@/app/types";

type CaloricTrackerState = {
  id: number | null;
  userId: number | null;
  caloricTrackerEntries: CaloricTrackerEntry[];
  draft: Omit<Food, "id">[];
  loading: boolean;
  errorMessage: string | null;
  isUnassigned: boolean;
};

const initialState: CaloricTrackerState = {
  id: null,
  userId: null,
  caloricTrackerEntries: [],
  draft: [],
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
      ...state,
      ...caloricTracker,
      loading: false,
      errorMessage: null,
      isUnassigned: false,
    }),
    deleteCaloricTrackerAction: (state: CaloricTrackerState) => ({
      id: null,
      userId: null,
      caloricTrackerEntries: [],
      draft: [],
      loading: false,
      errorMessage: null,
      isUnassigned: true,
    }),
    editCaloricTrackerEntryAction: (
      state: CaloricTrackerState,
      { payload: { item } }: { payload: { item: CaloricTrackerEntry } },
    ) => ({
      ...state,
      caloricTrackerEntries: state.caloricTrackerEntries.map(
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
      caloricTrackerEntries: [item, ...state.caloricTrackerEntries],
      draft: [],
      loading: false,
      errorMessage: null,
      isUnassigned: false,
    }),
    deleteCaloricTrackerEntryAction: (
      state: CaloricTrackerState,
      { payload: { item } }: { payload: { item: CaloricTrackerEntry } },
    ) => ({
      ...state,
      caloricTrackerEntries: state.caloricTrackerEntries.filter(
        (entry) => entry.id !== item.id,
      ),
      draft: [],
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
    putCaloricTrackerDraftAction: (
      state: CaloricTrackerState,
      { payload: { foods } }: { payload: { foods: Omit<Food, "id">[] } },
    ) => ({
      ...state,
      draft: foods,
      loading: false,
      errorMessage: null,
    }),
  },
});

export const {
  loadCaloricTrackerAction,
  putCaloricTrackerAction,
  deleteCaloricTrackerAction,
  editCaloricTrackerEntryAction,
  addCaloricTrackerEntryAction,
  deleteCaloricTrackerEntryAction,
  errorCaloricTrackerAction,
  putCaloricTrackerDraftAction,
} = slice.actions;

export default slice.reducer;
