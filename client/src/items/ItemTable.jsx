import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import InputCheck from "../components/InputCheck";

const getImageId = (item) => item?.imageId ?? item?.image?.id ?? null;


const ItemTable = ({ label, items, onEdit, onDelete, purchased }) => {
    console.log("ItemTable items:", items);

    return (
        <div className="mb-3">
            {/* Popis seznamu + počet položek */}
            <p className="card-description">
                {label}{items.length}
            </p>

            {/* Pokud nejsou žádné položky */}
            {items.length === 0 ? (
                <p>Žádné položky</p>
            ) : (
                /* list-group = sémantický seznam */
                <div className="list-group">
                    {items?.map((item, index) => {
                        return (

                            /* 
                                list-group-item
                                → vizuálně definuje řádek seznamu (border, padding)
    
                                d-flex
                                → všechny vnitřní prvky budou v jednom řádku
    
                                align-items-center
                                → vertikální zarovnání checkboxu, textu i tlačítek
    
                                py-2
                                → malý vertikální padding (kompaktní výška)
                            */
                            <div key={item.id}
                                className="list-group-item d-flex align-items-center py-2"
                            >

                                {/* Checkbox – stav zakoupeno */}
                                <InputCheck
                                    type="checkbox"
                                    name="purchased"
                                    checked={item.purchased}
                                    value={item.id}
                                    label=""
                                    onChange={() => purchased(item.id)}
                                />
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="img-thumbnail ms-2"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                )}
                                {/*
                                flex-grow-1
                                → tenhle blok zabere veškerý volný prostor

                                Díky tomu:
                                    - text je vlevo
                                    - tlačítka se vytlačí úplně doprava
                            */}
                                <div className="flex-grow-1 ms-2">
                                    {/* Název položky */}
                                    <strong>
                                        {index + 1}. {item.name}
                                    </strong>
                                    {/* Množství – menší, méně rušivé */}
                                    <span className="text-muted ms-2">
                                        x{item.count}
                                    </span>
                                </div>

                                {/*
                                d-flex + gap-2
                                → tlačítka jsou v řadě
                                → rovnoměrné mezery mezi nimi
                            */}
                                <div className="d-flex gap-2">
                                    {/* Detail položky */}
                                    <Link
                                        to={`/list/show/${item.id}`}
                                        className="btn btn-modern"
                                        title="Zobrazit"
                                    >
                                        👁
                                    </Link>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-modern btn-edit"
                                        onClick={() => onEdit(item.id)}
                                        title="Upravit"
                                    >
                                        ✏️
                                    </button>
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