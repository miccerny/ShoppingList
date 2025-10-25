import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const ListTable = ({ label, items, onEdit, onDelete }) => {
    return (
        <div className="mb-3">
            <p className="card-description">{label}{items.length}</p>

            <div className="d-flex flex-wrap gap-3">
                {items.map((list) =>
                    <div key={list._id || list.id} className="card w-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <h5 className="card-title">
                                {list.name}
                            </h5>
                            <div className="d-flex flex-column  align-items-end">
                            <div className="btn-group">
                                <Link to={`/list/show/${list._id || list.id}`}>
                                    Zobrazit
                                </Link>
                            </div>
                            <button
                                className="btn btn-sm btn-primary mt-2"
                                onClick={() => onEdit(list._id || list.id)}
                            >
                                Upravit
                            </button>
                            <button
                                className="btn btn-sm btn-danger mt-2"
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