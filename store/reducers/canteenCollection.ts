import { createSlice } from "@reduxjs/toolkit";
import { Canteen } from "@/app/types";
import IdentifiableCollection from "../interfaces/IdentifiableCollection";

const initialState: IdentifiableCollection<Canteen> = {
  items: [],
  loading: false,
  errorMessage: null,
};

const slice = createSlice({
  name: "canteenCollection",
  initialState: initialState,
  reducers: {
    loadCanteenCollectionAction: (state: IdentifiableCollection<Canteen>) => ({
      ...state,
      loading: true,
      errorMessage: null,
    }),
    putCanteenCollectionAction: (
      state: IdentifiableCollection<Canteen>,
      { payload: { items } }: { payload: { items: Canteen[] } },
    ) => ({
      items: items,
      loading: false,
      errorMessage: null,
    }),
    patchCanteenCollectionAction: (
      state: IdentifiableCollection<Canteen>,
      { payload: { item } }: { payload: { item: Canteen } },
    ) => ({
      items: state.items.map((canteen: Canteen) =>
        canteen.id === item.id ? item : canteen,
      ),
      loading: false,
      errorMessage: null,
    }),
    errorCanteenCollectionAction: (
      state: IdentifiableCollection<Canteen>,
      { payload: { errorMessage } }: { payload: { errorMessage: string } },
    ) => ({
      ...state,
      loading: false,
      errorMessage: errorMessage,
    }),
  },
});

export const {
  loadCanteenCollectionAction,
  putCanteenCollectionAction,
  patchCanteenCollectionAction,
  errorCanteenCollectionAction,
} = slice.actions;

export default slice.reducer;
