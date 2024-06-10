import { StallReview } from "@/app/types";
import roundToNthDecimalPlace from "./roundToNthDecimalPlace";

export default function getAverageRating(stallReviews: StallReview[]) {
    return roundToNthDecimalPlace(
        stallReviews.map(stallReview => stallReview.rating)
            .reduce((acc, x) => acc + x, 0) / Math.max(stallReviews.length, 1),
        1
    );
}