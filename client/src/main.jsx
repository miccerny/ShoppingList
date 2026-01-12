/**
 * Entry point of the React application.
 *
 * Responsibilities:
 * - Imports global styles (Bootstrap).
 * - Conditionally enables API mocking (MSW) in development.
 * - Creates the React root and renders the application.
 * - Registers global context providers.
 *
 * Beginner note:
 * This file is the first one executed in the browser.
 * No React component is rendered before this code runs.
 */

import App from './App.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom/client';
import { SessionProvider } from './contexts/session.jsx';
import { FlashProvider } from './contexts/flash.jsx';

/**
 * Logs environment variables to help verify runtime configuration.
 *
 * Beginner note:
 * - DEV tells whether the app runs in development mode.
 * - MODE controls whether MSW mocks or real backend is used.
 * - BACKEND defines the backend API base URL.
 */
// "mock" | "backend"
console.log("ENV CHECK:", {
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.VITE_API_MODE,
  BACKEND: import.meta.env.VITE_BACKEND_URL,
});

/**
 * Enables or disables Mock Service Worker (MSW)
 * based on environment configuration.
 *
 * Behavior:
 * - Production → MSW is always disabled
 * - DEV + backend mode → real backend is used
 * - DEV + mock mode → MSW intercepts HTTP requests
 *
 * Beginner note:
 * MSW runs directly in the browser and fakes API responses,
 * which allows frontend development without a running backend.
 */
async function enableMocking() {
  const DEV = import.meta.env.DEV;
  const MODE = import.meta.env.VITE_API_MODE;

  // 1) Production build → never start MSW
  if (!DEV) {
    console.log(
      "%cProduction build → MSW disabled",
       "color: gray"
      );
    return;
  }

  // 2) Development + backend mode → MSW disabled
  if (MODE === "backend") {
    console.log(
      "%cDEV mode → real backend enabled (MSW OFF)",
       "color: green"
      );
    return;
  }

  // 3) Development + mock mode → MSW enabled
  if (MODE === "mock") {
    console.log("%cDEV mode → MSW mock enabled", "color: orange");
    const { worker } = await import('./mocks/browser');
    await worker.start();
    return;
  }

  /**
   * Fallback for unexpected configuration values.
   *
   * Beginner note:
   * This helps catch misconfiguration early
   * (e.g. typo in VITE_API_MODE).
   */
  if (!["mock", "backend"].includes(MODE)) {
  console.warn("Unknown VITE_API_MODE:", MODE);

  if (!BACKEND && !(DEV && MODE === "mock")) {
  console.warn("⚠️ BACKEND URL is missing");
}
}
}

/**
 * Application bootstrap.
 *
 * Steps:
 * 1. Enable MSW if configured
 * 2. Create React root
 * 3. Render the app wrapped in global providers
 *
 * Beginner note:
 * Providers placed here are available to the entire application.
 */
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <SessionProvider>
      <FlashProvider>
      <App />
      </FlashProvider>
    </SessionProvider>
  );
});