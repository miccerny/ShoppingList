/**
 * MSW request handlers.
 *
 * Responsibilities:
 * - Defines mocked API endpoints for frontend development.
 * - Simulates authentication, authorization, and CRUD operations.
 * - Provides predictable responses without a running backend.
 *
 * Note:
 * These handlers intentionally mimic real backend behavior,
 * including HTTP status codes and error responses.
 */
import { http, HttpResponse } from "msw";
import { mockData } from "./mockData";

/**
 * In-memory representation of the currently logged-in user.
 *
 * Note:
 * This variable simulates backend session state.
 * It exists only for the lifetime of the browser session.
 */
let currentUser = null;

// --- Handlers --- //
export const handlers = [

  /**
   * LOGIN endpoint.
   *
   * POST /api/login
   *
   * Behavior:
   * - Validates user credentials against mock data.
   * - Initializes in-memory session state.
   * - Returns basic user identity on success.
   */
  http.post("/api/login", async ({ request }) => {
    const { email, password } = await request.json();

    const user = mockData.user.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    /**
     * Store a deep copy of the user including lists and items.
     *
     * My note:
     * JSON serialization is used to avoid accidental mutation
     * of the original mock data.
     */
    currentUser = JSON.parse(JSON.stringify(user));

    return HttpResponse.json({
      id: user.id,
      email: user.email,
    });
  }),

   /**
   * CURRENT USER endpoint.
   *
   * GET /api/me
   *
   * Behavior:
   * - Returns authenticated user info.
   * - Responds with 401 if no user is logged in.
   */
  http.get("/api/me", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({
      id: currentUser.id,
      email: currentUser.email,
    });
  }),

   /**
   * GET LISTS endpoint.
   *
   * GET /api/list
   *
   * Behavior:
   * - Returns all lists belonging to the current user.
   * - Enforces authentication.
   */
  http.get("/api/list", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json(currentUser.list);
  }),

   /**
   * GET ITEMS FROM LIST endpoint.
   *
   * GET /api/list/:listId/items
   *
   * Behavior:
   * - Validates authentication.
   * - Locates list by ID.
   * - Returns items belonging to the list.
   */
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

  /**
   * ADD ITEM endpoint.
   *
   * POST /api/list/:listId/items
   *
   * Behavior:
   * - Creates a new item in the specified list.
   * - Generates a temporary ID using Date.now().
   *
   * Note:
   * ID generation here intentionally differs from backend
   * auto-increment or UUID strategies.
   */
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

  /**
   * DELETE ITEM endpoint.
   *
   * DELETE /api/list/:listId/items/:itemId
   *
   * Behavior:
   * - Removes item from list if it exists.
   * - Returns 404 when item is not found.
   */
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

  /**
   * Catch-all handler.
   *
   * Behavior:
   * - Logs unmatched requests.
   * - Returns HTTP 418 to clearly signal missing mock implementation.
   *
   * Note:
   * This helps detect frontend requests that are not yet mocked.
   */
  http.all("*", ({ request }) => {
    console.warn("[MSW] No handler matched:", request.method, request.url);
    return HttpResponse.json({ error: "No mock handler" }, { status: 418 });
  })
];