/**
 * ItemTable component.
 *
 * Responsibilities:
 * - Renders a list of items in a table-like layout.
 * - Displays item state (purchased, image, name, count).
 * - Delegates user actions (edit, delete, toggle purchased) to parent.
 *
 * Note:
 * This component is intentionally stateless.
 * All business logic and data mutations are handled by the parent component.
 */
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import InputCheck from "../components/InputCheck";

/**
 * ItemTable definition.
 *
 * @param {Object} props
 * @param {string} props.label Text label displayed above the list
 * @param {Array} props.items List of items to render
 * @param {Function} props.onEdit Callback for edit action
 * @param {Function} props.onDelete Callback for delete action
 * @param {Function} props.purchased Callback for toggling purchased state
 */
const ItemTable = ({ label, items, onEdit, onDelete, purchased }) => {

    // Debug log to verify incoming item data
    console.log("ItemTable items:", items);

    return (
        <div className="mb-3">
             {/* List description and item count */}
            <p className="card-description">
                {label}{items.length}
            </p>

            {/* Empty state when no items are available */}
            {items.length === 0 ? (
                <p>Žádné položky</p>
            ) : (
                /**
                 * list-group acts as a semantic list container.
                 *
                 * Note:
                 * Using Bootstrap list-group provides:
                 * - consistent spacing
                 * - visual separation of items
                 */
                <div className="list-group">
                    {items?.map((item, index) => {
                        return (

                            /**
                             * Single item row.
                             *
                             * Layout notes:
                             * - d-flex → horizontal layout
                             * - align-items-center → vertical centering
                             * - py-2 → compact row height
                             */
                            <div key={item.id}
                                className="list-group-item d-flex align-items-center py-2"
                            >

                                {/* Purchased checkbox */}
                                <InputCheck
                                    type="checkbox"
                                    name="purchased"
                                    checked={item.purchased}
                                    value={item.id}
                                    label=""
                                    onChange={() => purchased(item.id)}
                                />
                                {/* Optional item image preview */}
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="img-thumbnail ms-2"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                )}
                               {/**
                                 * Main content area.
                                 *
                                 * flex-grow-1 ensures:
                                 * - text stays on the left
                                 * - action buttons are pushed to the right
                                 */}
                                <div className="flex-grow-1 ms-2">
                                    {/* Item name with index */}
                                    <strong>
                                        {index + 1}. {item.name}
                                    </strong>
                                     {/* Item quantity (secondary information) */}
                                    <span className="text-muted ms-2">
                                        x{item.count}
                                    </span>
                                </div>

                                {/**
                                 * Action buttons group.
                                 *
                                 * Note:
                                 * Buttons are visually separated using gap-2
                                 * for better clickability and readability.
                                 */}
                                <div className="d-flex gap-2">
                                    {/* Item detail navigation */}
                                    <Link
                                        to={`/list/show/${item.id}`}
                                        className="btn btn-modern"
                                        title="Zobrazit"
                                    >
                                        👁
                                    </Link>
                                </div>
                                <div className="d-flex gap-2">
                                    {/* Edit action */}
                                    <button
                                        className="btn btn-modern btn-edit"
                                        onClick={() => onEdit(item.id)}
                                        title="Upravit"
                                    >
                                        ✏️
                                    </button>
                                    {/* Delete action */}
                                    <button
                                        className="btn btn-modern btn-delete"
                                        onClick={() => onDelete(item.id)}
                                        title="Smazat"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            )}
        </div>
    );
};

export default ItemTable;