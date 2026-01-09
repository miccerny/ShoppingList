import { useState } from "react"
import { apiPost } from "../utils/api";
import { useFlash } from "../contexts/flash";

const ShareListForm = ({ show, onClose, listId }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { showFlash } = useFlash();

    if (!show) {
        return null;
    }

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiPost(`/list/${listId}`, { email });
            showFlash("success", "Seznam byl sdílen.");
            setEmail("");
            onClose();
            
        } catch (err) {
            if (err.response?.status === 409) {
                showFlash("danger", "Sdílení se nezdařilo.");
            } else if (err.response?.status === 404) {
                showFlash("danger", "Uživatel s tímto emailem neexistuje");
            } else {
                showFlash("danger", "Sdílení se nezdařilo");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>Sdílet seznam</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleShare}>
                            <input
                                required
                                type="email"
                                name="email"
                                label="Email uživatele"
                                prompt="Zadejte email uživatele"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Odesílám..." : "Sdílet"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ShareListForm;