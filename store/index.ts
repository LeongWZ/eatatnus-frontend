import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducers/auth";
import canteenCollection from "./reducers/canteenCollection";
import stallCollection from "./reducers/stallCollection";
import caloricTrackerEntryCollection from "./reducers/caloricTrackerEntryCollection";

const store = configureStore({
  reducer: {
    auth: auth,
    canteenCollection: canteenCollection,
    stallCollection: stallCollection,
    caloricTrackerEntryCollection: caloricTrackerEntryCollection,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
