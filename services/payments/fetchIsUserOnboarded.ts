export default async function fetchIsUserOnboarded(
  userId: number,
): Promise<boolean> {
  return fetch(
    "https://eatatnus-backend-xchix.ondigitalocean.app/api/payments/onboarded",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    },
  )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(result.error);
      }
      return result.data;
    });
}
