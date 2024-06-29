import getUserLocation from "./getUserLocation";
import measureDistance from "./measureDistance";

export default async function getDistanceToUser(
  latitude: number,
  longitude: number,
) {
  return getUserLocation().then((location) =>
    measureDistance(
      location.coords.latitude,
      location.coords.longitude,
      latitude,
      longitude,
    ),
  );
}
