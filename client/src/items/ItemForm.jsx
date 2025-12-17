import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../utils/api";
import InputField from "../components/InputField";
import { useSession } from "../contexts/session";
import {loadGuestList, saveGuestLists, updateGuestItems } from "../Lists/GuestList";

const ItemForm = ({ show, onClose, id, items, setItems, onSaved, listId }) => {
  const [itemName, setItemName] = useState("");
  const [itemCount, setItemCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { session } = useSession();

  useEffect(() => {
    if (!id) {
      setItemName("");
      setItemCount(0);
      return;
    }

    // 🟢 Online režim
    if (session.status === "authenticated") {
      setLoading(true);
      apiGet(`/list/${listId}/items/${id}`)
        .then((data) => {
          setItemName(data.name);
          setItemCount(data.count);
        })
        .catch(() => setError("Nepodařilo se načíst položku"))
        .finally(() => setLoading(false));
    } else {
      // 🟡 Offline režim – hledej v lokálních items
      const found = Array.isArray(items)
        ? items.find((i) => String(i.id) === String(id))
        : null;

      if (found) {
        setItemName(found.name);
        setItemCount(found.count);
      }
    }
  }, [id, session.status, listId, items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
       // 🟢 Online režim – API volání
      if (session.status === "authenticated") {
        const payload = {
          name: itemName,
          count: itemCount,
          listId: Number(listId),
        };

        if (id) {
          await apiPut(`/list/${listId}/items/${id}`, payload);
        } else {
          await apiPost(`/list/${listId}/items`, payload);
        }

        onSaved?.();
        onClose();
        return; // obnov seznam z DB
      }
        // 🟡 Offline režim – localStorage
        const safeItems = Array.isArray(items) ? items : [];
        let updatedItems;

        if (id) {
          //editace
          updatedItems = safeItems.map((i) =>
            String(i.id) === String(id)
              ? { ...i, name: itemName, count: itemCount }
              : i
          );
        } else {
          //nový item
          updatedItems = [
            ...safeItems,
            { 
              id: Date.now(), 
              name: itemName, 
              count: itemCount, 
              purchased: false 
            },
          ];
        }

        // aktualizuj React stav
        setItems(updatedItems);

        // update localStorage (JEDINÁ správná cesta)
        updateGuestItems(listId, updatedItems);
        
      
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("❌ CHYBA při ukládání položky:", err);
      if (err.response) {
        const text = await err.response.text();
        console.error("📦 Backend odpověď:", text);
      }
      setError("Uložení se nezdařilo");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{id ? "Upravit" : "Vytvořit"} položku</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <InputField
                required
                type="text"
                name="itemName"
                label="Název"
                prompt="Zadejte položku"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <InputField
                required
                type="number"
                name="itemCount"
                label="Počet"
                prompt="Zadejte množství"
                value={itemCount}
                onChange={(e) => setItemCount(e.target.value)}
              />

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Ukládám..." : "Uložit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;