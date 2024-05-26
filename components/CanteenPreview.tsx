import { Canteen } from "@/app/types";
import { Link } from "expo-router";
import React from "react";
import { Text, Pressable } from "react-native";
import getDistanceToUser from "@/utils/getDistanceToUser";

type CanteenPreviewProps = {
    canteen: Canteen;
}

export default function CanteenPreview({canteen}: CanteenPreviewProps) {
    const [distanceToUser, setDistanceToUser] = React.useState<number>(-1);

    React.useEffect(
        () => {
            getDistanceToUser(canteen.location.latitude, canteen.location.longitude)
                .then(distance => setDistanceToUser(distance));
        },
        [canteen.locationId]
    );

    return (
        <Link href="#" asChild>
            <Pressable className={`
                border-b
                px-2
                active:bg-slate-400
                `}>
                <Text>{canteen.name}</Text>
                <Text>{canteen.description}</Text>
                <Text>{canteen.location.address}</Text>
                <Text>
                    {distanceToUser === -1
                        ? "Calculating distance..."
                        : `Distance: ${distanceToUser} meters`}
                </Text>
            </Pressable>
        </Link>
    );
}