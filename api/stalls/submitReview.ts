import { User } from "firebase/auth";

type PostData = {
    stallId: number,
    rating: number,
    description: string | null;
}

export default async function submitReview(user: User, data: PostData) {
    return user.getIdToken()
        .then(token => fetch(`https://eatatnus-backend.onrender.com/api/stalls/review`, {
            method: "POST",
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
        });;
}