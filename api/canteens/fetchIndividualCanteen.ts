import { Canteen } from "@/app/types";

export default async function fetchIndividualCanteen(canteenId: number): Promise<Canteen> {
    return fetch(`https://eatatnus-backend.onrender.com/api/canteens/${canteenId}`)
        .then(response => response.json())
        .then(result => result.data);
}