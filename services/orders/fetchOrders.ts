import { Order } from "@/app/types";
import { User as FirebaseUser, getAuth } from "firebase/auth";

export default async function fetchOrders(): Promise<Order[]> {
  const firebaseUser: FirebaseUser | null = getAuth().currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(`https://eatatnus-backend-xchix.ondigitalocean.app/api/orders`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }
      return result.data.items as Order[];
    });
}
