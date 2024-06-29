import { getAuth } from "firebase/auth";

export default async function signOut() {
  const auth = getAuth();
  return auth.signOut();
}
