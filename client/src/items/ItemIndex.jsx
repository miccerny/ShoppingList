/**
 * ItemIndex page component.
 *
 * Responsibilities:
 * - Loads and displays items for a selected list.
 * - Handles authenticated (online) and guest (offline) modes.
 * - Coordinates item CRUD actions and state updates.
 * - Manages modal visibility for item creation and editing.
 *
 * Note:
 * This component acts as a feature orchestrator and delegates
 * rendering to smaller presentational components.
 */
import { useEffect, useState } from "react";
import ItemTable from "./ItemTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete, apiPut } from "../utils/api";
import ItemForm from "./ItemForm";
import { useSession } from "../contexts/session";
import { loadGuestList, updateGuestItems } from "../Lists/GuestList";
import { useParams } from "react-router-dom";
import { useFlash } from "../contexts/flash";

/**
 * Environment configuration.
 *
 * MODE:
 * - "mock"    → relative URLs, MSW interception
 * - "backend" → real backend URLs
 */
const MODE = import.meta.env.VITE_API_MODE;        // "mock" | "backend"
const BACKEND = import.meta.env.VITE_BACKEND_URL;

/**
 * ItemIndex component.
 *
 * Displays all items belonging to a single list.
 */
const ItemIndex = (props) => {
    const { session } = useSession();

    /**
     * Local component state.
     */
    const [itemState, setItemState] = useState([]);
    const [errorState, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);

    /**
    * Route parameter.
    *
    * Note:
    * `id` represents the list ID obtained from the URL.
    */
    const { id } = useParams();
    const listId = id;

    const { showFlash } = useFlash();

    /**
     * Resolves image URL based on environment and backend configuration.
     *
     * My note:
     * This function ensures images work correctly in both
     * mock and backend modes without changing backend responses.
     */
    const resolveImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        if (MODE !== "backend" || !BACKEND) return url;
        const base = BACKEND.replace(/\/$/, "");

        if (base.endsWith("/api") && url.startsWith("/api/")) {
            return base.replace(/\/api$/, "") + url;
        }

        return base + url;
    };

    /**
     * Normalizes item data returned from backend or guest storage.
     *
     * Responsibilities:
     * - Resolves imageId from different DTO shapes
     * - Builds final imageUrl used by the UI
     */
    const normalizeItems = (items) =>
        (Array.isArray(items) ? items : []).map((it) => {
            const imageId = it?.imageId ?? it?.image?.id ?? null;
            const imageUrl =
                resolveImageUrl(it?.imageUrl ?? (imageId ? `/api/images/${imageId}` : null));
            return { ...it, imageId, imageUrl };
        });

    /**
     * Loads items depending on session state.
     *
    * - Authenticated → fetch from backend
    *  - Guest → load from localStorage
    */
    const loadItems = () => {
        if (session.status === "authenticated") {

            apiGet(`/list/${id}/items`)
                .then((data) => setItemState(normalizeItems(data)))
                .catch((error) => setError(error.message));
        } else {
            const allGuestLists = loadGuestList();
            const guestList = allGuestLists.find(
                (l) => String(l.id ?? l._id) === String(id));
            console.log("🧾 Načtený guestList:", guestList);
            setItemState(guestList?.items || []);
        }
    };

    /**
     * Load items when list ID or session state changes.
     */
    useEffect(() => {
        loadItems();

    }, [id, session]);

     /**
     * Handles toggling of item "purchased" state.
     *
     * Flow:
     * 1. Update local state optimistically
     * 2. Persist change (localStorage or backend)
     */
    const handleCheck = async (itemId) => {

        // Find original item state
        const oldItem = itemState.find(i => i.id === itemId);
        const newPurchasedValue = !oldItem.purchased;

        // Update UI state optimistically
        setItemState(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, purchased: newPurchasedValue } : item
            )
        );

       // Guest mode → persist to localStorage
        setItemState(prev => {
            const updatedItems = prev.map(item =>
                item.id === itemId ? { ...item, purchased: newPurchasedValue } : item
            );
            if (session.status !== "authenticated") {
                showFlash("success", "Změna uložena (guest režim).");
                updateGuestItems(listId, updatedItems);
            }
            return updatedItems;
        });

        // Authenticated mode → persist to backend
        try {
            await apiPut(`/list/${listId}/items/${itemId}`, {
                purchased: newPurchasedValue

            });
            showFlash("success", "Změna uložena.")
        } catch (err) {
            console.error("Chyba při ukládání purchased:", err);
            showFlash("danger", "Uložení se nezdařilo.");
        }
    };

    /**
     * Handles item deletion.
     *
     * Behavior:
     * - Authenticated → delete via backend API
     * - Guest → update local state and localStorage
     */
    const handleDelete = async (itemId) => {
        try {

            if (session.status === "authenticated") {
                await apiDelete(`/list/${listId}/items/${itemId}`);
                showFlash("success", "Položka smazána.");
                loadItems();
                return;
            }

            // Guest mode
            setItemState((prev) => {
                const updatedItems = prev.filter(
                    (item) => String(item.id) !== String(id)
                );

                // uložit do localStorage
                updateGuestItems(listId, updatedItems);
                return updatedItems;
            });
            showFlash("success", "Položka smazána.");
        } catch (err) {
            setError(err.message);
            showFlash("danger", "Smazání se nezdařilo.");
        }
    };

    return (

        <div className="d-flex justify-content-center align-items-start min-vh-100">
            <div className="w-75 mt-5">
                <h1 className="text-center mb-3">Položky</h1>
                {errorState && <div className="alert alert-danger">{errorState}</div>}

                {/* Create new item */}
                <button className="btn btn-success mb-3"
                    onClick={() => {
                        setEditId(null);
                        setShowModal(true);
                    }}
                >
                    Nová položka
                </button>


                <hr />
                {/* Items table */}
                <ItemTable
                    items={itemState}
                    label="Počet položek: "
                    onEdit={(id) => {
                        setEditId(id);
                        setShowModal(true);
                    }}
                    onDelete={handleDelete}
                    purchased={handleCheck}
                />
                {/* Item create / edit modal */}
                <ItemForm
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    id={editId}
                    onSaved={loadItems}
                    items={itemState}
                    listId={id}
                    setItems={setItemState}
                />
            </div>
        </div>

    );
};

export default ItemIndex;