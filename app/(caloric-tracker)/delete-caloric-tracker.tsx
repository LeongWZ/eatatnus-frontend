import { Link, useNavigation, useRouter } from "expo-router";
import { Text, View, Button, Pressable } from "react-native";
import React from "react";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import ErrorView from "@/components/ErrorView";
import {
  deleteCaloricTrackerAction,
  errorCaloricTrackerAction,
  loadCaloricTrackerAction,
} from "@/store/reducers/caloricTracker";
import deleteCaloricTracker from "@/api/caloric-tracker/deleteCaloricTracker";

export default function DeleteCaloricTracker() {
  const auth = useSelector((state: RootState) => state.auth);
  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const onDeleteCaloricTracker = () => {
    if (caloricTracker.isUnassigned) {
      return;
    }

    dispatch(loadCaloricTrackerAction());

    deleteCaloricTracker()
      .then(() => dispatch(deleteCaloricTrackerAction()))
      .then(() =>
        router.canGoBack() ? router.back() : router.push("/settings"),
      )
      .catch((err) =>
        dispatch(
          errorCaloricTrackerAction({
            errorMessage: "Failed to delete account: " + err.message,
          }),
        ),
      );
  };

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Delete Caloric Tracker",
    });
  }, [navigation]);

  if (!auth.isAuthenticated || caloricTracker.isUnassigned) {
    return <ErrorView />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 h-fit p-4 border rounded-lg">
        <Text className="text-2xl mb-2">Delete Caloric Tracker</Text>

        <Text className="mt-4">
          Are you sure that you would like to delete Caloric Tracker? All
          entries will be lost.
        </Text>

        <View className="flex-row justify-center gap-x-4 mt-5">
          <View className="grow rounded">
            <Button title="Confirm" onPress={onDeleteCaloricTracker} />
          </View>

          <Link
            href="/settings"
            className="grow bg-gray-500 p-2 items-center"
            asChild
          >
            <Pressable>
              <Text className="text-white uppercase">Cancel</Text>
            </Pressable>
          </Link>
        </View>

        {caloricTracker.loading && <Text className="mt-2">Loading...</Text>}

        {caloricTracker.errorMessage && (
          <Text className="text-red-500 mt-2">
            {caloricTracker.errorMessage}
          </Text>
        )}
      </View>
    </View>
  );
}
