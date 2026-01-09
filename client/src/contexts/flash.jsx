import { createContext, useContext, useMemo, useState } from "react";

const FlashContext = createContext(null);
export function FlashProvider({ children }) {
    const [flash, setFlash] = useState(null);
    const value = useMemo(() => ({
        flash,
        showFlash: (type, message, timeoutMs = 2500) => {
            setFlash({ type, message });
            if (timeoutMs){
                window.setTimeout(() => setFlash(null), timeoutMs);
    }
        },
        clear: () => setFlash(null),
    }), [flash]);

    return (
        <FlashContext.Provider value={value}>
            {children}
        </FlashContext.Provider>
    );
}

export function useFlash() {
    const ctx = useContext(FlashContext);
    if (!ctx) throw new Error("useFlash must be used within a FlashProvider");
    return ctx;
}