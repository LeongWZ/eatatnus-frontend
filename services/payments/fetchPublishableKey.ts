export default async function fetchPublishableKey(
  stallId?: number,
): Promise<{ publishableKey: string; stripeAccountId?: string }> {
  return fetch(
    `https://eatatnus-backend-xchix.ondigitalocean.app/api/payments/publishable-key/?stallId=${stallId}`,
  )
    .then((response) => response.json())
    .then((result) => result.data);
}
