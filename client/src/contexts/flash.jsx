/**
 * Flash message context.
 *
 * Responsibilities:
 * - Stores a single global flash message.
 * - Provides helper functions to show and clear messages.
 * - Automatically clears messages after a configurable timeout.
 *
 * Note:
 * This context is intended for short-lived UI feedback
 * such as success, error, or warning messages.
 */
import { createContext, useContext, useMemo, useState } from "react";

/**
 * React context holding flash message state and actions.
 *
 * Initial value is null and is provided by FlashProvider.
 */
const FlashContext = createContext(null);

/**
 * FlashProvider component.
 *
 * Wraps the application and provides flash message functionality
 * to all descendant components.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children Child components
 */
export function FlashProvider({ children }) {
    /**
     * Current flash message state.
     *
     * Structure:
     * - type: visual style (e.g. "success", "danger")
     * - message: text content displayed to the user
     */
    const [flash, setFlash] = useState(null);

    /**
     * Memoized context value.
     *
     * Note:
     * useMemo prevents unnecessary re-renders of consumers
     * when unrelated parts of the application update.
     */
    const value = useMemo(() => ({
        flash,

        /**
         * Displays a flash message and optionally hides it after a timeout.
         *
         * @param {string} type Message type (used for styling)
         * @param {string} message Message text
         * @param {number} timeoutMs Auto-hide delay in milliseconds
         *
         * My note:
         * Timeout is optional to allow persistent messages if needed.
         */
        showFlash: (type, message, timeoutMs = 2500) => {
            setFlash({ type, message });
            if (timeoutMs){
                window.setTimeout(() => setFlash(null), timeoutMs);
    }
        },

        /**
         * Clears the current flash message immediately.
         */
        clear: () => setFlash(null),
    }), [flash]);

    return (
        <FlashContext.Provider value={value}>
            {children}
        </FlashContext.Provider>
    );
}

/**
 * Custom hook for accessing flash message context.
 *
 * @returns {Object} Flash context value
 *
 * @throws {Error} When used outside of FlashProvider
 *
 * Note:
 * This guard helps catch incorrect usage early during development.
 */
export function useFlash() {
    const ctx = useContext(FlashContext);
    if (!ctx) throw new Error("useFlash must be used within a FlashProvider");
    return ctx;
}