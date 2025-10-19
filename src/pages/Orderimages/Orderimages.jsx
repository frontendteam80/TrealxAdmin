 // src/pages/Orderimages/Orderimages.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table from "../../components/Table.jsx";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ---------- Sortable Image ----------
function SortableImage({ img, id, index, total }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    cursor: "grab",
  };

  const isSingle = total === 1;

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        borderRadius: 12,
        padding: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        width: isSingle ? "300px" : "100%",
        ...style,
      }}
      {...attributes}
      {...listeners}
    >
      <img
        src={img.ImageUrl}
        alt={`Project image ${img.DisplayOrderID}`}
        style={{
          width: "100%",
          height: isSingle ? 220 : 180,
          objectFit: "cover",
          borderRadius: 10,
        }}
      />
      <span
        style={{
          marginTop: 8,
          fontSize: "0.95em",
          color: "#333",
          fontWeight: 600,
        }}
      >
        OrderID: {img.DisplayOrderID}
      </span>
    </div>
  );
}

// ---------- Main Component ----------
export default function OrderImages() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchData, postData } = useApi();

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editableImages, setEditableImages] = useState([]);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchData("OrderImage");
        const grouped = {};
        (data || []).forEach((img) => {
          if (!grouped[img.ProjectID]) {
            grouped[img.ProjectID] = {
              id: img.ProjectID,
              ProjectID: img.ProjectID,
              ProjectName: img.ProjectName,
              Locality: img.Locality,
              City: img.City,
              Zipcode: img.Zipcode,
              images: [],
            };
          }
          grouped[img.ProjectID].images.push(img);
        });
        setProjects(Object.values(grouped));
      } catch (err) {
        setError(err.message || "Error loading images");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);

  const columns = [
    { label: "S.No", key: "serial", render: (_, __, index) => index + 1 },
    { label: "Project ID", key: "ProjectID" },
    { label: "Project Name", key: "ProjectName" },
    { label: "Locality", key: "Locality" },
    { label: "City", key: "City" },
    { label: "Zipcode", key: "Zipcode" },
    {
      label: "Image Count",
      key: "images",
      render: (images) => (Array.isArray(images) ? images.length : 0),
    },
    {
      label: "Action",
      key: "action",
      render: (_, row) => (
        <button
          style={{
            background: "#121212",
            cursor: "pointer",
            color: "#fff",
            padding: "7px 14px",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "1em",
            border: "none",
          }}
          onClick={() => {
            const sortedImgs = [...row.images].sort(
              (a, b) => a.DisplayOrderID - b.DisplayOrderID
            );
            setSelectedProject(row);
            setEditableImages(sortedImgs);
            setShowModal(true);
            setModified(false);
          }}
        >
          Edit
        </button>
      ),
    },
  ];

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = editableImages.findIndex(
        (img) => img.DisplayOrderID.toString() === active.id.toString()
      );
      const newIndex = editableImages.findIndex(
        (img) => img.DisplayOrderID.toString() === over.id.toString()
      );

      const newArr = arrayMove(editableImages, oldIndex, newIndex).map(
        (img, idx) => ({
          ...img,
          DisplayOrderID: idx + 1,
        })
      );

      setEditableImages(newArr);
      setModified(true);
    }
  }

  const handleSave = async () => {
    try {
      if (!editableImages.length) return;

      await postData("OrderImage/UpdateOrder", editableImages);

      setSelectedProject((prev) => ({ ...prev, images: editableImages }));
      setProjects((prev) =>
        prev.map((p) =>
          p.ProjectID === selectedProject.ProjectID
            ? { ...p, images: editableImages }
            : p
        )
      );
      setShowModal(false);
      setModified(false);
      alert("✅ Image order saved successfully!");
    } catch (err) {
      console.error("Error saving order:", err);
      alert("❌ Failed to save order. Please check server/API.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setModified(false);
    setEditableImages(selectedProject ? selectedProject.images : []);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="dashboard-container" style={{ display: "flex" }}>
        <Sidebar />
        <div
        className="buyers-content"
        style={{
          flex: 1,
          position: "relative",
          minHeight: "100vh",
          // maxWidth: "calc(100vw - 260px)",
          overflowX: "auto",
          padding: 24,
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>Project Image Display Order</h2>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#d4af37",
            }}
          >
            Kiran Reddy Pallaki
          </div>
        </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table columns={columns} data={projects} rowsPerPage={15} />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedProject && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleClose}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 14,
              width:
                editableImages.length === 1
                  ? "320px"
                  : "95%",
              maxWidth: editableImages.length === 1 ? "350px" : "1500px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ fontWeight: 600, fontSize: "1.15rem" }}>
                {selectedProject.ProjectName} Images
              </h3>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
                onClick={handleClose}
              >
                &times;
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={editableImages.map((img) =>
                  img.DisplayOrderID.toString()
                )}
                strategy={rectSortingStrategy}
              >
                <div
                  className="image-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      editableImages.length === 1
                        ? "1fr"
                        : "repeat(6, 1fr)",
                    gap: 18,
                    justifyItems: "center",
                    marginTop: 6,
                  }}
                >
                  {editableImages.map((imgObj, index) => (
                    <SortableImage
                      key={imgObj.DisplayOrderID}
                      img={imgObj}
                      id={imgObj.DisplayOrderID.toString()}
                      index={index}
                      total={editableImages.length}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {modified && (
              <div style={{ marginTop: 20, textAlign: "right" }}>
                <button
                  style={{
                    background: "#121212",
                    color: "#fff",
                    padding: "8px 24px",
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: "1.03em",
                    border: "none",
                  }}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
