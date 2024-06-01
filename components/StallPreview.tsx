import { Canteen, Stall } from "@/app/types";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import { Link } from "expo-router";
import React from "react";
import { Text, Pressable } from "react-native";

type StallPreviewProps = {
    stall: Stall;
}

export default function StallPreview({stall}: StallPreviewProps) {
    const { canteenCollection, dispatchCanteenCollectionAction } = React.useContext(CanteenCollectionContext);
    const canteen: Canteen | undefined = canteenCollection.items
        .find(canteen => canteen.id === stall.canteenId);

    return (
        <Link href={{
            pathname: "/stalls/[id]",
            params: { id: stall.id }
            }} asChild>
            <Pressable className={`
                border-b
                px-2
                active:bg-slate-400
                `}>
                <Text>{stall.name}</Text>
                {canteen && (
                    <Text>Canteen: {canteen.name}</Text>
                )}
                <Text>{stall.description}</Text>
            </Pressable>
        </Link>
    );
}