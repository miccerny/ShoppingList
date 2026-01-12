/**
 * Session context.
 *
 * Responsibilities:
 * - Manages authentication session state.
 * - Loads current user information on application start.
 * - Exposes session data and updater function to the application.
 * - Triggers guest-to-user data synchronization after login.
 *
 * Note:
 * This context represents the single source of truth
 * for authentication state on the frontend.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../utils/api.jsx";
import { HttpRequestError } from "../Error/HttpRequstError";
import { syncGuestListAfterLogin } from "../Lists/GuestList";

/**
 * Default session context value.
 *
 * Structure:
 * - session.data   → authenticated user data or null
 * - session.status → "loading" | "authenticated" | "unauthenticated"
 *
 * My note:
 * Default values are mainly useful for development and tooling.
 */
const SessionContext = createContext({
    session: { 
        data: null, status: "loading" },
         setSession: (data) => {
    }
});

/**
 * Custom hook for accessing session context.
 *
 * @returns {Object} Session context value
 *
 * Note:
 * This hook assumes it is used inside SessionProvider.
 */
export function useSession() {
    return useContext(SessionContext);
}

/**
 * SessionProvider component.
 *
 * Wraps the application and provides authentication
 * state to all descendant components.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children Child components
 */
export const SessionProvider = ({ children }) => {

    /**
     * Session state.
     *
     * - data   → user information returned from backend
     * - status → current authentication status
     */
    const [sessionState, setSessionState] = useState({ 
        data: null, 
        status: "loading" 
    });

    /**
     * Effect triggered after successful authentication.
     *
     * Note:
     * Synchronizes guest-created lists with the authenticated user
     * once the session becomes authenticated.
     */
    useEffect(() => {
        if (sessionState.status === "authenticated" && sessionState.data) {
            syncGuestListAfterLogin();
        }
    }, [sessionState.status]);

    /**
     * Effect executed once on application startup.
     *
     * Behavior:
     * - Requests current user info from backend (/me endpoint)
     * - Updates session state based on response
     */
    useEffect(() => {
        console.log("SESSION USE apiGet:", apiGet);
        apiGet("/me")
            .then(data => setSessionState({ data, status: "authenticated" }))
            .catch(e => {

                 /**
                 * Unauthorized response handling.
                 *
                 * My note:
                 * 401 indicates that the user is not logged in,
                 * which is a valid and expected state.
                 */
                if (e instanceof HttpRequestError &&
                     e.response?.status === 401
                    ) {
                    // bezpečně zkontroluj status
                    setSessionState({ data: null,
                         status: "unauthenticated" 
                        });
                    return;
                }

                // Any other error is treated as a session load failure
                console.error("Session load failed:", e);
                setSessionState({ data: null,
                     status: "unauthenticated" 
                    });
            });
    }, []);

    return (
        <SessionContext.Provider value={{ 
            session: sessionState,
             setSession: setSessionState 
             }}>
            {children}
        </SessionContext.Provider>
    );
};