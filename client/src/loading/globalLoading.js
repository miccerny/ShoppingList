/**
 * Global loading state controller.
 *
 * Responsibilities:
 * - Manages visibility of a global "loading" overlay.
 * - Shows the overlay only if an operation takes longer than a given delay.
 * - Allows any part of the app (e.g. API layer) to trigger loading state.
 *
 * Note:
 * This module is NOT a React component.
 * It is a simple global JS state that React can subscribe to.
 */

let state = { visible: false, mode: "soft" }; // "soft" | "hard"
let timerId = null; // current visibility state of the overlay
const listeners = new Set(); // subscribed UI listeners (React)

/**
 * Notifies all subscribed listeners about state change.
 */
function notify() {
  listeners.forEach((fn) => fn(state));
}

export const globalLoading = {
  
  /**
   * Shows the loading overlay AFTER a delay.
   *
   * Why delay?
   * - Prevents flickering for very fast operations.
   * - Overlay appears only if loading takes longer than e.g. 200 ms.
   *
   * @param {number} delayMs - delay in milliseconds (default: 200 ms)
   * @param {"soft"|"hard"} mode Loading mode
   */
  showDelayed(delayMs = 200, mode = "soft") {
    // If a timer already exists, do nothing
    if (timerId, state.visible) return;

    timerId = setTimeout(() => {
      state = {visible: true, mode};
      timerId = null;
      notify();
    }, delayMs);
  },

  /**
   * Hides the loading overlay.
   *
   * Behavior:
   * - Cancels pending delay timer (if loading was fast)
   * - Hides overlay if it is currently visible
   */
  hide() {
    // Cancel delayed showing if request finished quickly
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    // Hide overlay only if it is visible
    if (state.visible) {
      state = {visible: false, mode: "soft"};
      notify();
    }
  },

   /**
   * Subscribes a listener to loading state changes.
   *
   * Used by React via useSyncExternalStore.
   *
   * @param {Function} listener
   * @returns {Function} unsubscribe function
   */
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * Returns current loading state snapshot.
   *
   * Used by React to get the current value.
   */
  getSnapshot() {
    return state;
  },
};