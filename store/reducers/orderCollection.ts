import { createSlice } from "@reduxjs/toolkit";
import { Order } from "@/app/types";
import IdentifiableCollection from "../interfaces/IdentifiableCollection";

const initialState: IdentifiableCollection<Order> = {
  items: [],
  loading: false,
  errorMessage: null,
};

const slice = createSlice({
  name: "orderCollection",
  initialState: initialState,
  reducers: {
    loadOrderCollectionAction: (state: IdentifiableCollection<Order>) => ({
      ...state,
      loading: true,
      errorMessage: null,
    }),
    putOrderCollectionAction: (
      state: IdentifiableCollection<Order>,
      { payload: { items } }: { payload: { items: Order[] } },
    ) => ({
      items: items,
      loading: false,
      errorMessage: null,
    }),
    editOrderAction: (
      state: IdentifiableCollection<Order>,
      { payload: { item } }: { payload: { item: Order } },
    ) => ({
      items: state.items.map((order: Order) =>
        order.id === item.id ? item : order,
      ),
      loading: false,
      errorMessage: null,
    }),
    addOrderAction: (
      state: IdentifiableCollection<Order>,
      { payload: { item } }: { payload: { item: Order } },
    ) => ({
      items: [item, ...state.items],
      loading: false,
      errorMessage: null,
    }),
    deleteOrderAction: (
      state: IdentifiableCollection<Order>,
      { payload: { item } }: { payload: { item: Order } },
    ) => ({
      items: state.items.filter((order: Order) => order.id !== item.id),
      loading: false,
      errorMessage: null,
    }),
    errorOrderCollectionAction: (
      state: IdentifiableCollection<Order>,
      { payload: { errorMessage } }: { payload: { errorMessage: string } },
    ) => ({
      ...state,
      loading: false,
      errorMessage: errorMessage,
    }),
  },
});

export const {
  loadOrderCollectionAction,
  putOrderCollectionAction,
  editOrderAction,
  addOrderAction,
  deleteOrderAction,
  errorOrderCollectionAction,
} = slice.actions;

export default slice.reducer;
