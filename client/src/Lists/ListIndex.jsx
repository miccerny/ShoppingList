import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import "bootstrap/dist/css/bootstrap.min.css";
import {apiGet} from "../utils/api";
import ListForm from "./ListForm";
import {apiDelete} from "../utils/api";
import { useSession } from "../contexts/session";
import { loadGuestList, saveGuestList } from "./GuestList";

const ListIndex = (props) => {
    const {session} = useSession();
    const [listState, setListState] = useState([]);
    const [errorState, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const loadLists = () => {
        if(session.status === "authenticated"){

        apiGet("/list")
            .then(setListState)
            .catch((error) => setError(error.message));
        } else{
            setListState(loadGuestList());
        }
        }


    useEffect(() => {
        loadLists();

    }, [session]);


    const handleDelete = async (id) => {
        try {
            if (session.status === "authenticated"){
            await apiDelete(`/list/${id}`);
            loadLists();
            } else {
                const newLists = listState.filter((l) => l.id !== id);
                saveGuestList(newLists);
                setListState(newLists);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (

        <div className="d-flex justify-content-center align-items-start min-vh-100">
            <div className="w-75 mt-5">
                <h1 className="text-center mb-3">Seznamy</h1>
                {errorState && <div className="alert alert-danger">{errorState}</div>}

                <button className="btn btn-success mb-3"
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
                />

                <ListForm
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    id={editId}
                    onSaved={loadLists}
                    lists={listState}
                    setLists={setListState}
                />
            </div>
        </div>
    );
};

export default ListIndex;