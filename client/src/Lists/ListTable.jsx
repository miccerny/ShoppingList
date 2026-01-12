/**
 * ListTable component.
 *
 * Responsibilities:
 * - Renders a collection of shopping lists as responsive cards.
 * - Displays list name and provides actions (open, share, edit, delete).
 * - Delegates all actions to parent component callbacks.
 *
 * Note:
 * This component is purely presentational.
 * It does not manage state or perform any data mutations.
 */
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

/**
 * ListTable component.
 *
 * Responsibilities:
 * - Renders a collection of shopping lists as responsive cards.
 * - Displays list name and provides actions (open, share, edit, delete).
 * - Delegates all actions to parent component callbacks.
 *
 * Note:
 * This component is purely presentational.
 * It does not manage state or perform any data mutations.
 */
const ListTable = ({ label, items, onEdit, onDelete, setShareOpen, flash }) => {
    return (
        <div className="mb-3">
            {/* List description and count */}
            <p className="card-description">{label}{items.length}</p>

            {/**
             * Responsive card container.
             *
             * Layout notes:
             * - d-flex + flex-wrap → cards wrap on smaller screens
             * - gap-3 → consistent spacing between cards
             */}
            <div className="d-flex flex-wrap gap-3">
                {/**
                 * Defensive filtering of input data.
                 *
                 * Note:
                 * Filters out invalid values to avoid runtime rendering errors.
                 */}
                {items.filter(list => list && typeof list === "object" && !Array.isArray(list))
                    .map((list) =>
                        /**
                       * Single list card.
                       *
                       * My note:
                       * Both `_id` and `id` are supported to handle
                       * backend and guest list identifiers.
                       */
                        <div key={list._id || list.id} className="card w-100">
                            <div className="card-body d-flex flex-column">
                                {/* Clickable list title */}
                                <div className="btn mb-3 justify-content-center">
                                    <Link to={`/list/show/${list._id || list.id}`}
                                        className="list-clickable mb-3">
                                        <h4 className="m-0">
                                            {list.name}
                                        </h4>
                                    </Link>
                                </div>
                                {/**
                                 * Action buttons section.
                                 *
                                 * Layout notes:
                                 * - Buttons stack on small screens
                                 * - Align horizontally on larger screens
                                 */}
                                <div className="d-flex justify-content-start align-items-center gap-2">
                                    {/* Share list action */}
                                    <button 
                                    className="btn btn-modern btn-share mt-2 w-100 w-md-auto" 
                                    onClick={() => setShareOpen((list._id || list.id))}
                                    >
                                        Sdílet
                                    </button>
                                    {/* Edit list action */}
                                    <button
                                        className="btn btn-modern btn-edit mt-2 w-100 w-md-auto"
                                        onClick={() => onEdit(list._id || list.id)}
                                    >
                                        Upravit
                                    </button>
                                    {/* Delete list action */}
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