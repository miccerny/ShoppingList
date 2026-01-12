/**
 * ListForm component.
 *
 * Responsibilities:
 * - Displays modal form for creating or editing a shopping list.
 * - Supports both authenticated (online) and guest (offline) modes.
 * - Synchronizes list changes with backend or local guest storage.
 *
 * Note:
 * This component represents a full feature flow (create / edit)
 * and intentionally contains side effects and conditional logic.
 */
import { useEffect, useState } from "react";
import { apiGetById, apiPost, apiPut } from "../utils/api";
import { saveGuestList } from "./GuestList";
import InputField from "../components/InputField";
import { useSession } from "../contexts/session";
import { useFlash } from "../contexts/flash";

/**
 * ListForm definition.
 *
 * @param {Object} props
 * @param {boolean} props.show Controls modal visibility
 * @param {Function} props.onClose Closes the modal
 * @param {string|number|null} props.id List ID (edit mode)
 * @param {Array} props.lists Current lists (guest or authenticated)
 * @param {Function} props.setLists Updates lists state
 * @param {Function} props.onSaved Callback after successful save
 */
const ListForm = ({ show, onClose, id, lists, setLists, onSaved }) => {
     /**
     * Form state.
     */
    const [listName, setListName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { session } = useSession();
    const { showFlash } = useFlash();

     /**
     * Loads list data when modal opens or list ID changes.
     *
     * Behavior:
     * - Create mode → reset form
     * - Authenticated → fetch list from backend
     * - Guest → read list from local state
     */
    useEffect(() => {

        // Create mode → reset form state
        if (!id) {
            setListName("");
            return;
        }

        // 🟢 Authenticated (online) mode
        if (session.status == "authenticated") {
            setLoading(true);
            apiGetById("/list", id)
                .then((data) => {
                    setListName(data.name);
                    setLoading(false);
                })
                .catch(() => {
                    showFlash("danger", "Nepodařilo se načíst seznam");
                    setLoading(false);
                });
        } else {
            // 🟡 Guest (offline) mode → find list in local state
            const found = lists.find((l) => l.id === id);
            if (found) setListName(found.name);
        }
    }, [id, session, lists]);

    /**
     * Handles form submission.
     *
     * Flow:
     * - Authenticated → backend API + state update
     * - Guest → local state + localStorage persistence
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            // 🟢 Authenticated (online) mode
            if (session.status === "authenticated") {

                if (id) {

                    // Update existing list
                    await apiPut(`/list/${id}`, { name: listName });

                    const updatedLists = lists.map((l) =>
                        l.id === id ? { ...l, name: listName } : l
                    );
                    setLists(updatedLists);
                }
                else {

                     // Create new list
                    await apiPost("/list", { name: listName });
                }

                onSaved();
            } else {

                // 🟡 Guest (offline) mode
                let updatedLists;

                if (id) {

                    // Update existing guest list
                    updatedLists = lists.map((l) =>
                        l.id === id ? { ...l, name: listName } : l
                    );
                } else {

                    // Create new guest list
                    updatedLists = [...lists, { id: Date.now(), name: listName }];
                }

                saveGuestList(updatedLists);
                setLists(updatedLists);
            }

            showFlash("success", id ? "Seznam upraven." : "Seznam vytvořen.");
            setLoading(false);
            onClose();

        } catch (err) {
            showFlash("danger", "Uložení se nezdařilo.");
            setError("Uložení se nezdařilo");
            setLoading(false);
        }

    };

     // Do not render modal when not visible
    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{id ? "Upravit" : "Vytvořit"} nákupní seznam</h5>
                        <button
                         type="button" 
                         className="btn-close" 
                         onClick={onClose}
                         >
                         </button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger">{error} </div>
                            )}
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

                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={loading}
                                >
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