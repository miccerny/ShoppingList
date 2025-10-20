import { createContext, useContext, useEffect, useState } from "react";
import {apiGet} from "../utils/api";
import { HttpRequestError } from "../Error/HttpRequstError";
import { syncGuestListAfterLogin } from "../Lists/GuestList";

const SessionContext = createContext({
    session: { data: null, status: "loading" }, setSession: (data) => {
    }
});

export function useSession() {
    return useContext(SessionContext);
}

export const SessionProvider = ({ children }) => {

    const [sessionState, setSessionState] = useState({ data: null, status: "loading" });

    useEffect(() => {
        if (sessionState.status === "authenticated") {
            syncGuestListAfterLogin();
        }
    }, [sessionState.status]);

    useEffect(() => {
        apiGet("/me")
            .then(data => setSessionState({ data, status: "authenticated" }))
            .catch(e => {
                if (e instanceof HttpRequestError) {
                    // bezpečně zkontroluj status
                    const status = e.response?.status;
                    if (status === 401) {
                        setSessionState({ data: null, status: "unauthenticated" });
                        return;
                    }
                }
                throw e;
            });
    }, []);


    return (
        <SessionContext.Provider value={{ session: sessionState, setSession: setSessionState }}>
            {children}
        </SessionContext.Provider>
    );

};