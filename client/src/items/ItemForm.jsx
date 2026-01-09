import { useEffect, useRef, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import InputField from "../components/InputField";
import { useSession } from "../contexts/session";
import { updateGuestItems } from "../Lists/GuestList";
import { useFlash } from "../contexts/flash";

const MODE = import.meta.env.VITE_API_MODE;        // "mock" | "backend"
const BACKEND = import.meta.env.VITE_BACKEND_URL;

const ItemForm = ({ show, onClose, id, items, setItems, onSaved, listId, imageId }) => {
  const [itemName, setItemName] = useState("");
  const [itemCount, setItemCount] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [itemImageFile, setItemImageFile] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { session } = useSession();
  const { showFlash } = useFlash();
  const fileInputRef = useRef(null);

  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    return MODE === "backend"
      ? `${BACKEND}${url}`
      : url;
  };



  useEffect(() => {
    if (!show) return;
      setError(null);
    setItemImageFile(null);
    setImagePreview(null);
    setCurrentImageId(null);

    if (fileInputRef.current) fileInputRef.current.value = "";

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
          console.log(data)
          setItemName(data.name);
          setItemCount(data.count);

          const imgId = data.imageId ?? data.image?.id ?? null;
          setCurrentImageId(imgId);
          if (imgId) {
            setImagePreview(resolveImageUrl(`/images/${imgId}`));
          }
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

  // cleanup blob url
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleDeleteImage = async () => {
    if (!id) return;
    try {
      setLoading(true);

      // ✅ symetricky k PUT /image
      await apiDelete(`/list/${listId}/items/${id}/image`);

       // vyčisti preview + file
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setItemImageFile(null);
      setImagePreview(null);
      setCurrentImageId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      showFlash("success", "Obrázek smazán.");
      onSaved?.(); // ať se refreshne seznam
    } catch (e) {
      console.error(e);
      showFlash("danger", "Smazání obrázku se nezdařilo.");
    } finally {
      setLoading(false);
    }
  };

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
          listId: listId,
        };
     
        if (id) {
            await apiPut(`/list/${listId}/items/${id}`, payload);

          if (itemImageFile) {
            const formData = new FormData();
            formData.append("file", itemImageFile);
            await apiPut(`/list/${listId}/items/${id}/image`, formData);
          }
        } else {
          await apiPost(`/list/${listId}/items`, payload);
        }

        showFlash("success", id ? "Položka upravena." : "Položka vytvořena.");
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

      showFlash("success", id ? "Položka upravena (guest režim)." : "Položka vytvořena (guest režim).");
      imagePreview && URL.revokeObjectURL(imagePreview);
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("❌ CHYBA při ukládání položky:", err);
      if (err.response) {
        const text = await err.response.text();
        console.error("📦 Backend odpověď:", text);
      }
      showFlash("danger", "Uložení se nezdařilo.");
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
              {session.status === "authenticated" && id && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Obrázek</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        setItemImageFile(file)

                        // pokud byl předtím blob preview, uvolni ho
                        if (imagePreview?.startsWith("blob:")) {
                          URL.revokeObjectURL(imagePreview);
                        }
                        // ✅ okamžitý lokální náhled vybraného souboru
                        setImagePreview(URL.createObjectURL(file));
                      }}
                    />

                    <div className="form-text">
                      Obrázek lze přidat pouze po Přihlášení
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-modern btn-delete"
                      onClick={handleDeleteImage}
                      disabled={loading || !currentImageId}
                      title={!currentImageId ? "Položka nemá obrázek" : "Smazat obrázek"}
                    >
                      Smazat obrázek
                    </button>
                  </div>

                  {imagePreview && (
                    <div className="mt-3 text-center">
                      <img
                        src={imagePreview}
                        alt="Náhled obrázku"
                        style={{
                          maxWidth: "50%",
                          maxHeight: "100px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}
                </>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Ukládám..." : "Uložit"}
              </button>
            </form>
          </div>
        </div>
      </div >
    </div >
  );
};

export default ItemForm;