import { User } from "firebase/auth";

type PutData = {
    rating: number,
    description: string | null;
}

export default async function editStallReview(user: User, reviewId: number, data: PutData) {
    return user.getIdToken()
        .then(token => fetch(`https://eatatnus-backend.onrender.com/api/reviews/${reviewId}`, {
            method: "PATCH",
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