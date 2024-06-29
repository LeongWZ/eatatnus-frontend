import { Review } from "@/app/types";
import fetchImageFromUri from "@/utils/fetchImageFromUri";
import { User } from "firebase/auth";
import path from "path";
import s3Put from "../s3/s3Put";

type PutData = {
  rating: number;
  description: string | null;
  imageUris: string[];
};

export default async function editStallReview(
  user: User,
  reviewId: number,
  data: PutData,
) {
  return user
    .getIdToken()
    .then((token) =>
      fetch(
        `https://eatatnus-backend-xchix.ondigitalocean.app/api/reviews/${reviewId}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: data.rating,
            description: data.description,
            imageFilenames: data.imageUris.map((uri) =>
              path.basename(uri.split("?")[0]),
            ),
          }),
        },
      ),
    )
    .then((response) => response.json())
    .then((result) => {
      if (result["error"]) {
        throw new Error(JSON.stringify(result.error));
      }

      return result.data as Review;
    })
    .then(async (review) => {
      const urls = review.images.map((image) => image.url);

      await Promise.all(
        data.imageUris.map((uri) =>
          fetchImageFromUri(uri).then((image) => {
            const url = urls.find((url) => url.includes(path.basename(uri)));
            if (url) {
              return s3Put(url, image);
            }
          }),
        ),
      );

      return review;
    });
}
