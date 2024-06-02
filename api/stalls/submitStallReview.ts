import { User } from "firebase/auth";

type PostData = {
    stallId: number,
    rating: number,
    description: string | null;
}

export default async function submitStallReview(user: User, data: PostData) {
    return user.getIdToken()
        .then(token => fetch(`https://eatatnus-backend.onrender.com/api/stalls/review`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }));
}