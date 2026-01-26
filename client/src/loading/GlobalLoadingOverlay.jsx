/**
 * Global loading overlay component.
 *
 * Responsibilities:
 * - Displays a fullscreen overlay when global loading is active.
 * - Prevents user interaction during critical operations.
 * - Locks page scrolling while loading is visible.
 *
 * Note:
 * This component does NOT manage loading state itself.
 * It only reacts to the global loading state.
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useGlobalLoading } from "./useGlobalLoading";

/**
 * Fullscreen loading overlay.
 *
 * Modes:
 * - soft: visible but allows user interaction (guest mode still works)
 * - hard: blocks user interaction (e.g. login/register/save to backend)
 */
export default function GlobalLoadingOverlay() {
  const { visible, mode, message } = useGlobalLoading();
  const isBlocking = mode === "hard";

  /**
   * Only lock scrolling when blocking is enabled.
   *
   * This prevents the user from interacting with the page
   * while a "hard" loading overlay is active.
   */
  useEffect(() => {
    if (!visible || !isBlocking) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [visible, isBlocking]);

  /**
   * Do not render anything if loading is inactive.
   *
   * Returning null keeps DOM clean and avoids unnecessary portals.
   */
  if (!visible) return null;

  if (!isBlocking) {
    /**
     * Soft mode: lightweight non-blocking toast-style overlay.
     *
     * Shows progress without blocking clicks or scrolling.
     */
    return createPortal(
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 18,
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: "#fff",
          padding: "10px 14px",
          borderRadius: 999,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          fontSize: 13,
          opacity: 0.95,
          pointerEvents: "none",
        }}
        aria-live="polite"
      >
        {message || "Načítám na pozadí…"}
      </div>,
      document.body
    );
  }

 /**
   * Hard mode: full-screen blocking overlay.
   *
   * Portal is used so the overlay is rendered above the entire
   * application, regardless of component hierarchy.
   */
  console.log("OVERLAY:", { visible, mode });
  return createPortal(
    <div
      id="global-loading-overlay"
      aria-busy="true"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        // IMPORTANT:
        // soft => clicks go through
        // hard => blocks UI
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "16px 18px",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          minWidth: 220,
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Načítám…</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>"Chvilku strpení."</div>
      </div>
    </div>,
    document.body,
  );
}
