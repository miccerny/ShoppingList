import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const ItemTable = ({ label, items, onEdit, onDelete }) => {
    console.log("ItemTable items:", items);
    return (
        <div className="mb-3">
            <p className="card-description">{label}{items.length}</p>
            {items.length === 0 ? (
                <p>Žádné položky</p>
            ) : (
                <div className="d-flex flex-wrap gap-3">
                    {items?.map((item, index) =>
                        <div key={item.id} className="card" style={{ width: "18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    {index + 1}. {item.name}
                                </h5>
                                <p>
                                    Množství: {item.count}
                                </p>
                                <div className="btn-group">
                                    <Link to={`/list/show/${item.id}`}>
                                        Zobrazit
                                    </Link>
                                </div>
                                <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => onEdit(item.id)}
                                >
                                    Upravit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => onDelete(item.id)}
                                >
                                    Smazat
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            )}
        </div>
    )
}

export default ItemTable;