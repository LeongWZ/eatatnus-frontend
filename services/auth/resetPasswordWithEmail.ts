import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function resetPasswordWithEmail(email: string) {
  const auth = getAuth();
  return sendPasswordResetEmail(auth, email);
}
