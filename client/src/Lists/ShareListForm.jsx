/**
 * ShareListForm component.
 *
 * Responsibilities:
 * - Displays modal form for sharing a shopping list with another user.
 * - Sends share request to backend using user email.
 * - Provides feedback based on backend response status.
 *
 * Note:
 * This component is intentionally focused on a single action
 * (list sharing) and does not manage any global state.
 */
import { useState } from "react"
import { apiPost } from "../utils/api";
import { useFlash } from "../contexts/flash";

/**
 * ShareListForm definition.
 *
 * @param {Object} props
 * @param {boolean} props.show Controls modal visibility
 * @param {Function} props.onClose Closes the modal
 * @param {string|number} props.listId Identifier of the list being shared
 */
const ShareListForm = ({ show, onClose, listId }) => {

    /**
    * Local form state.
    */
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const { showFlash } = useFlash();

    /**
     * Do not render modal when not visible.
     *
     * Note:
     * Keeps component mounted logic simple
     * and avoids unnecessary event handlers.
     */
    if (!show) {
        return null;
    }

    /**
     * Handles list sharing form submission.
     *
     * Flow:
     * - Sends share request to backend
     * - Handles expected error cases via HTTP status codes
     * - Displays user-friendly feedback messages
     */
    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiPost(`/list/${listId}`, { email });
            showFlash("success", "Seznam byl sdílen.");
            setEmail("");
            onClose();

        } catch (err) {

            /**
             * Backend error handling based on HTTP status.
             *
             * My note:
             * Explicit status handling improves UX
             * by providing actionable feedback.
             */
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
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        >
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleShare}>
                            {/* Email input of the target user */}
                            <input
                                required
                                type="email"
                                name="email"
                                label="Email uživatele"
                                prompt="Zadejte email uživatele"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Submit action */}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
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