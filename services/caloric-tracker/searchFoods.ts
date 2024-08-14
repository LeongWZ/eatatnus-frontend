import { Food } from "@/app/types";

export default async function searchFoods(
  q: string,
  limit?: number,
): Promise<Food[]> {
  return fetch(
    limit !== undefined
      ? `https://eatatnus-backend-xchix.ondigitalocean.app/api/caloric-tracker/search/?q=${q}&limit=${limit}`
      : `https://eatatnus-backend-xchix.ondigitalocean.app/api/caloric-tracker/search/?q=${q}`,
  )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }
      return result.data;
    })
    .then((data) => data.items as Food[]);
}
