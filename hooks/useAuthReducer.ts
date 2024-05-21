export type AuthStatus = {
    data: "AUTHENTICATED" | "NOT_AUTHENTICATED" | "LOADING";
    error_message: string | null;
}

export type AuthStatusAction = {
    type: "SIGN_IN" | "SIGN_OUT" | "SIGN_IN_SUCCESS" | "SIGN_OUT_SUCCESS" | "ERROR";
    error_message: string | null;
}

function authReducer(state: AuthStatus, action: AuthStatusAction): AuthStatus {
    switch (action.type) {
        case "SIGN_IN":
            return { data: "LOADING", error_message: null }
        case "SIGN_OUT":
            return { data: "LOADING", error_message: null }
        case "SIGN_IN_SUCCESS":
            return { data: "AUTHENTICATED", error_message: null }
        case "SIGN_OUT_SUCCESS":
            return { data: "NOT_AUTHENTICATED", error_message: null }
        case "ERROR":
            return { data: "NOT_AUTHENTICATED", error_message: action.error_message }
        default:
            throw new Error("Invalid action type: " + action.type + " in useAuthReducer");
    }
}

export default function useAuthReducer() {
    return authReducer;
}