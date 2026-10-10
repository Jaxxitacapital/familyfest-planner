import React, { useEffect, useState } from "react";
import { Camera, Plus, Trash2, Image as ImageIcon, Printer } from "lucide-react";

const DB_NAME = "familyfest-photos";
const STORE_NAME = "photos";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPhotos() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePhoto(photo) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.put(photo);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function deletePhoto(id) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.delete(id);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export default function PhotosGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    try {
      const saved = await getPhotos();

      const prepared = saved
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(photo => ({
          ...photo,
          url: URL.createObjectURL(photo.blob)
        }));

      setPhotos(prepared);
    } catch (error) {
      console.error("Could not load photos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []);

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const photo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        caption: "",
        blob: file,
        createdAt: Date.now()
      };

      try {
        await savePhoto(photo);

        setPhotos(current => [
          {
            ...photo,
            url: URL.createObjectURL(file)
          },
          ...current
        ]);
      } catch (error) {
        console.error("Could not save photo:", error);
      }
    }

    event.target.value = "";
  }

  async function removePhoto(photo) {
    if (!confirm("Remove this photo from FamilyFest Memories?")) return;

    try {
      await deletePhoto(photo.id);

      URL.revokeObjectURL(photo.url);

      setPhotos(current =>
        current.filter(item => item.id !== photo.id)
      );
    } catch (error) {
      console.error("Could not delete photo:", error);
    }
  }

  async function updateCaption(id, caption) {
    const photo = photos.find(item => item.id === id);

    if (!photo) return;

    const updated = {
      ...photo,
      caption,
      blob: photo.blob,
      url: undefined
    };

    try {
      await savePhoto(updated);

      setPhotos(current =>
        current.map(item =>
          item.id === id
            ? { ...item, caption }
            : item
        )
      );
    } catch (error) {
      console.error("Could not save caption:", error);
    }
  }

  function printPhotos() {
    window.print();
  }

  return (
    <div className="photos-page">

      <div className="toolbar photos-toolbar">
        <div>
          <h2>Photos & Memories</h2>
          <p>
            Capture the best moments from your FamilyFest event.
          </p>
        </div>

        <div className="photos-actions">

          <label className="primary photos-add">
            <Plus size={17} />
            Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              hidden
            />
          </label>

          {photos.length > 0 && (
            <button
              className="secondary"
              onClick={printPhotos}
            >
              <Printer size={17} />
              Print memories
            </button>
          )}

        </div>
      </div>

      {loading ? (
        <div className="empty large-empty">
          Loading your memories...
        </div>
      ) : photos.length === 0 ? (

        <div className="photos-empty">
          <div className="photos-empty-icon">
            <Camera size={38} />
          </div>

          <h3>No memories yet</h3>

          <p>
            Add photos from your FamilyFest and build a gallery
            of the day.
          </p>

          <label className="primary photos-add">
            <Plus size={17} />
            Add your first photos

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              hidden
            />
          </label>
        </div>

      ) : (

        <>

          <div className="photos-summary">
            <div>
              <ImageIcon size={18} />
              <b>{photos.length}</b>
              {photos.length === 1 ? " memory" : " memories"}
            </div>

            <span>
              Your photos are saved on this browser.
            </span>
          </div>

          <div className="photos-grid">

            {photos.map(photo => (

              <article className="photo-card" key={photo.id}>

                <div className="photo-image-wrap">
                  <img
                    src={photo.url}
                    alt={photo.caption || photo.name}
                  />

                  <button
                    className="photo-delete"
                    onClick={() => removePhoto(photo)}
                    title="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="photo-card-body">

                  <input
                    className="photo-caption"
                    value={photo.caption}
                    onChange={event =>
                      updateCaption(
                        photo.id,
                        event.target.value
                      )
                    }
                    placeholder="Add a caption..."
                  />

                  <small>
                    {photo.name}
                  </small>

                </div>

              </article>

            ))}

          </div>

        </>

      )}

    </div>
  );
}