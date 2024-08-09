import { Canteen } from "@/app/types";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Rating } from "@kolking/react-native-rating";
import getAverageRating from "@/utils/getAverageRating";
import * as Location from "expo-location";
import measureDistance from "@/utils/measureDistance";

type CanteenPreviewProps = {
  canteen: Canteen;
  userLocation?: Location.LocationObject;
};

export default function CanteenPreview(props: CanteenPreviewProps) {
  const { canteen, userLocation } = props;

  const distanceToUser: number | undefined = userLocation
    ? measureDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        canteen.location.latitude,
        canteen.location.latitude,
      ) / 1000
    : undefined;

  return (
    <Link
      href={{
        pathname: "/canteens/[id]",
        params: { id: canteen.id },
      }}
      asChild
    >
      <TouchableOpacity className="border p-4 my-2 rounded-xl space-y-1">
        <Text className="text-xl">{canteen.name}</Text>
        <Text className="text-base">{canteen.location.address}</Text>
        <Rating
          size={20}
          rating={getAverageRating(canteen.reviews)}
          disabled={true}
          style={{ paddingVertical: 4 }}
        />
        {distanceToUser !== undefined && (
          <Text>{`Distance: ${distanceToUser.toFixed(2)} km`}</Text>
        )}
      </TouchableOpacity>
    </Link>
  );
}
