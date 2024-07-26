import { CaloricTrackerEntry, Food } from "@/app/types";
import { User as FirebaseUser, getAuth } from "firebase/auth";

export default async function editCaloricTrackerEntry(
  caloricTrackerEntryId: number,
  foods: Omit<Food, "id">[],
): Promise<CaloricTrackerEntry> {
  const firebaseUser: FirebaseUser | null = getAuth().currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(
        "https://eatatnus-backend-xchix.ondigitalocean.app/api/caloric-tracker/entry",
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            caloricTrackerEntryId: caloricTrackerEntryId,
            foods: foods,
          }),
        },
      ),
    )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(result.error);
      }
      return result.data as CaloricTrackerEntry;
    });
}
