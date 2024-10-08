import { Stall } from "@/app/types";

export default async function fetchIndividualStall(
  stallId: number,
): Promise<Stall> {
  return fetch(
    `https://eatatnus-backend-xchix.ondigitalocean.app/api/stalls/${stallId}`,
  )
    .then((response) => response.json())
    .then((result) => result.data);
}
