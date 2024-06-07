import { OutletReview } from "@/app/types";
import React from "react";
import { Text, View } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { User } from "firebase/auth";

// @ts-expect-error: No declaration file for module
import { HoldItem } from "react-native-hold-menu";


type OutletReviewProps = {
  outletReview: OutletReview;
  user: User | null;
  onEdit: () => void;
  onDelete: () => void;
};

export default function OutletReviewCard(props: OutletReviewProps) {
  const { outletReview, user, onEdit, onDelete } = props;
  
  const copyToClipboard = () => {
    Clipboard.setStringAsync(`${outletReview.user.name}: ${outletReview.description}`)
  }

  const MenuItems = [
    { text: "Copy", icon: "copy", onPress: copyToClipboard },
    ...(user?.displayName === outletReview.user.name
      ? [{ text: "Edit", icon: "edit", onPress: onEdit }]
      : []
    ),
    ...(user?.displayName === outletReview.user.name
      ? [{ text: "Delete", icon: "trash", isDestructive: true, onPress: onDelete }]
      : []
    ),
  ];

  return (
    <HoldItem items={MenuItems}>
      <View className="border mt-2 p-2 bg-white">
        <Text>By {outletReview.user.name}</Text>
        <Text>Rating: {outletReview.rating}</Text>
        <Text>Seat availability: {outletReview.seatAvailability}</Text>
        <Text>Cleanliness: {outletReview.cleanliness}</Text>
        <Text>Description: {outletReview.description}</Text>
      </View>
    </HoldItem>
  );
}