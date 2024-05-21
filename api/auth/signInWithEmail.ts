import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default async function signInWithEmail(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
}