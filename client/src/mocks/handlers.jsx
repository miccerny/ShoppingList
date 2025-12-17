// handlers.jsx
import { http, HttpResponse } from "msw";
import { mockData } from "./mockData";

// --- Mock data --- //


let currentUser = null;

// --- Handlers --- //
export const handlers = [

  // 🔑 LOGIN
  http.post("/api/login", async ({ request }) => {
    const { email, password } = await request.json();

    const user = mockData.user.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // uložíme usera včetně listů
    currentUser = JSON.parse(JSON.stringify(user));

    return HttpResponse.json({
      id: user.id,
      email: user.email,
    });
  }),

  // 🙋‍♂️ ME
  http.get("/api/me", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({
      id: currentUser.id,
      email: currentUser.email,
    });
  }),

  // 🗒️ GET LISTS
  http.get("/api/list", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json(currentUser.list);
  }),

  // 🧺 GET ITEMS FROM LIST
  http.get("/api/list/:listId/items", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const list = currentUser.list.find(
      (l) => l.id === Number(params.listId)
    );

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    return HttpResponse.json(list.items);
  }),

  // ➕ ADD ITEM
  http.post("/api/list/:listId/items", async ({ params, request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const list = currentUser.list.find(
      (l) => l.id === Number(params.listId)
    );

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    const body = await request.json();
    const newItem = { id: Date.now(), name: body.name };

    list.items.push(newItem);

    return HttpResponse.json(newItem, { status: 201 });
  }),

  // ❌ DELETE ITEM
  http.delete("/api/list/:listId/items/:itemId", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const list = currentUser.list.find(
      (l) => l.id === Number(params.listId)
    );

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    const index = list.items.findIndex(
      (i) => i.id === Number(params.itemId)
    );

    if (index === -1) {
      return HttpResponse.json({ error: "Item not found" }, { status: 404 });
    }

    list.items.splice(index, 1);

    return HttpResponse.json({ message: "Item deleted" });
  }),

  // ⚠️ CATCH-ALL
  http.all("*", ({ request }) => {
    console.warn("[MSW] No handler matched:", request.method, request.url);
    return HttpResponse.json({ error: "No mock handler" }, { status: 418 });
  })
];