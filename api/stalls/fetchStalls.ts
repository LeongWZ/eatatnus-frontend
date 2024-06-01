import { Stall } from "@/app/types";

export default async function fetchStalls(): Promise<Stall[]> {
    return fetch(`https://eatatnus-backend.onrender.com/api/stalls`)
      .then(response => response.json())
      .then(result => result.data.items);
}