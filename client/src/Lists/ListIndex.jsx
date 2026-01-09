import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../utils/api";
import ListForm from "./ListForm";
import { apiDelete } from "../utils/api";
import { useSession } from "../contexts/session";
import { loadGuestList, deleteGuestList } from "./GuestList";
import ShareListForm from "./ShareListForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useFlash } from "../contexts/flash";

const ListIndex = (props) => {
    const { session } = useSession();
    const [listState, setListState] = useState([]);
    const [errorState, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [shareOpen, setShareOpen] = useState(null);
    const location = useLocation();
    const flash = location.state?.flash;
    const navigate = useNavigate();
    const { showFlash } = useFlash();
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
        if (flash) {
            navigate(location.pathname, { replace: true });
        }
    }, []);

    useEffect(() => {
        loadLists();

    }, [session.status]);


    const handleDelete = async (id) => {
        try {
            if (session.status === "authenticated") {
                await apiDelete(`/list/${id}`);
                showFlash("success", "Seznam smazán.");
                loadLists();
            } else {
                deleteGuestList(id);
                show("success", "Seznam smazán.");
                setListState(prev => prev.filter(l => String(l.id ?? l._id) !== String(id)));
            }
        } catch (err) {
            showFlash("danger", "Smazání se nezdařilo.");
            setError(err.message);
        }
    };

    return (

        <div className="d-flex justify-content-center align-items-start min-vh-100">
            <div className="w-100 mt-5">
                <h1 className="text-center mb-3">Seznamy</h1>
                {flash && <div className="alert alert-success text-center">{flash.message}</div>}
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