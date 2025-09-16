const API_URL = 'http://localhost:8080/api';

export async function apiFetch(endpoint, options={}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "applicatin/json",
            ...(options.headers || {}),

        },
        ...options,
    });

    if(!response.ok){
        throw new Error(`Chyba ${response.status}: ${response.statusText}`);
    }
    if(response.status === 204) return null;

    return response.json();
    
}