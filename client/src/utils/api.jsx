/**
 * Centralized API utility module.
 *
 * Responsibilities:
 * - Builds correct API base URL based on environment configuration.
 * - Provides reusable HTTP helper functions (GET, POST, PUT, DELETE).
 * - Handles JSON parsing and HTTP error propagation.
 *
 * Note:
 * This file acts as a single communication layer between
 * the frontend and the backend (or mock API).
 */
import { HttpRequestError } from "../Error/HttpRequstError";
import { globalLoading } from "../loading/globalLoading";

/**
 * Environment flags provided by Vite.
 *
 * DEV  → true when running in development mode
 * MODE → "mock" | "backend"
 * BACKEND → base URL of the backend API
 */
const DEV = import.meta.env.DEV;
const MODE = import.meta.env.VITE_API_MODE; // mock | backend
const BACKEND = import.meta.env.VITE_BACKEND_URL;

/**
 * API modes overview:
 *
 * - mock:
 *   Frontend uses relative "/api" paths which are intercepted by MSW.
 *
 * - backend:
 *   Frontend communicates directly with a real backend server.
 *
 * - production build:
 *   MSW is ignored and real API requests are always used.
 */
const API_URL =
  DEV && MODE === "mock"
    ? "/api" // /api/login → intercepted by MSW
    : BACKEND;

/**
 * Log resolved API configuration for debugging.
 */
console.log("🔧 API_MODE:", import.meta.env.VITE_API_MODE);
console.info("🔧 API_URL:", API_URL);

/**
 * Performs HTTP GET request.
 *
 * @param {string} endpoint Relative API endpoint (e.g. "/list")
 * @param {Object} options Optional fetch configuration
 * @returns {Promise<Object|null>} Parsed JSON response or null (204)
 *
 * @throws {HttpRequestError} When response status is not OK
 *
 * Note:
 * - Automatically includes cookies (credentials: "include")
 * - Parses JSON only when response body is present
 */
export async function apiGet(endpoint, options = {}) {
  console.log("➡️ FETCH:", `${API_URL}${endpoint}`);
  console.log("LOADING MODE: GET -> soft");

  return globalLoading.wrap(
    async () => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        credentials: "include",
        ...options,
      });

      if (!response.ok) {
        throw new HttpRequestError(
          `Chyba ${response.status}: ${response.statusText}`,
          response,
        );
      }
      // No content → return null explicitly
      if (response.status === 204) return null;

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    },
    {
      source: "be",
      mode: "soft",
      delayMs: 200,
      message: "Načítám data...",
    },
  );
}

/**
 * Performs HTTP GET request for a specific resource by ID.
 *
 * @param {string} endpoint Base endpoint (e.g. "/items")
 * @param {string|number} id Resource identifier
 * @returns {Promise<Object|null>}
 *
 * Note:
 * This is a convenience wrapper around apiGet().
 */
export async function apiGetById(endpoint, id) {
  return apiGet(`${endpoint}/${id}`);
}

/**
 * Performs HTTP POST request with JSON body.
 *
 * @param {string} endpoint Relative API endpoint
 * @param {Object} data Request payload
 * @returns {Promise<Object|null>}
 *
 * @throws {HttpRequestError} When response status is not OK
 */
export async function apiPost(endpoint, data) {
  console.log("➡️ FETCH POST:", `${API_URL}${endpoint}`);

  return globalLoading.wrap(
    async () => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new HttpRequestError(
          `Chyba ${response.status}: ${response.statusText}`,
          response,
        );
      }

      if (response.status === 204) return null;

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    },
    {
      source: "be",
      mode: "hard",
      delayMs: 200,
      message: "Ukládám data…",
    },
  );
}

/**
 * Performs HTTP PUT request.
 *
 * Supports both JSON payloads and FormData.
 *
 * @param {string} endpoint Relative API endpoint
 * @param {Object|FormData} data Payload to be sent
 * @returns {Promise<Object|null>}
 *
 * Note:
 * FormData is typically used for file uploads
 * and must NOT have Content-Type set manually.
 */
export async function apiPut(endpoint, data) {
  const isFormData = data instanceof FormData;
  console.log(
    "➡️ FETCH PUT:",
    `${API_URL}${endpoint}`,
    isFormData ? "(FormData)" : data,
  );

  return globalLoading.wrap(
    async () => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: isFormData
          ? undefined
          : { "Content-Type": "application/json" },
        credentials: "include",
        body: isFormData ? data : JSON.stringify(data),
      });
      if (!response.ok) {
        throw new HttpRequestError(
          `Chyba při úpravě ${endpoint}: ${response.status}: ${response.statusText}`,
          response,
        );
      }

      if (response.status === 204) return null;

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    },
    {
      source: "be",
      mode: "hard", // POST už typicky blokuje
      delayMs: 200,
      message: "Ukládám data…",
    },
  );
}

/**
 * Performs HTTP DELETE request.
 *
 * @param {string} endpoint Relative API endpoint
 *
 * @throws {HttpRequestError} When response status is not OK
 *
 * Note:
 * DELETE requests usually do not return a response body.
 */
export async function apiDelete(endpoint) {
  return globalLoading.wrap(
    async () => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new HttpRequestError(
          `Chyba při mazání ${endpoint}: ${response.status}: ${response.statusText}`,
          response,
        );
      }
    },
    {
      source: "be",
      mode: "hard", // POST už typicky blokuje
      delayMs: 200,
      message: "Ukládám data…",
    },
  );
}
