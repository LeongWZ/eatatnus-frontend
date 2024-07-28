import { User as FirebaseUser, getAuth } from "firebase/auth";

export default async function deleteCaloricTrackerEntry(entryId: number) {
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
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ caloricTrackerEntryId: entryId }),
        },
      ),
    )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(result.error);
      }
      return result.data;
    });
}
