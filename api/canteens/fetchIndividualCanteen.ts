import { Canteen } from "@/app/types";

// Change this to your local IP address;
const localIp = "192.168.1.11:3000";

export default async function fetchIndividualCanteen(canteenId: number): Promise<Canteen> {
    return fetch(`http://${localIp}/api/canteens/${canteenId}`)
        .then(response => response.json())
        .then(result => result.data);
}