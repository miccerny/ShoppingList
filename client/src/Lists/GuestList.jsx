/**
 * GuestList utility module.
 *
 * Responsibilities:
 * - Manages offline (guest) lists stored in localStorage.
 * - Provides CRUD operations for guest lists and their items.
 * - Synchronizes guest data with backend after user login.
 *
 * Note:
 * This module allows the application to work fully offline
 * and later seamlessly migrate guest data to a user account.
 */
import { apiPost } from "../utils/api";
import { globalLoading } from "../loading/globalLoading";

/**
 * localStorage key used to store guest lists.
 */
const STORAGE_KEY = "guest";

/**
 * Loads all guest lists from localStorage.
 *
 * @returns {Array} Array of guest lists
 *
 * Note:
 * This function is defensive against corrupted or unexpected
 * data structures stored in localStorage.
 */
export function loadGuestList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    console.log("Načtené guest listy:", raw);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    /**
     * Safety check for accidental nested arrays ([[...]]).
     *
     * My note:
     * This situation may occur due to incorrect writes
     * during earlier development or migrations.
     */
    if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
      console.warn("Detekováno dvojité pole – rozbaluji");
      return parsed[0];
    }

    return parsed;
  } catch (e) {
    console.error(" Chyba při čtení localStorage:", e);
    return [];
  }
}

/**
 * Persists all guest lists to localStorage.
 *
 * @param {Array} lists Array of guest lists
 *
 * Note:
 * Ensures consistent storage format even if a nested array
 * is accidentally passed in.
 */
export function saveGuestLists(lists) {
  return globalLoading.wrap(
    async () => {
      try {
        const flat = Array.isArray(lists[0]) ? lists[0] : lists;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flat));
      } catch (e) {
        console.error("Chyba při ukládání localStorage:", e);
      }
    },
    {
      source: "local",
      mode: "soft",
      delayMs: 200,
      message: "Ukládám lokální data…",
    },
  );
}

/**
 * Removes all guest lists from localStorage.
 *
 * Note:
 * Used after successful synchronization with backend.
 */
export function clearGuestList() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Synchronizes guest lists with backend after user login.
 *
 * Flow:
 * 1. Load guest lists from localStorage
 * 2. Send them to backend for import
 * 3. Clear local guest storage on success
 *
 * Note:
 * This function is intentionally tolerant to failure
 * to avoid blocking the login flow.
 */
export async function syncGuestListAfterLogin() {
  const guestLists = loadGuestList();
  if (guestLists.length > 0) {
    try {
      await apiPost("/list/import", guestLists);
      clearGuestList();
      console.log("Guest listy importovány do DB.");
    } catch (e) {
      console.error("Chyba při importu guest listů:", e);
    }
  }
}

/**
 * Saves or updates a single guest list.
 *
 * @param {Object|Array} list Guest list object
 *
 * Note:
 * Accepts both a single object and an array defensively,
 * but internally always stores a flat list structure.
 */
export function saveGuestList(list) {
  if (Array.isArray(list)) {
    console.error("saveGuestList dostal pole, čekám jeden objekt:", list);
    return saveGuestLists(list);
  }
  const all = loadGuestList();
  const idx = all.findIndex(
    (l) => String(l.id ?? l._id) === String(list.id ?? list._id),
  );

  if (idx !== -1) {
    all[idx] = list;
  } else {
    all.push(list);
  }

  saveGuestLists(all);
}

/**
 * Updates items of a specific guest list.
 *
 * @param {string|number} listId List identifier
 * @param {Array} updateItems Updated items array
 *
 * Note:
 * This function acts as the single source of truth
 * for updating guest list items.
 */
export function updateGuestItems(listId, updateItems) {
  const all = loadGuestList();

  const idx = all.findIndex((l) => String(l.id ?? l._id) === String(listId));

  if (idx !== -1) {
    all[idx] = {
      ...all[idx],
      items: updateItems,
    };
    console.warn("Guest list nebyl nalezen", listId);
  } else {
    all.push({
      id: listId,
      items: updateItems,
    });
  }
  saveGuestLists(all);
}

/**
 * Deletes a specific guest list.
 *
 * @param {string|number} id List identifier
 */
export function deleteGuestList(id) {
  const filtered = loadGuestList().filter(
    (l) => String(l.id ?? l._id) !== String(id),
  );
  saveGuestLists(filtered);
}
