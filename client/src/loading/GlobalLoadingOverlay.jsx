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
  const { visible, mode } = useGlobalLoading();
  const isBlocking = mode === "hard";

  // Only lock scrolling when blocking is enabled
  useEffect(() => {
    if (!visible || !isBlocking) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [visible, isBlocking]);

  // Do not render anything if loading is inactive
  if (!visible) return null;

  /**
   * Portal is used so the overlay is rendered
   * above the entire application, regardless of component hierarchy.
   */
  return createPortal(
    <div
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
        pointerEvents: isBlocking ? "auto" : "none",
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

          // In soft mode, the box is also non-interactive (so clicks pass through)
          pointerEvents: isBlocking ? "auto" : "none",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Načítám…</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>
          {isBlocking ? "Chvilku strpení." : "Data se načítají na pozadí." }
          </div>
      </div>
    </div>,
    document.body,
  );
}
