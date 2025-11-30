import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../utils/api";
import ListForm from "./ListForm";
import { apiDelete } from "../utils/api";
import { useSession } from "../contexts/session";
import { loadGuestList, saveGuestList, deleteGuestList } from "./GuestList";
import ShareListForm from "./ShareListForm";

const ListIndex = (props) => {
    const { session } = useSession();
    const [listState, setListState] = useState([]);
    const [errorState, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [shareOpen, setShareOpen] = useState(null);
    const loadLists = () => {
        if (session.status === "authenticated") {
            console.log("🟡 Fetching lists...");
            apiGet("/list")
                .then((data) => {
                    console.log("🟢 Data loaded:", data);
                    setListState(data);
                })
                .catch((error) => {
                    console.error("❌ Error loading lists:", error);
                    setError(error.message);
                });
        } else {
            console.log("🧾 Loaded guest lists:", loadGuestList());
            setListState(loadGuestList());
        }
    }


    useEffect(() => {
        loadLists();

    }, [session.status]);


    const handleDelete = async (id) => {
        try {
            if (session.status === "authenticated") {
                await apiDelete(`/list/${id}`);
                loadLists();
            } else {
                deleteGuestList(id);


                setListState(prev => prev.filter(l => String(l.id ?? l._id) !== String(id)));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (

        <div className="d-flex justify-content-center align-items-start min-vh-100">
            <div className="w-100 mt-5">
                <h1 className="text-center mb-3">Seznamy</h1>
                {errorState && <div className="alert alert-danger">{errorState}</div>}

                <button className="btn btn-success mb-3 px-5 py-2 px-md-3 py-md-2"
                    onClick={() => {
                        setEditId(null);
                        setShowModal(true);
                    }}
                >
                    Nový seznam
                </button>

                <hr />

                <ListTable
                    items={listState}
                    label="Počet seznamů: "
                    onEdit={(id) => {
                        setEditId(id);
                        setShowModal(true);
                    }}
                    onDelete={handleDelete}
                    setShareOpen={setShareOpen}  
                />

                <ListForm
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    id={editId}
                    onSaved={loadLists}
                    lists={listState}
                    setLists={setListState}
                />

                <ShareListForm
                    show={shareOpen !== null}
                    onClose={() => setShareOpen(null)}
                    listId={shareOpen}
                />
            </div>
        </div>
    );
};

export default ListIndex;