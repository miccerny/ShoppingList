import { useState } from "react"
import { apiPost } from "../utils/api";

const ShareListForm = ({ show, onClose, listId }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!show) {
        return null;
    }

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await apiPost(`/list/${listId}`, { email });
            setSuccess("Sdílení prověhlo úspěšně");
            setEmail("")
            setTimeout(() => {
                setSuccess(null);
            }, 2000);

        } catch (err) {
            if(err.response?.status ===409){
            setError("Sdílení se nezdařilo");
            }else if(err.response?.status === 404){
                setError("Uživatel s tímto emailem neexistuje");
            }else {
                setError ("Sdílení se nezdařilo");
            }

            setTimeout(() =>{
                setError(null);
            }, 3000);

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
                        {error && <div className="alert alert-danger text-center">{error}</div>}
                        {success && <div className="alert alert-success text-center">{success}</div>}
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