import AuthContext from "@/contexts/AuthContext";
import useAuthReducer from "@/hooks/useAuthReducer";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { auth as firebaseAuth } from "../../firebaseConfig";

type AuthProviderProps = {
  children: React.ReactElement;
};

export default function AuthProvider(props: AuthProviderProps) {
  const [auth, dispatchAuth] = useAuthReducer({
    user: null,
    status: "NOT_AUTHENTICATED",
    error_message: null,
  });

  React.useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, (user) => {
        dispatchAuth({
          type: user ? "SIGN_IN_SUCCESS" : "SIGN_OUT_SUCCESS",
          ...(user && { payload: { user: user } }),
        });

        // For debugging purposes
        //(async () => console.log(await user?.getIdToken()))()
      }),
    [],
  );

  return (
    <AuthContext.Provider value={{ auth: auth, dispatchAuth: dispatchAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
}
