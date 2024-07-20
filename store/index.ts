import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducers/auth";
import canteenCollection from "./reducers/canteenCollection";
import stallCollection from "./reducers/stallCollection";

const store = configureStore({
  reducer: {
    auth: auth,
    canteenCollection: canteenCollection,
    stallCollection: stallCollection,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
