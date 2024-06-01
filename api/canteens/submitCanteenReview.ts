import { User } from "firebase/auth";

type PostData = {
    canteenId: number,
    rating: number,
    description: string | null;
    cleanliness: number;
    seatAvailability: number;
}

export default async function submitCanteenReview(user: User, data: PostData) {
    return user.getIdToken()
        .then(token => fetch(`https://eatatnus-backend.onrender.com/api/canteens/review`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }));
}