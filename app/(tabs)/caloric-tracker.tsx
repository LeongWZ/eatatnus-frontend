import createCaloricTracker from "@/api/caloric-tracker/createCaloricTracker";
import fetchCaloricTracker from "@/api/caloric-tracker/fetchCaloricTracker";
import { RootState } from "@/store";
import {
  errorCaloricTrackerAction,
  loadCaloricTrackerAction,
  putCaloricTrackerAction,
} from "@/store/reducers/caloricTracker";
import { Link } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function CaloricTracker() {
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

  React.useEffect(() => {
    dispatch(loadCaloricTrackerAction());

    if (auth.isAuthenticated && caloricTracker.isUnassigned) {
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
  }, [auth]);

  if (!auth.isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-center px-10">
          You have to sign in before using Caloric Tracker
        </Text>
        <Link href="/signin" asChild>
          <TouchableOpacity className="border rounded-lg py-2 px-10 mt-4">
            <Text className="text-xl">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  if (caloricTracker.isUnassigned) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-center px-10">
          Create caloric tracker
        </Text>
        <TouchableOpacity
          className="border rounded-lg py-2 px-10 mt-4"
          onPress={() =>
            createCaloricTracker()
              .then(
                (caloricTracker) =>
                  caloricTracker &&
                  dispatch(putCaloricTrackerAction({ caloricTracker })),
              )
              .catch((error: Error) =>
                dispatch(
                  errorCaloricTrackerAction({
                    errorMessage:
                      "Failed to fetch caloric tracker: " + error.message,
                  }),
                ),
              )
          }
        >
          <Text className="text-xl">Create</Text>
        </TouchableOpacity>
        {caloricTracker.errorMessage && (
          <Text className="text-red-400 m-2">
            {caloricTracker.errorMessage}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View>
      <Text className="xl">Caloric Tracker</Text>
    </View>
  );
}
