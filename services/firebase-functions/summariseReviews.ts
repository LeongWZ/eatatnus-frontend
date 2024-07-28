import { Review } from "@/app/types";
import { generateContent } from "./generateContent";

export default async function summariseReviews(
  reviews: Review[],
): Promise<string> {
  if (reviews.length === 0) {
    return "";
  }

  const reviewsToString = reviews
    .map((review) =>
      JSON.stringify({
        reviewer: `${review.user?.name ?? "Deleted User"}`,
        rating: review.rating,
        description: review.description,
      }),
    )
    .join(",");

  return generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Only respond in Markdown format as specified in the following.
              Give me short useful excerpts from several reviews along with the reviwer name,
              e.g. "This place is so good. Food is good and cheap" - john doe.
              Filter out any gibberish reviews.
              Reviews: ${reviewsToString}`,
          },
        ],
      },
    ],
  })
    .then((result) => result.data)
    .catch((error) => {
      console.log(error);
      return "";
    });
}
