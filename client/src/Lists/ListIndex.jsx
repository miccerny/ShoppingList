/**
 * ListIndex page component.
 *
 * Responsibilities:
 * - Displays overview of all shopping lists.
 * - Handles authenticated (online) and guest (offline) modes.
 * - Coordinates list CRUD actions and modal visibility.
 * - Integrates list sharing functionality.
 *
 * Note:
 * This component acts as the main entry point for list management
 * and orchestrates multiple child components.
 */
import { useEffect, useState } from "react";
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

/**
 * ListIndex component.
 *
 * Displays all shopping lists available to the user.
 */
const ListIndex = (props) => {
    const { session } = useSession();

     /**
     * Local component state.
     */
    const [listState, setListState] = useState([]);
    const [errorState, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [shareOpen, setShareOpen] = useState(null);

    /**
     * Router helpers.
     *
     * location.state may contain a flash message passed
     * from previous navigation.
     */
    const location = useLocation();
    const flash = location.state?.flash;
    const navigate = useNavigate();
    const { showFlash } = useFlash();

    /**
     * Loads lists depending on authentication state.
     *
     * - Authenticated → fetch from backend API
     * - Guest → load from localStorage
     */
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

     /**
     * Clears navigation-based flash message
     * after it has been displayed once.
     *
     * Note:
     * This prevents the message from reappearing
     * on page refresh.
     */
    useEffect(() => {
        if (flash) {
            navigate(location.pathname, 
                { replace: true }
            );
        }
    }, []);

    /**
     * Reload lists whenever authentication state changes.
     *
     * Note:
     * This ensures seamless transition between
     * guest and authenticated modes.
     */
    useEffect(() => {
        loadLists();

    }, [session.status]);


    
    /**
     * Handles deletion of a list.
     *
     * Behavior:
     * - Authenticated → delete via backend API
     * - Guest → delete from localStorage
     */
    const handleDelete = async (id) => {
        try {
            if (session.status === "authenticated") {
                await apiDelete(`/list/${id}`);
                showFlash("success", "Seznam smazán.");
                loadLists();
            } else {
                deleteGuestList(id);
                showFlash("success", "Seznam smazán.");
                setListState(prev => 
                    prev.filter(l => 
                        String(l.id 
                            ?? l._id
                        ) !== String(id)));
            }
        } catch (err) {
            showFlash("danger", "Smazání se nezdařilo.");
            setError(err.message);
        }
    };

    return (

        <div className="d-flex justify-content-center align-items-start min-vh-100">
            <div className="w-100 mt-5">
              <p>Aplikace pro <strong>vytváření, úpravu a smazání </strong> Nákupního seznamu (případně Todo listu), včetně vložení jednotlivých položek do seznamu. </p>
                <strong>Anonymní uživatel:</strong> <span> uložení dat do paměti prohlížeče (localStorage) a jejich správa</span>
              <p><strong>Přihlášený uživatel: </strong> uložení do databáze (server) a možnost operací s obrázky u položek</p>

                <h1 className="text-center mb-3">Seznamy</h1>
                {/* Navigation-based flash message */}
                {flash && (<div className="alert alert-success text-center">
                    {flash.message}
                    </div>
                    )}
                {/* Error state display */}
                {errorState && (
                    <div className="alert alert-danger">{errorState}</div>
                )}
                {/* Create new list button */}
                <button className="btn btn-success mb-3 px-5 py-2 px-md-3 py-md-2"
                    onClick={() => {
                        setEditId(null);
                        setShowModal(true);
                    }}
                >
                    Nový seznam
                </button>

                <hr />
                {/* Lists table */}
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
                {/* Create / edit list modal */}
                <ListForm
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    id={editId}
                    onSaved={loadLists}
                    lists={listState}
                    setLists={setListState}
                />
                 {/* Share list modal */}
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