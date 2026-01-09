import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const ListTable = ({ label, items, onEdit, onDelete, setShareOpen, flash }) => {
    return (
        <div className="mb-3">
            <p className="card-description">{label}{items.length}</p>

            <div className="d-flex flex-wrap gap-3">
                {items.filter(list => list && typeof list === "object" && !Array.isArray(list))
                    .map((list) =>
                        <div key={list._id || list.id} className="card w-100">
                            <div className="card-body d-flex flex-column">

                                
                                    <div className="btn mb-3 justify-content-center">
                                        <Link to={`/list/show/${list._id || list.id}`}
                                        className="list-clickable mb-3">
                                            <h4 className="m-0">
                                                {list.name}
                                            </h4>
                                        </Link>
                                    </div>
        
                                    <div className="d-flex justify-content-start align-items-center gap-2">
                                    <button className="btn btn-modern btn-share mt-2 w-100 w-md-auto" onClick={() => setShareOpen((list._id || list.id))}>
                                        Sdílet
                                    </button>

                                    <button
                                        className="btn btn-modern btn-edit mt-2 w-100 w-md-auto"
                                        onClick={() => onEdit(list._id || list.id)}
                                    >
                                        Upravit
                                    </button>
                                    <button
                                        className="btn btn-modern btn-delete mt-2 w-100 w-md-auto"
                                        onClick={() => onDelete(list._id || list.id)}
                                    >
                                        Smazat
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

            </div>
        </div>
    );
};

export default ListTable;