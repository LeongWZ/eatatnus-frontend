import { Canteen, Stall } from "@/app/types";
import getAverageRating from "@/utils/getAverageRating";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Rating } from "@kolking/react-native-rating";

type StallPreviewProps = {
  stall: Stall;
  canteen?: Canteen;
};

export default function StallPreview(props: StallPreviewProps) {
  const { stall, canteen } = props;

  return (
    <Link
      href={{
        pathname: "/stalls/[id]",
        params: { id: stall.id },
      }}
      asChild
    >
      <TouchableOpacity className="border px-2 py-4 my-2 rounded-xl">
        <Text className="text-xl">{stall.name}</Text>
        {canteen && <Text className="text-l">{canteen?.name}</Text>}
        <Rating
          size={20}
          rating={getAverageRating(stall.reviews)}
          onChange={() => {}}
          disabled={true}
          style={{ paddingVertical: 4 }}
        />
        <Text>{stall.description}</Text>
      </TouchableOpacity>
    </Link>
  );
}
