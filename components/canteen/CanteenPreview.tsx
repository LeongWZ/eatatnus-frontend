import { Canteen } from "@/app/types";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import getDistanceToUser from "@/utils/getDistanceToUser";

type CanteenPreviewProps = {
  canteen: Canteen;
};

export default function CanteenPreview({ canteen }: CanteenPreviewProps) {
  const [distanceToUser, setDistanceToUser] = React.useState<number>(-1);

  React.useEffect(() => {
    getDistanceToUser(
      canteen.location.latitude,
      canteen.location.longitude,
    ).then((distance) => setDistanceToUser(distance));
  }, [canteen]);

  return (
    <Link
      href={{
        pathname: "/canteens/[id]",
        params: { id: canteen.id },
      }}
      asChild
    >
      <TouchableOpacity className="border rounded-lg px-2 my-2">
        <Text>{canteen.name}</Text>
        <Text>{canteen.description}</Text>
        <Text>{canteen.location.address}</Text>
        <Text>
          {distanceToUser === -1
            ? "Calculating distance..."
            : `Distance: ${distanceToUser} meters`}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}
