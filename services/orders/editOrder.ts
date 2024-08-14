import { Order, FoodsOnOrders } from "@/app/types";
import DraftItem from "@/store/interfaces/DraftItem";
import { User as FirebaseUser, getAuth } from "firebase/auth";

export default async function editOrder(
  orderId: number,
  items: FoodsOnOrders[],
  newItems?: DraftItem[],
): Promise<Order> {
  const firebaseUser: FirebaseUser | null = getAuth().currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(
        `https://eatatnus-backend-xchix.ondigitalocean.app/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: items,
            ...(newItems && { newItems: newItems }),
          }),
        },
      ),
    )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }
      return result.data as Order;
    });
}
