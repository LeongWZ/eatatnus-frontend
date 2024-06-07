import { User } from "firebase/auth";

export default async function deleteStallReview(user: User, reviewId: number) {
    return user.getIdToken()
        .then(token => fetch(`https://eatatnus-backend.onrender.com/api/stalls/review`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ reviewId: reviewId })
        }))
        .then(response => response.json())
        .then(result => {
            if (result["error"]) {
                throw new Error(JSON.stringify(result.error));
            }
            return result;
        });
}