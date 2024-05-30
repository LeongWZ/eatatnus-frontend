import { Auth, AuthAction } from "@/hooks/useAuthReducer";
import React, { Dispatch } from "react";


type AuthReducer = {
    auth: Auth,
    dispatchAuth: Dispatch<AuthAction>
};

const AuthContext = React.createContext<AuthReducer>({
    auth: {
        user: null,
        status: "NOT_AUTHENTICATED",
        error_message: null,
    },
    dispatchAuth: authAction => {},
});

export default AuthContext;