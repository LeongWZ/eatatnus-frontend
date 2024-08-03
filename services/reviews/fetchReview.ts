import { Review } from "@/app/types";

export default async function fetchReview(reviewId: number) {
  return fetch(
    `https://eatatnus-backend-xchix.ondigitalocean.app/api/reviews/${reviewId}`,
  )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }

      return result.data as Review;
    });
}
