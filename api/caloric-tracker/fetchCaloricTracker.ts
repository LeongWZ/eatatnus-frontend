import { CaloricTracker } from "@/app/types";
import { User as FirebaseUser, getAuth } from "firebase/auth";

export default function fetchCaloricTracker(): Promise<CaloricTracker | null> {
  const firebaseUser: FirebaseUser | null = getAuth().currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(
        "https://eatatnus-backend-xchix.ondigitalocean.app/api/caloric-tracker/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
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
