import { Review } from "@/app/types";
import fetchImageFromUri from "@/utils/fetchImageFromUri";
import { User } from "firebase/auth";
import s3Put from "../s3/s3Put";

type PostData = {
    canteenId: number,
    rating: number,
    description: string | null;
    imageUris: string[]
}

export default async function submitReview(user: User, data: PostData) {
    return user.getIdToken()
        .then(token => fetch(`https://eatatnus-backend.onrender.com/api/canteens/review`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                canteenId: data.canteenId,
                rating: data.rating,
                description: data.description,
                imageFilenames: data.imageUris.map(getFilenameFromUri)
            })
        }))
        .then(response => response.json())
        .then(result => {
            if (result["error"]) {
                throw new Error(JSON.stringify(result.error));
            }
            
            return result.data as Review;
        })
        .then(async review => {
            const urls = review.images.map(image => image.url);

            await Promise.all(
                data.imageUris.map(uri => fetchImageFromUri(uri)
                    .then(image => {
                        const url = urls.find(url => url.includes(getFilenameFromUri(uri)));
                        if (url) {
                            return s3Put(url, image);
                        }
                    })
                )
            );

            return review;
        });
}

function getFilenameFromUri(uri: string) {
    return uri.split("/").at(-1) ?? uri;
}