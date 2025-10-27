import React, { useEffect, useState } from "react";
import ItemTable from "./ItemTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../utils/api";
import ItemForm from "./ItemForm";
import { useSession } from "../contexts/session";
import { loadGuestList } from "../Lists/GuestList";
import InputField from "../components/InputField";
import { useParams } from "react-router-dom";

const ItemIndex = (props) => {
    const { session } = useSession();
    const [itemState, setItemState] = useState([]);
    const [errorState, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const { id } = useParams();


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


    const handleDelete = async (id) => {
        try {
            if (session.status === "authenticated") {
                await apiDelete(`/list/${id}/items`, id);
                loadItems();
            } else {
                const newLists = itemState.filter((i) => i.id !== id);
                saveGuest(newLists);
                setItemState(newLists);
            }
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