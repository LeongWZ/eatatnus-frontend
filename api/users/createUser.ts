import { User } from "@/app/types";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default async function createUser(
  name: string,
  bio?: string,
): Promise<User> {
  const firebaseUser: FirebaseUser | null = auth.currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(`https://eatatnus-backend-xchix.ondigitalocean.app/api/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          bio: bio,
        }),
      }),
    )
    .then((res) => res.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }

      return result.data;
    });
}
