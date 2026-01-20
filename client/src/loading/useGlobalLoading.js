/**
 * React hook for subscribing to the global loading state.
 *
 * Responsibilities:
 * - Bridges global JS loading state with React rendering.
 * - Re-renders components when loading state changes.
 *
 * Note:
 * useSyncExternalStore is the recommended way
 * to connect React to external (non-React) state.
 */
import { useSyncExternalStore } from "react";
import { globalLoading } from "./globalLoading";

export function useGlobalLoading() {
  return useSyncExternalStore(globalLoading.subscribe, globalLoading.getSnapshot);
}