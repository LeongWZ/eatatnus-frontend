import { Food, Menu } from "@/app/types";
import { User as FirebaseUser, getAuth } from "firebase/auth";

export default async function createMenu(
  stallId: number,
  items: Omit<Food, "id">[],
): Promise<Menu> {
  const firebaseUser: FirebaseUser | null = getAuth().currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(`https://eatatnus-backend-xchix.ondigitalocean.app/api/menus`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stallId: stallId,
          items: items,
        }),
      }),
    )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }

      return result.data as Menu;
    });
}
