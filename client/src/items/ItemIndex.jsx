import React, { useEffect, useState } from "react";
import ItemTable from "./ItemTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete, apiPut } from "../utils/api";
import ItemForm from "./ItemForm";
import { useSession } from "../contexts/session";
import { loadGuestList, updateGuestItems } from "../Lists/GuestList";
import { useParams } from "react-router-dom";

const ItemIndex = (props) => {
    const { session } = useSession();
    const [itemState, setItemState] = useState([]);
    const [errorState, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const { id } = useParams();
    const listId = id;


    const loadItems = () => {
        if (session.status === "authenticated") {

            apiGet(`/list/${id}/items`)
                .then(setItemState)
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
                updateGuestItems(listId, updatedItems);
            }
            return updatedItems; // guest končí tady
        });

        // 4️⃣ Auth režim → uložit na BE
        try {
            await apiPut(`/list/${listId}/items/${itemId}`, {
                purchased: newPurchasedValue
            });
        } catch (err) {
            console.error("Chyba při ukládání purchased:", err);
        }
    };

    const handleDelete = async (id) => {
        try {

            if (session.status === "authenticated") {
                await apiDelete(`/list/${listId}/items/${itemId}`);
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
        } catch (err) {
        setError(err.message);
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