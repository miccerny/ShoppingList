import { useEffect, useState } from "react";
import ItemTable from "./ItemTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete, apiPut } from "../utils/api";
import ItemForm from "./ItemForm";
import { useSession } from "../contexts/session";
import { loadGuestList, updateGuestItems } from "../Lists/GuestList";
import { useParams } from "react-router-dom";
import { useFlash } from "../contexts/flash";
const MODE = import.meta.env.VITE_API_MODE;        // "mock" | "backend"
const BACKEND = import.meta.env.VITE_BACKEND_URL;

const ItemIndex = (props) => {
    const { session } = useSession();
    const [itemState, setItemState] = useState([]);
    const [errorState, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const { id } = useParams();
    const listId = id;
    const { showFlash } = useFlash();

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


    const normalizeItems = (items) =>
        (Array.isArray(items) ? items : []).map((it) => {
            const imageId = it?.imageId ?? it?.image?.id ?? null;
            const imageUrl =
                resolveImageUrl(it?.imageUrl ?? (imageId ? `/api/images/${imageId}` : null));
            return { ...it, imageId, imageUrl };
        });

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




    useEffect(() => {
        loadItems();

    }, [id, session]);

    const handleCheck = async (itemId) => {

        // 1️⃣ Najdu původní item (před změnou)
        const oldItem = itemState.find(i => i.id === itemId);
        const newPurchasedValue = !oldItem.purchased;

        // 2️⃣ Změním state
        setItemState(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, purchased: newPurchasedValue } : item
            )
        );

        // 3️⃣ Guest režim → uložit do localStorage
        setItemState(prev => {
            const updatedItems = prev.map(item =>
                item.id === itemId ? { ...item, purchased: newPurchasedValue } : item
            );
            if (session.status !== "authenticated") {
                showFlash("success", "Změna uložena (guest režim).");
                updateGuestItems(listId, updatedItems);
            }
            return updatedItems; // guest končí tady
        });

        // 4️⃣ Auth režim → uložit na BE
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

    const handleDelete = async (itemId) => {
        try {

            if (session.status === "authenticated") {
                await apiDelete(`/list/${listId}/items/${itemId}`);
                showFlash("success", "Položka smazána.");
                loadItems();
                return;
            }

            //GUEST režim
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

                <button className="btn btn-success mb-3"
                    onClick={() => {
                        setEditId(null);
                        setShowModal(true);
                    }}
                >
                    Nová položka
                </button>


                <hr />

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