import { HttpRequestError } from "../Error/HttpRequstError";

const DEV = import.meta.env.DEV;
const MODE = import.meta.env.VITE_API_MODE;  // mock | backend
const BACKEND = import.meta.env.VITE_BACKEND_URL;

// Režimy:
// mock: FE používá relativní "/api" → MSW zachytí
// backend: FE volá lokální/prod backend → BE zpracuje
// production build -> MSW ignoruje, vznikne reálné API

const API_URL =
  DEV && MODE === "mock"
    ? "/api"                   // /api/login → MSW
    : BACKEND;

console.log("🔧 API_MODE:", import.meta.env.VITE_API_MODE);
console.info("🔧 API_URL:", API_URL);

export async function apiGet(endpoint, options = {}) {

  console.log("➡️ FETCH:", `${API_URL}${endpoint}`);

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
    throw new HttpRequestError(`Chyba ${response.status}: ${response.statusText}`, response);
  }
  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;

}

export async function apiGetById(endpoint, id) {
  return apiGet(`${endpoint}/${id}`);
}

export async function apiPost(endpoint, data) {
  console.log("➡️ FETCH POST:", `${API_URL}${endpoint}`);

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new HttpRequestError(`Chyba ${response.status}: ${response.statusText}`, response);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function apiPut(endpoint, data) {
  
  const isFormData = data instanceof FormData;
  console.log("➡️ FETCH PUT:", `${API_URL}${endpoint}`, isFormData ? "(FormData)" : data);

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    credentials: "include",
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) {
    throw new HttpRequestError(
      `Chyba při úpravě ${endpoint}: ${response.status}: ${response.statusText}`, response
    );
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!response.ok) {
    throw new HttpRequestError(
      `Chyba při mazání ${endpoint}: ${response.status}: ${response.statusText}`, response
    );
  }
}
