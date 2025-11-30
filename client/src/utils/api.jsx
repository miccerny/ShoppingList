import { HttpRequestError } from "../Error/HttpRequstError";


const API_URL =`${import.meta.env.VITE_API_URL}/api`;

console.info("🔧 API_URL:", API_URL);

export async function apiGet(endpoint, options={}) {
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

export async function apiPut(endpoint, data)  {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new HttpRequestError(
      `Chyba při úpravě ${endpoint}/${id}: ${response.status}: ${response.statusText}`, response
    );
  }
  if (response.status === 204) return null;
  return await response.json();
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!response.ok) {
    throw new HttpRequestError(
      `Chyba při mazání ${endpoint}/${id} ${response.status}: ${response.statusText}`, response
    );
  }
}
