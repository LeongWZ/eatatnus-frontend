import * as Location from "expo-location";

export default async function getUserLocation(): Promise<Location.LocationObject> {
  return Location.requestForegroundPermissionsAsync().then(({ status }) => {
    if (status !== "granted") {
      throw new Error("Location permissions not granted");
    }
    return Location.getCurrentPositionAsync({});
  });
}
