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

export default function GlobalLoadingOverlay() {
  const isLoading = useGlobalLoading();

  /**
   * Locks body scrolling while loading overlay is visible.
   */
  useEffect(() => {
    if (!isLoading) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [isLoading]);

  // Do not render anything if loading is inactive
  if (!isLoading) return null;

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
        <div style={{ fontSize: 13, opacity: 0.7 }}>Chvilku strpení.</div>
      </div>
    </div>,
    document.body
  );
}