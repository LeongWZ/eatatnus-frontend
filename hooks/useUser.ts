import { auth } from "../firebaseConfig";
import { User } from "firebase/auth";

export default function useUser(): User | null {
    return auth?.currentUser;
}