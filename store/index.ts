import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducers/auth";
import canteenCollection from "./reducers/canteenCollection";
import stallCollection from "./reducers/stallCollection";
import caloricTracker from "./reducers/caloricTracker";
import orderCollection from "./reducers/orderCollection";

const store = configureStore({
  reducer: {
    auth: auth,
    canteenCollection: canteenCollection,
    stallCollection: stallCollection,
    caloricTracker: caloricTracker,
    orderCollection: orderCollection,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
