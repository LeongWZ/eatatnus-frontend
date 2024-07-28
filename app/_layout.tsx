import { Stack } from "expo-router";
import React from "react";
import ComposeProviders from "@/components/providers/ComposeProviders";
import HoldMenuProvider from "@/components/providers/HoldMenuProvider";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "@/store";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth as firebaseAuth } from "../firebaseConfig";
import {
  signInAction,
  signOutAction,
  putUserDataAction,
  errorAuthAction,
} from "@/store/reducers/auth";
import {
  putCanteenCollectionAction,
  loadCanteenCollectionAction,
  errorCanteenCollectionAction,
} from "@/store/reducers/canteenCollection";
import fetchCanteens from "@/api/canteens/fetchCanteens";
import {
  putStallCollectionAction,
  loadStallCollectionAction,
  errorStallCollectionAction,
} from "@/store/reducers/stallCollection";
import fetchStalls from "@/api/stalls/fetchStalls";
import fetchUserPersonalData from "@/api/users/fetchUserPersonalData";
import {
  errorCaloricTrackerAction,
  loadCaloricTrackerAction,
  putCaloricTrackerAction,
} from "@/store/reducers/caloricTracker";
import fetchCaloricTracker from "@/api/caloric-tracker/fetchCaloricTracker";
import AutocompleteDropdownContextProvider from "@/components/providers/AutocompleteDropdownContextProvider";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <HydrateAuth />
      <HydrateCanteenCollection />
      <HydrateStallCollection />
      <HydrateCaloricTracker />

      <ComposeProviders
        providers={[HoldMenuProvider, AutocompleteDropdownContextProvider]}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ComposeProviders>
    </Provider>
  );
}

function HydrateAuth() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user !== null && !user.isAnonymous) {
        dispatch(signInAction());
        fetchUserPersonalData()
          .then((userData) => dispatch(putUserDataAction({ user: userData })))
          .catch((error: Error) => {
            dispatch(
              errorAuthAction({
                errorMessage: error.message,
              }),
            );
          });
      } else if (user === null) {
        dispatch(signOutAction());
        signInAnonymously(firebaseAuth);
      }

      // For debugging purposes
      //(async () => console.log(await user?.getIdToken()))();
    });
  }, []);

  return <></>;
}

function HydrateCanteenCollection() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadCanteenCollectionAction());

    fetchCanteens()
      .then((canteens) =>
        dispatch(putCanteenCollectionAction({ items: canteens })),
      )
      .catch((error: Error) =>
        dispatch(
          errorCanteenCollectionAction({
            errorMessage: error.message,
          }),
        ),
      );
  }, []);

  return <></>;
}

function HydrateStallCollection() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadStallCollectionAction());

    fetchStalls()
      .then((stalls) => dispatch(putStallCollectionAction({ items: stalls })))
      .catch((error: Error) =>
        dispatch(
          errorStallCollectionAction({
            errorMessage: error.message,
          }),
        ),
      );
  }, []);

  return <></>;
}

function HydrateCaloricTracker() {
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);
  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

  React.useEffect(() => {
    if (auth.isAuthenticated && caloricTracker.isUnassigned) {
      dispatch(loadCaloricTrackerAction());
      fetchCaloricTracker()
        .then(
          (caloricTracker) =>
            caloricTracker &&
            dispatch(putCaloricTrackerAction({ caloricTracker })),
        )
        .catch((error: Error) =>
          dispatch(
            errorCaloricTrackerAction({
              errorMessage: "Failed to fetch caloric tracker: " + error.message,
            }),
          ),
        );
    }
  }, [auth.isAuthenticated]);

  return <></>;
}
