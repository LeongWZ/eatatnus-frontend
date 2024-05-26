import { auth } from "../firebaseConfig";
import { User } from "firebase/auth";

export default function getUser(): User | null {
    return auth?.currentUser;
}