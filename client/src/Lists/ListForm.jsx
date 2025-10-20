import React, { useEffect, useState } from "react";
import { apiGetById, apiPost, apiPut } from "../utils/api";
import { saveGuestList } from "./GuestList";
import InputField from "../components/InputField";
import { useSession } from "../contexts/session";

const ListForm = ({ show, onClose, id, lists, setLists, onSaved }) => {
    const [listName, setListName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { session } = useSession();

    useEffect(() => {

        if (!id) {
            setListName("");
            return;
        }

        if (session.status == "authenticated") {
            setLoading(true);
            apiGetById("/list", id)
                .then((data) => {
                    setListName(data.name);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Nepodařilo se načíst seznam");
                    setLoading(false);
                });
        } else {

            const found = lists.find((l) => l.id === id);
            if (found) setListName(found.name);
        }
    }, [id, session, lists]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);


        try {
            if (session.status === "authenticated") {

                if (id) {
                    await apiPut(`/list/${id}`, { name: listName });
                    const updatedLists = lists.map((l) =>
                        l.id === id ? { ...l, name: listName } : l
                    );
                    setLists(updatedLists);
                }
                else {
                    await apiPost("/list", { name: listName });
                }
                onSaved();
            } else {
                let updatedLists;

                if (id) {
                    updatedLists = lists.map((l) =>
                        l.id === id ? { ...l, name: listName } : l
                    );
                } else {
                    updatedLists = [...lists, { id: Date.now(), name: listName }];
                }
                saveGuestList(updatedLists);
                setLists(updatedLists);
            }
            setLoading(false)
            onClose();
        } catch (err) {
            setError("Uložení se nezdařilo");
            setLoading(false);
        }

    };

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{id ? "Upravit" : "Vytvořit"} nákupní seznam</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error} </div>}
                        <form onSubmit={handleSubmit}>

                            <InputField
                                required={true}
                                type="text"
                                name="listName"
                                label="Název"
                                prompt="Zadejte název listu"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                            />

                            <button type="submit" className="btn tbn-primary" disabled={loading}>
                                {loading ? "Ukládám..." : "Uložit"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );

}
export default ListForm;