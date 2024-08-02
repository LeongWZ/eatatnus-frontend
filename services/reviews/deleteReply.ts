import { getAuth, User as FirebaseUser } from "firebase/auth";

export default async function deleteReply(replyId: number) {
  const firebaseUser: FirebaseUser | null = getAuth().currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(
        `https://eatatnus-backend-xchix.ondigitalocean.app/api/reviews/reply`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            replyId: replyId,
          }),
        },
      ),
    )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }
      return result.data;
    });
}
