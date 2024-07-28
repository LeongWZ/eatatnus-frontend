import { Canteen } from "@/app/types";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import getDistanceToUser from "@/utils/getDistanceToUser";
import { Rating } from "@kolking/react-native-rating";
import getAverageRating from "@/utils/getAverageRating";

type CanteenPreviewProps = {
  canteen: Canteen;
};

export default function CanteenPreview({ canteen }: CanteenPreviewProps) {
  const [distanceToUser, setDistanceToUser] = React.useState<number | null>(
    null,
  );

  React.useEffect(() => {
    getDistanceToUser(canteen.location.latitude, canteen.location.longitude)
      .then((distance) => setDistanceToUser(distance))
      .catch((error) => {
        console.error(error);
        setDistanceToUser(null);
      });
  }, [canteen]);

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
        {distanceToUser !== null && (
          <Text>{`Distance: ${distanceToUser} meters`}</Text>
        )}
      </TouchableOpacity>
    </Link>
  );
}
