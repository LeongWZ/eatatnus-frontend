import createCaloricTracker from "@/api/caloric-tracker/createCaloricTracker";
import createCaloricTrackerEntry from "@/api/caloric-tracker/createCaloricTrackerEntry";
import deleteCaloricTrackerEntry from "@/api/caloric-tracker/deleteCaloricTrackerEntry";
import editCaloricTrackerEntry from "@/api/caloric-tracker/editCaloricTrackerEntry";
import CaloricTrackerDraftView from "@/components/caloric-tracker/CaloricTrackerDraftView";
import CaloricTrackerEntryView from "@/components/caloric-tracker/CaloricTrackerEntryView";
import { RootState } from "@/store";
import {
  errorCaloricTrackerAction,
  putCaloricTrackerAction,
  putCaloricTrackerDraftAction,
  addCaloricTrackerEntryAction,
  deleteCaloricTrackerEntryAction,
  editCaloricTrackerEntryAction,
} from "@/store/reducers/caloricTracker";
import { Link } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function CaloricTracker() {
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

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
          <Text className="text-xl">Create Caloric Tracker</Text>
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
    <ScrollView className="p-2">
      <CaloricTrackerDraftView
        foods={caloricTracker.draft}
        editDraft={(foods) => dispatch(putCaloricTrackerDraftAction({ foods }))}
        submitDraft={(foods) => {
          createCaloricTrackerEntry(foods)
            .then((entry) =>
              dispatch(addCaloricTrackerEntryAction({ item: entry })),
            )
            .catch((error: Error) => {
              dispatch(
                errorCaloricTrackerAction({ errorMessage: error.message }),
              );
              Alert.alert("Failed to create entry: " + error.message);
            });
        }}
      />

      {caloricTracker.caloricTrackerEntries.map((entry) => (
        <CaloricTrackerEntryView
          entry={entry}
          key={entry.id}
          deleteEntry={() =>
            deleteCaloricTrackerEntry(entry.id)
              .then(() =>
                dispatch(deleteCaloricTrackerEntryAction({ item: entry })),
              )
              .catch((error: Error) => {
                dispatch(
                  errorCaloricTrackerAction({ errorMessage: error.message }),
                );
                Alert.alert("Failed to delete entry: " + error.message);
              })
          }
          editEntry={(foods) =>
            editCaloricTrackerEntry(entry.id, foods)
              .then((entry) =>
                dispatch(editCaloricTrackerEntryAction({ item: entry })),
              )
              .catch((error: Error) => {
                dispatch(
                  errorCaloricTrackerAction({ errorMessage: error.message }),
                );
                Alert.alert("Failed to delete entry: " + error.message);
              })
          }
        />
      ))}
    </ScrollView>
  );
}
