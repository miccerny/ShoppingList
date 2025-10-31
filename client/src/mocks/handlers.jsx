// handlers.jsx
import { http, HttpResponse } from "msw";


// --- Mock data --- //
const mockData = {
  user: [
    {
      id: 1,
      email: "michal@example.com",
      password: "1234",
      list: [
        {
          id: 101,
          name: "Nákupní seznam",
          items: [
            { id: 1, name: "Mléko" },
            { id: 2, name: "Chléb" },
          ],
        },
        {
          id: 102,
          name: "Drogerie",
          items: [
            { id: 1, name: "Šampon" },
            { id: 2, name: "Mýdlo" },
          ],
        },
      ],
    },
  ],
  list: [
    {
      id: 3,
      name: "Nákup 20.10.",
      items: [
        { id: 5, name: "Rohlík", count: 1 },
        { id: 6, name: "Kečup", count: 2 },
      ],
    },
  ],
};

let currentUser = null;

// --- Handlers --- //
export const handlers = [
  http.post("/login", async ({ request }) => {
    const { email, password } = await request.json();
    console.log("[MSW] /login called:", email, password);

    const user = mockData.user.find(u => u.email === email && u.password === password);
    if (!user) {
      return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    currentUser = { id: user.id, email: user.email, username: user.username };
    return HttpResponse.json(currentUser);
  }),

  // 🔓 LOGOUT
  http.delete("/logout", () => {
    currentUser = null;
    return HttpResponse.json({ message: "Logged out" });
  }),

  // 🙋‍♂️ ME
  http.get("/me", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json(currentUser);
  }),


  // 🧾 REGISTER
  http.post("/register", async ({ request }) => {
    const { username, email, password } = await request.json();
    if (mockData.users.some((u) => u.email === email)) {
      return HttpResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      lists: [],
    };
    mockData.users.push(newUser);
    console.log("[MSW] ✅ Registered:", email);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // 🗒️ GET all lists (for logged user)
  http.get("/list", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = mockData.user.find(u => u.email === currentUser.email);
    if (!user) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    return HttpResponse.json(user.list); // ✅ vrací seznamy přihlášeného usera
  }),

  // 🧺 GET items for list
  http.get("/list/:listId/items", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const list = currentUser.lists.find(
      (l) => l.id === Number(params.listId)
    );

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    return HttpResponse.json(list.items);
  }),

  // ➕ POST new item
  http.post("/list/:listId/items", async ({ params, request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const list = currentUser.lists.find(
      (l) => l.id === Number(params.listId)
    );

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    const newItem = { id: Date.now(), name: body.name, done: false };
    list.items.push(newItem);
    return HttpResponse.json(newItem, { status: 201 });
  }),

  // ❌ DELETE item
  http.delete("/list/:listId/items/:itemId", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    for (const list of currentUser.lists) {
      const idx = list.items.findIndex((i) => i.id === Number(params.itemId));
      if (idx !== -1) {
        list.items.splice(idx, 1);
        return HttpResponse.json({ message: "Item deleted" });
      }
    }
    return HttpResponse.json({ error: "Item not found" }, { status: 404 });
  }),

  // 🔍 CATCH-ALL fallback (debug)
  http.all("*", ({ request }) => {
    console.warn("[MSW] ⚠️ Zachyceno bez match:", request.method, request.url);
    return HttpResponse.json({ warning: "no handler" }, { status: 418 });
  }),
];