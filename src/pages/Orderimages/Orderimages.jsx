 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table from "../../Utils/Table.jsx";
import { useNavigate } from "react-router-dom";
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

  const orderNumber = img.DisplayOrderID != null ? img.DisplayOrderID : index + 1;
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
        width: isSingle ? "300px" : "180px",
        ...style,
      }}
      {...attributes}
      {...listeners}
    >
      <img
        src={img.ImageUrl}
        alt={`Project image ${orderNumber}`}
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
        OrderID: {orderNumber}
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

  const [pageIndex, setPageIndex] = useState(0);
  const rowsPerPage = 15;

  const navigate = useNavigate();

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
        setPageIndex(0);
      }
    }
    load();
  }, [fetchData]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = editableImages.findIndex(
        (img, idx) => (img.DisplayOrderID != null ? img.DisplayOrderID : idx + 1).toString() === active.id
      );
      const newIndex = editableImages.findIndex(
        (img, idx) => (img.DisplayOrderID != null ? img.DisplayOrderID : idx + 1).toString() === over.id
      );

      const newArr = arrayMove(editableImages, oldIndex, newIndex).map((img, idx) => ({
        ...img,
        DisplayOrderID: idx + 1,
      }));

      setEditableImages(newArr);
      setModified(true);
    }
  };

  const handleSave = async () => {
    try {
      if (!editableImages.length) return;

      await postData("OrderImage/UpdateOrder", editableImages);

      setSelectedProject((prev) => ({ ...prev, images: editableImages }));
      setProjects((prev) =>
        prev.map((p) => (p.ProjectID === selectedProject.ProjectID ? { ...p, images: editableImages } : p))
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

  const columns = [
    { label: "S.No", key: "serial", render: (_, __, index) => index + 1 + pageIndex * rowsPerPage },
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
            padding: "3px 8px",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.95em",
            border: "none",
          }}
          onClick={() => {
            const sortedImgs = [...row.images].sort(
              (a, b) => (a.DisplayOrderID || 0) - (b.DisplayOrderID || 0)
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

  const paginatedProjects = projects.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);

  const navButtonStyle = {
    padding: "5px 10px",
    margin: "0 5px",
    borderRadius: 6,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#725fe9",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const pageButtonStyle = {
    padding: "6px 12px",
    margin: "0 4px",
    borderRadius: 6,
    outline: "none",
    cursor: "pointer",
  };

  function renderPagination() {
    const totalPages = Math.ceil(projects.length / rowsPerPage);
    const buttons = [];
    buttons.push(0);
    let left = Math.max(1, pageIndex - 2);
    let right = Math.min(totalPages - 2, pageIndex + 2);

    if (left > 1) buttons.push("left-ellipsis");
    for (let i = left; i <= right; i++) buttons.push(i);
    if (right < totalPages - 2) buttons.push("right-ellipsis");
    if (totalPages > 1) buttons.push(totalPages - 1);

    return (
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0} style={navButtonStyle}>««</button>
        <button onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))} disabled={pageIndex === 0} style={navButtonStyle}>‹</button>

        {buttons.map((b, idx) => {
          if (typeof b === "string") return <span key={b + idx} style={{ padding: "0 6px" }}>...</span>;
          return (
            <button
              key={b}
              onClick={() => setPageIndex(b)}
              style={{
                ...pageButtonStyle,
                backgroundColor: b === pageIndex ? "#725fe9" : "#fff",
                color: b === pageIndex ? "#fff" : "#222",
                border: b === pageIndex ? "2px solid #725fe9" : "1px solid #ccc",
                fontWeight: b === pageIndex ? 700 : 400,
              }}
            >
              {b + 1}
            </button>
          );
        })}

        <button onClick={() => setPageIndex(Math.min(pageIndex + 1, totalPages - 1))} disabled={pageIndex === totalPages - 1} style={navButtonStyle}>›</button>
        <button onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex === totalPages - 1} style={navButtonStyle}>»»</button>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="dashboard-container" style={{ display: "flex" }}>
        <Sidebar />
        <div className="buyers-content" style={{ flex: 1, position: "relative", minHeight: "100vh", padding: 24 }}>
          {/* Back button */}
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              marginBottom: 12,
              padding: "6px 14px",
              backgroundColor: "#5259d4",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>

          <h2 style={{ marginBottom: 16 }}>Project Image Display Order</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Table
                columns={columns}
                data={paginatedProjects}
                rowsPerPage={rowsPerPage}
                rowHeight={25}
              />
              {renderPagination()}
            </>
          )}
        </div>
      </div>

      {/* Modal for image reorder */}
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
                editableImages.length <= 3
                  ? Math.max(editableImages.length * 180, 300) + "px"
                  : "95%",
              maxWidth: "1500px",
              maxHeight: "90vh",
              overflowY: editableImages.length > 6 ? "auto" : "hidden",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontWeight: 600, fontSize: "1.15rem" }}>
                {selectedProject.ProjectName} Images
              </h3>
              <button
                style={{ background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer", fontWeight: "bold", lineHeight: 1 }}
                onClick={handleClose}
              >
                &times;
              </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={editableImages.map((img, idx) => (img.DisplayOrderID != null ? img.DisplayOrderID : idx + 1).toString())}
                strategy={rectSortingStrategy}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      editableImages.length === 1
                        ? "1fr"
                        : `repeat(auto-fit, minmax(180px, 1fr))`,
                    gap: 18,
                    justifyItems: "center",
                    marginTop: 6,
                  }}
                >
                  {editableImages.map((imgObj, index) => (
                    <SortableImage
                      key={imgObj.DisplayOrderID != null ? imgObj.DisplayOrderID : index + 1}
                      img={imgObj}
                      id={(imgObj.DisplayOrderID != null ? imgObj.DisplayOrderID : index + 1).toString()}
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
