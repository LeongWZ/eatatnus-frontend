import { PaymentSheetParams } from "@/app/types";
import { User as FirebaseUser, getAuth } from "firebase/auth";

export default async function fetchPaymentSheet(
  orderId: number,
): Promise<PaymentSheetParams> {
  const firebaseUser: FirebaseUser | null = getAuth().currentUser;

  if (!firebaseUser) {
    throw new Error("User is not signed in");
  }

  return firebaseUser
    .getIdToken()
    .then((token) =>
      fetch(
        `https://eatatnus-backend-xchix.ondigitalocean.app/api/payments/payment-sheet`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: orderId,
          }),
        },
      ),
    )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(result.error);
      }

      return result as PaymentSheetParams;
    });
}
