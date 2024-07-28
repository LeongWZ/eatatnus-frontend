import createCaloricTracker from "@/services/caloric-tracker/createCaloricTracker";
import createCaloricTrackerEntry from "@/services/caloric-tracker/createCaloricTrackerEntry";
import deleteCaloricTrackerEntry from "@/services/caloric-tracker/deleteCaloricTrackerEntry";
import editCaloricTrackerEntry from "@/services/caloric-tracker/editCaloricTrackerEntry";
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
import { View, Text, TouchableOpacity, Alert, SectionList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CaloricTrackerEntry, FoodsOnCaloricTrackerEntries } from "../types";
import DraftItem from "@/store/interfaces/DraftItem";

export default function CaloricTracker() {
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

  const editDraft = (items: DraftItem[]) =>
    dispatch(putCaloricTrackerDraftAction({ items }));

  const submitDraft = (items: DraftItem[]) =>
    createCaloricTrackerEntry(items)
      .then((entry) => dispatch(addCaloricTrackerEntryAction({ item: entry })))
      .catch((error: Error) => {
        dispatch(
          errorCaloricTrackerAction({
            errorMessage: error.message,
          }),
        );
        Alert.alert(`Failed to create entry: ${error.message}`);
      });

  const deleteEntryFn = (entry: CaloricTrackerEntry) => () =>
    deleteCaloricTrackerEntry(entry.id)
      .then(() => dispatch(deleteCaloricTrackerEntryAction({ item: entry })))
      .catch((error: Error) => {
        dispatch(
          errorCaloricTrackerAction({
            errorMessage: error.message,
          }),
        );
        Alert.alert(`Failed to create entry: ${error.message}`);
      });

  const editEntryFn =
    (entry: CaloricTrackerEntry) =>
    (items: FoodsOnCaloricTrackerEntries[], newItems?: DraftItem[]) =>
      editCaloricTrackerEntry(entry.id, items, newItems)
        .then((entry) =>
          dispatch(editCaloricTrackerEntryAction({ item: entry })),
        )
        .catch((error: Error) => {
          dispatch(
            errorCaloricTrackerAction({
              errorMessage: error.message,
            }),
          );
          Alert.alert("Failed to delete entry: " + error.message);
        });

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
    <View className="p-2">
      <SectionList
        sections={[
          {
            data: [
              // dummy data to make the section list work
              {
                id: NaN,
                createdAt: "",
                updatedAt: "",
                foods: [],
                caloricTrackerId: NaN,
              },
            ],
            renderItem: ({ item }) => (
              <CaloricTrackerDraftView
                items={caloricTracker.draft}
                editDraft={editDraft}
                submitDraft={submitDraft}
              />
            ),
          },
          {
            data: caloricTracker.caloricTrackerEntries,
            renderItem: ({ item }) => (
              <CaloricTrackerEntryView
                entry={item}
                key={item.id}
                deleteEntry={deleteEntryFn(item)}
                editEntry={editEntryFn(item)}
              />
            ),
          },
        ]}
        keyExtractor={(item, index) => item.id.toString() + index}
      />
    </View>
  );
}
