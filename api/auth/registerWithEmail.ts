import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default async function registerWithEmail(email: string, password: string, displayName: string) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => updateProfile(userCredential.user, { displayName: displayName }));
}