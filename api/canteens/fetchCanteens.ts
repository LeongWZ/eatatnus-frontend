import { Canteen } from "@/app/types";

export default async function fetchCanteens(): Promise<Canteen[]> {
    return fetch(`https://eatatnus-backend.onrender.com/api/canteens`)
      .then(response => response.json())
      .then(result => result.data.items);
}