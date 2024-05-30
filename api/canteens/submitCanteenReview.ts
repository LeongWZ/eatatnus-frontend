import { User } from "firebase/auth";

// Change this to your local IP address;
const localIp = "192.168.1.11:3000";

type PostData = {
    canteenId: number,
    rating: number,
    description: string | null;
    cleanliness: number;
    seatAvailability: number;
}

export default async function submitCanteenReview(user: User, data: PostData) {
    return user.getIdToken()
        .then(token => fetch(`http://${localIp}/api/canteens/review`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }));
}