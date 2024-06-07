import { User } from "firebase/auth";

type PutData = {
    reviewId: number,
    rating: number,
    description: string | null;
}

export default async function editStallReview(user: User, data: PutData) {
    return user.getIdToken()
        .then(token => fetch(`https://eatatnus-backend.onrender.com/api/stalls/review`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }))
        .then(response => response.json())
        .then(result => {
            if (result["error"]) {
                throw new Error(JSON.stringify(result.error));
            }
            return result;
        });
}