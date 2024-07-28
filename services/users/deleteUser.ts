import { User } from "@/app/types";
import { User as FirebaseUser, getAuth } from "firebase/auth";

export default async function deleteUser(user: User): Promise<void> {
  const auth = getAuth();
  const firebaseUser: FirebaseUser | null = auth.currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser.getIdToken().then((token) =>
    fetch(
      `https://eatatnus-backend-xchix.ondigitalocean.app/api/users/${user.id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((result) => {
        if (result["error"]) {
          throw new Error(JSON.stringify(result.error));
        }
      })
      .then(() => auth.signOut()),
  );
}
