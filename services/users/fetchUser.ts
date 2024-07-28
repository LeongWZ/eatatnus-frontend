import { User } from "@/app/types";

export default async function fetchUser(userId: number): Promise<User> {
  return fetch(
    `https://eatatnus-backend-xchix.ondigitalocean.app/api/users/${userId}`,
  )
    .then((res) => res.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }
      return result.data;
    });
}
