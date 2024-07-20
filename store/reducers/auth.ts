import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/app/types";

export type Auth = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  errorMessage: string | null;
};

const initialState: Auth = {
  user: null,
  loading: false,
  isAuthenticated: false,
  errorMessage: null,
};

const slice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    loadAuthAction: (state: Auth) => ({
      ...state,
      loading: true,
      errorMessage: null,
    }),
    signInAction: (state: Auth) => ({
      ...state,
      loading: false,
      isAuthenticated: true,
      errorMessage: null,
    }),
    signOutAction: (state: Auth) => ({
      firebaseUser: null,
      user: null,
      loading: false,
      isAuthenticated: false,
      errorMessage: null,
    }),
    putUserDataAction: (
      state: Auth,
      { payload: { user } }: { payload: { user: User } },
    ) => ({
      ...state,
      user: user,
      loading: false,
      errorMessage: null,
    }),
    errorAuthAction: (
      state: Auth,
      { payload: { errorMessage } }: { payload: { errorMessage: string } },
    ) => ({
      ...state,
      loading: false,
      errorMessage: errorMessage,
    }),
  },
});

export const {
  loadAuthAction,
  signInAction,
  signOutAction,
  putUserDataAction,
  errorAuthAction,
} = slice.actions;

export default slice.reducer;
