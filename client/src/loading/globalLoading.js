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

/**
 * Internal global loading state snapshot.
 *
 * Properties:
 * - visible → whether overlay is currently shown
 * - mode    → "soft" (non-blocking) or "hard" (blocking)
 * - source  → "be" (backend) | "local" | null
 * - message → display text for the overlay
 */
let state = {
  visible: false,
  mode: "soft", // "soft" | "hard"
  source: null,
  message: "",
};

/**
 * Timer used to delay showing the overlay
 * to avoid flashing on quick operations.
 */
let timerId = null;
let token = 0;
const listeners = new Set(); // subscribed UI listeners (React)

/**
 * In-flight counters for concurrent operations.
 *
 * - be    → backend requests
 * - local → local operations
 * - hard  → blocking operations
 */
const inFlight = {
  be: 0,
  local: 0,
  hard: 0,
};

/**
 * When true, backend "hard" operations are downgraded to "soft".
 *
 * Useful when the UI should remain interactive
 * even while backend calls are running.
 */
let suppressBeHardOverlay = false;

/**
 * Notifies all subscribed listeners about state change.
 */
function notify() {
  listeners.forEach((fn) => fn(state));
}

/**
 * Clears any pending visibility timer.
 */
function clearTimer() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
}

/**
 * Checks if any operation is currently running.
 *
 * @returns {boolean}
 */
function hasAnyRunning() {
  return inFlight.be > 0 || inFlight.local > 0;
}

/**
 * Computes the overlay state based on current counters.
 *
 * @param {string} fallbackMessage
 * @returns {{source: string|null, mode: string, message: string}}
 */
function computeTargetState(fallbackMessage = "") {
  const source = inFlight.be > 0 ? "be" : inFlight.local > 0 ? "local" : null;

  let mode = inFlight.hard > 0 ? "hard" : "soft";

  if (suppressBeHardOverlay && source === "be") mode = "soft";

  const message =
    fallbackMessage ||
    (source === "be"
      ? "Komunikuju se serverem…"
      : source === "local"
        ? "Zpracovávám…"
        : "");

  return { source, mode, message };
}

/**
 * Schedules showing the overlay after a delay.
 *
 * @param {number} delayMs
 * @param {string} message
 */
function scheduleShow(delayMs = 200, message = "") {
  if (!hasAnyRunning()) return;

  if (state.visible) {
    const next = computeTargetState(message);
    state = { ...state, ...next, visible: true };
    notify();
    return;
  }

  if (timerId) return;

  const myToken = ++token;
  timerId = setTimeout(() => {
    timerId = null;
    if (myToken !== token) return;
    if (!hasAnyRunning()) return;

    const next = computeTargetState(message);
    state = { visible: true, ...next };
    notify();
  }, delayMs);
}

/**
 * Hides the overlay if nothing is running,
 * or refreshes state if work is still ongoing.
 */
function hideIfDone() {
  if (!hasAnyRunning()) {
    clearTimer();
    token++;
    if (state.visible) {
      state = { visible: false, mode: "soft", source: null, message: "" };
      notify();
    }
  } else {
    const next = computeTargetState(state.message);
    if (state.visible) {
      state = { ...state, ...next };
      notify();
    }
  }
}

export const globalLoading = {
  /**
   * Toggle suppression of backend "hard" overlay mode.
   *
   * @param {boolean} value
   */
  setSuppressBeHardOverlay(value) {
    suppressBeHardOverlay = !!value;

    if (hasAnyRunning()) {
      if (state.visible) {
        state = {
          ...state,
          ...computeTargetState(state.message),
          visible: true,
        };
        notify();
      } else {
        scheduleShow(200, state.message);
      }
    }
  },

  /**
   * Starts tracking a loading operation.
   *
   * @param {Object} opts
   * @param {"be"|"local"} opts.source
   * @param {"soft"|"hard"} [opts.mode="soft"]
   * @param {number} [opts.delayMs=200]
   * @param {string} [opts.message=""]
   * @returns {Function} end function to stop tracking
   */
  begin({ source, mode = "soft", delayMs = 200, message = "" } = {}) {
    if (source !== "be" && source !== "local") {
      console.warn("globalLoading.begin: source must be 'be' or 'local'");
    }

    inFlight[source] = (inFlight[source] || 0) + 1;
    if (mode === "hard") inFlight.hard += 1;

    scheduleShow(delayMs, message);

    let ended = false;
    return () => {
      if (ended) return;
      ended = true;

      inFlight[source] = Math.max(0, (inFlight[source] || 0) - 1);
      if (mode === "hard") inFlight.hard = Math.max(0, inFlight.hard - 1);

      hideIfDone();
    };
  },

  /**
   * Convenience wrapper for promises to auto-start/stop.
   *
   * @template T
   * @param {() => Promise<T>} promiseFactory
   * @param {Object} opts
   * @returns {Promise<T>}
   */
  async wrap(promiseFactory, opts) {
    const end = this.begin(opts);
    try {
      return await promiseFactory();
    } finally {
      end();
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
