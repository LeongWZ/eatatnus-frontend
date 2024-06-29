import { Review } from "@/app/types";
import roundToNthDecimalPlace from "./roundToNthDecimalPlace";

export default function getAverageRating(reviews: Review[]) {
  return roundToNthDecimalPlace(
    reviews.map((review) => review.rating).reduce((acc, x) => acc + x, 0) /
      Math.max(reviews.length, 1),
    1,
  );
}
