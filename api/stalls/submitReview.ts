import { Review } from "@/app/types";
import fetchImageFromUri from "@/utils/fetchImageFromUri";
import { User } from "firebase/auth";
import s3Put from "../s3/s3Put";
import path from "path";

type PostData = {
  stallId: number;
  rating: number;
  description: string | null;
  imageUris: string[];
};

export default async function submitReview(user: User, data: PostData) {
  return user
    .getIdToken()
    .then((token) =>
      fetch(
        `https://eatatnus-backend-xchix.ondigitalocean.app/api/stalls/${data.stallId}/review`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: data.rating,
            description: data.description,
            imageFilenames: data.imageUris.map((uri) => path.basename(uri)),
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
            const url = urls.find(
              (url) => url?.includes(path.basename(uri)) ?? false,
            );
            if (url) {
              return s3Put(url, image);
            }
          }),
        ),
      );

      return review;
    });
}
