import { apiPost } from "../utils/api";

const STORAGE_KEY = "guest";

// 🧾 Načti všechny offline seznamy
export function loadGuestList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    console.log("🧾 Načtené guest listy:", raw);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    // Pokud by se omylem dostalo dovnitř dvojité pole [[...]], rozbalíme ho
    if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
      console.warn("⚠️ Detekováno dvojité pole – rozbaluji");
      return parsed[0];
    }

    return parsed;
  } catch (e) {
    console.error("❌ Chyba při čtení localStorage:", e);
    return [];
  }
}

// 💾 Ulož celé pole seznamů
export function saveGuestLists(lists) {
  try {
    // Kdyby se omylem poslalo vnořené pole, rozbalíme ho
    const flat = Array.isArray(lists[0]) ? lists[0] : lists;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flat));
  } catch (e) {
    console.error("❌ Chyba při ukládání localStorage:", e);
  }
}

// 🧹 Vymaž všechny guest listy
export function clearGuestList() {
  localStorage.removeItem(STORAGE_KEY);
}

// 🔄 Synchronizuj offline seznamy po přihlášení
export async function syncGuestListAfterLogin() {
  const guestLists = loadGuestList();
  if (guestLists.length > 0) {
    try {
      await apiPost("/list/import", guestLists);
      clearGuestList();
      console.log("✅ Guest listy importovány do DB.");
    } catch (e) {
      console.error("❌ Chyba při importu guest listů:", e);
    }
  }
}

// 💾 Ulož nebo aktualizuj konkrétní list
export function saveGuestList(list) {
  const all = loadGuestList();
  const idx = all.findIndex(
    (l) => String(l.id ?? l._id) === String(list.id ?? list._id)
  );

  if (idx !== -1) {
    all[idx] = list;
  } else {
    all.push(list);
  }

  saveGuestLists(all);
}

// ❌ Smaž konkrétní list
export function deleteGuestList(id) {
  const filtered = loadGuestList().filter(
    (l) => String(l.id ?? l._id) !== String(id)
  );
  saveGuestLists(filtered);
}