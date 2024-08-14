import { Order } from "@/app/types";
import DraftItem from "@/store/interfaces/DraftItem";
import { User as FirebaseUser, getAuth } from "firebase/auth";

export default async function createOrder(
  stallId: number,
  items: DraftItem[],
): Promise<Order> {
  const firebaseUser: FirebaseUser | null = getAuth().currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch("https://eatatnus-backend-xchix.ondigitalocean.app/api/orders", {
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
      return result.data as Order;
    });
}
