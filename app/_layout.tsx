import { Stack } from "expo-router";
import React from "react";
import ComposeProviders from "@/components/providers/ComposeProviders";
import HoldMenuProvider from "@/components/providers/HoldMenuProvider";
import { Provider, useDispatch } from "react-redux";
import store from "@/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth as firebaseAuth } from "../firebaseConfig";
import {
  signInAction,
  signOutAction,
  putUserDataAction,
  loadAuthAction,
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
import fetchUserPersonalData from "@/api/auth/fetchUserPersonalData";

const providers = [HoldMenuProvider];

function HydrateAuth() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user !== null) {
        dispatch(signInAction());
        fetchUserPersonalData()
          .then((userData) => dispatch(putUserDataAction({ user: userData })))
          .catch((error: Error) => {
            dispatch(
              errorAuthAction({
                errorMessage: error.message,
              }),
            );
            console.error(error);
          });
      } else {
        dispatch(signOutAction());
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

export default function RootLayout() {
  return (
    <Provider store={store}>
      <HydrateAuth />
      <HydrateCanteenCollection />
      <HydrateStallCollection />
      <ComposeProviders providers={providers}>
        <Stack>
          <Stack.Screen name="(main)/index" options={{ title: "eat@NUS" }} />
        </Stack>
      </ComposeProviders>
    </Provider>
  );
}
