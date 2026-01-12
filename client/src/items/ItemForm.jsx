/**
 * ItemForm component.
 *
 * Responsibilities:
 * - Displays modal form for creating or editing an item.
 * - Handles both authenticated (online) and guest (offline) modes.
 * - Supports optional image upload, preview, and deletion.
 * - Synchronizes changes with backend or localStorage based on session state.
 *
 * Note:
 * This component intentionally contains more logic,
 * as it represents a full feature (CRUD + image handling).
 */
import { useEffect, useRef, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";
import InputField from "../components/InputField";
import { useSession } from "../contexts/session";
import { updateGuestItems } from "../Lists/GuestList";
import { useFlash } from "../contexts/flash";

/**
 * Environment configuration.
 *
 * MODE:
 * - "mock"    → relative URLs, MSW interception
 * - "backend" → real backend URLs
 */
const MODE = import.meta.env.VITE_API_MODE;        // "mock" | "backend"
const BACKEND = import.meta.env.VITE_BACKEND_URL;


/**
 * ItemForm component definition.
 *
 * @param {Object} props
 * @param {boolean} props.show Controls modal visibility
 * @param {Function} props.onClose Closes the modal
 * @param {number|string} props.id Item ID (edit mode)
 * @param {Array} props.items Guest items (offline mode)
 * @param {Function} props.setItems Updates guest items state
 * @param {Function} props.onSaved Callback after successful save
 * @param {number|string} props.listId Parent list ID
 * @param {number|string|null} props.imageId Existing image ID
 */
const ItemForm = ({ show, onClose, id, items, setItems, onSaved, listId, imageId }) => {
  /**
   * Form state.
   */
  const [itemName, setItemName] = useState("");
  const [itemCount, setItemCount] = useState(null);

  /**
  * Image-related state.
  *
  * imagePreview:
  * - backend URL
  * - or local blob URL for instant preview
  */
  const [imagePreview, setImagePreview] = useState(null);
  const [itemImageFile, setItemImageFile] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(null);

  /**
   * UI state.
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session } = useSession();
  const { showFlash } = useFlash();

  /**
   * Reference to file input element.
   *
   * My note:
   * Used to reset the file input programmatically.
   */
  const fileInputRef = useRef(null);

  /**
   * Resolves image URL depending on environment.
   *
   * Note:
   * Backend mode requires absolute URL,
   * mock mode works with relative paths.
   */
  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    return MODE === "backend"
      ? `${BACKEND}${url}`
      : url;
  };

  /**
     * Loads item data when modal is opened or item ID changes.
     *
     * Behavior:
     * - Reset form state on open
     * - Load item from backend (authenticated)
     * - Load item from local state (guest)
     */
  useEffect(() => {
    if (!show) return;

    setError(null);
    setItemImageFile(null);
    setImagePreview(null);
    setCurrentImageId(null);
    
    // Reset file input manually
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Create mode
    if (!id) {
      setItemName("");
      setItemCount(0);
      return;
    }

    // 🟢 Authenticated (online) mode
    if (session.status === "authenticated") {
      setLoading(true);

      apiGet(`/list/${listId}/items/${id}`)
        .then((data) => {
          console.log(data)
          setItemName(data.name);
          setItemCount(data.count);
          
          /**
           * Image ID resolution.
           *
           * My note:
           * Supports both flattened DTO and nested image object.
           */
          const imgId = data.imageId ?? data.image?.id ?? null;
          setCurrentImageId(imgId);

          if (imgId) {
            setImagePreview(resolveImageUrl(`/images/${imgId}`));
          }
        })
        .catch(() => setError("Nepodařilo se načíst položku"))
        .finally(() => setLoading(false));
    } else {
       // 🟡 Guest (offline) mode → search in local items
      const found = Array.isArray(items)
        ? items.find((i) => String(i.id) === String(id))
        : null;

      if (found) {
        setItemName(found.name);
        setItemCount(found.count);
      }
    }
  }, [id, session.status, listId, items]);

   /**
   * Cleanup effect for blob URLs.
   *
   * Note:
   * Prevents memory leaks when previewing local images.
   */
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /**
   * Deletes item image (authenticated mode only).
   *
   * Note:
   * Keeps UI state in sync with backend after deletion.
   */
  const handleDeleteImage = async () => {
    if (!id) return;
    try {
      setLoading(true);

      // Symmetric endpoint to image upload
      await apiDelete(`/list/${listId}/items/${id}/image`);

      // Cleanup preview and file input
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setItemImageFile(null);
      setImagePreview(null);
      setCurrentImageId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      showFlash("success", "Obrázek smazán.");
      onSaved?.();
    } catch (e) {
      console.error(e);
      showFlash("danger", "Smazání obrázku se nezdařilo.");
    } finally {
      setLoading(false);
    }
  };

  
  /**
   * Handles form submission.
   *
   * Behavior:
   * - Authenticated → backend API calls
   * - Guest → local state + localStorage
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🟢 Authenticated (online) mode
      if (session.status === "authenticated") {
        const payload = {
          name: itemName,
          count: itemCount,
          listId: listId,
        };

        if (id) {

          // Update item
          await apiPut(`/list/${listId}/items/${id}`, payload);

          // Upload image if selected
          if (itemImageFile) {
            const formData = new FormData();
            formData.append("file", itemImageFile);
            await apiPut(`/list/${listId}/items/${id}/image`, formData);
          }
        } else {

          // Create new item
          await apiPost(`/list/${listId}/items`, payload);
        }

        showFlash("success", id ? "Položka upravena." : "Položka vytvořena.");
        onSaved?.();
        onClose();
        return;
      }

      // 🟡 Guest (offline) mode
      const safeItems = Array.isArray(items) ? items : [];
      let updatedItems;
      if (id) {

        // Edit existing item
        updatedItems = safeItems.map((i) =>
          String(i.id) === String(id)
            ? { ...i, name: itemName, count: itemCount }
            : i
        );
      } else {

        // Create new item
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

      // Update React state
      setItems(updatedItems);

      // Persist to localStorage (single source of truth)
      updateGuestItems(listId, updatedItems);

      showFlash("success",
         id
          ? "Položka upravena (guest režim)."
           : "Položka vytvořena (guest režim)."
          );
      // Cleanup blob URL if any
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
  // Do not render modal when not visible
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
              {/* Image upload available only for authenticated users */}
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

                        // Revoke previous blob preview if present
                        if (imagePreview?.startsWith("blob:")) {
                          URL.revokeObjectURL(imagePreview);
                        }
                        // Instant local preview of selected image
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