import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default async function registerWithEmail(
  email: string,
  password: string,
) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}
