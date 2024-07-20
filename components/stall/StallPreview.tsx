import { Canteen, Stall } from "@/app/types";
import getAverageRating from "@/utils/getAverageRating";
import { Link } from "expo-router";
import React from "react";
import { Text, Pressable } from "react-native";
import { Rating } from "@kolking/react-native-rating";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

type StallPreviewProps = {
  stall: Stall;
  includeCanteenName?: boolean;
};

export default function StallPreview(props: StallPreviewProps) {
  const { stall, includeCanteenName } = props;
  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === stall.canteenId,
  );

  return (
    <Link
      href={{
        pathname: "/stalls/[id]",
        params: { id: stall.id },
      }}
      asChild
    >
      <Pressable
        className={`
                border
                px-2
                py-4
                my-2
                rounded-xl
                active:bg-slate-400
                `}
      >
        <Text className="text-xl">{stall.name}</Text>
        {includeCanteenName && <Text className="text-l">{canteen?.name}</Text>}
        <Rating
          size={20}
          rating={getAverageRating(stall.reviews)}
          onChange={() => {}}
          disabled={true}
          style={{ paddingVertical: 4 }}
        />
        <Text>{stall.description}</Text>
      </Pressable>
    </Link>
  );
}
