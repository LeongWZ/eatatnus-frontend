import { Stall } from "@/app/types";

export default async function fetchStalls(): Promise<Stall[]> {
    return fetch(`https://eatatnus-backend-xchix.ondigitalocean.app/api/stalls`)
      .then(response => response.json())
      .then(result => result.data.items);
}