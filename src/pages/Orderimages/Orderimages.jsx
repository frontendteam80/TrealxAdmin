 import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import Table, { Pagination } from "../../Utils/Table.jsx";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, X } from "lucide-react";

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
          fontSize: "0.9em",
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
  const { fetchData, postData } = useApi();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editableImages, setEditableImages] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modified, setModified] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  // ✅ Fetch Order Image Data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchData("OrderImage");

        const grouped = {};
        (result || []).forEach((img) => {
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

        const arr = Object.values(grouped);
        setData(arr);
        setFilteredData(arr);
      } catch (err) {
        setError(err.message || "Error loading images");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchData]);

  // ✅ Filter logic
  useEffect(() => {
    let result = [...data];
    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0 && !selected.includes("All")) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });
    setFilteredData(result);
    setPage(1);
  }, [filters, data]);

  // ✅ Columns (serial now reflects pagination)
  const columns = [
    {
      label: "S.No",
      key: "serialNo",
      render: (_, __, idx) => (page - 1) * rowsPerPage + (idx + 1),
      canFilter: false,
    },
    { label: "Project ID", key: "ProjectID" },
    { label: "Project Name", key: "ProjectName" },
    { label: "Locality", key: "Locality" },
    { label: "City", key: "City" },
    { label: "Zipcode", key: "Zipcode" },
    {
      label: "Image Count",
      key: "images",
      render: (imgs) => (Array.isArray(imgs) ? imgs.length : 0),
    },
    {
      label: "Action",
      key: "action",
      canFilter: false,
      render: (_, row) => (
        <button
          onClick={() => {
            const sortedImgs = [...row.images]
              .sort((a, b) => (a.DisplayOrderID || 0) - (b.DisplayOrderID || 0))
              .map((img, idx) => {
                const sortableId = img.ImageID
                  ? String(img.ImageID)
                  : `temp-${Date.now()}-${idx}`;
                return {
                  ...img,
                  sortableId,
                  DisplayOrderID: img.DisplayOrderID ?? idx + 1,
                };
              });

            setSelectedRow(row);
            setEditableImages(sortedImgs);
            setShowModal(true);
            setModified(false);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          title="View Images"
        >
          <Eye size={16} color="#111" />
        </button>
      ),
    },
  ];

  // ✅ Paginated data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const toggleFilter = (key) =>
    setOpenFilter((prev) => (prev === key ? null : key));

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const existing = prev[key] || [];
      return existing.includes(value)
        ? { ...prev, [key]: existing.filter((v) => v !== value) }
        : { ...prev, [key]: [...existing, value] };
    });
  };

  const uniqueValues = (key) => [
    ...new Set(data.map((d) => d[key]).filter(Boolean)),
  ];

  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };

  const hasActiveFilter = (key) => filters[key]?.length > 0;

  // ✅ Drag end logic
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = editableImages.findIndex(
      (img) => String(img.sortableId) === String(active.id)
    );
    const newIndex = editableImages.findIndex(
      (img) => String(img.sortableId) === String(over.id)
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const newArr = arrayMove(editableImages, oldIndex, newIndex).map(
      (img, idx) => ({
        ...img,
        DisplayOrderID: idx + 1,
      })
    );

    setEditableImages(newArr);
    setModified(true);
  };

  // ✅ Save order payload
  const handleSave = async () => {
    try {
      const payload = editableImages.map((img) => ({
        ImageID: img.ImageID ?? null,
        ProjectID: img.ProjectID ?? selectedRow?.ProjectID,
        ImageUrl: img.ImageUrl,
        DisplayOrderID: img.DisplayOrderID,
      }));

      await postData("OrderImage/UpdateOrder", payload);

      alert("✅ Image order saved successfully!");
      setModified(false);
      setShowModal(false);

      const refreshed = await fetchData("OrderImage");
      const grouped = {};
      (refreshed || []).forEach((img) => {
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
      const arr = Object.values(grouped);
      setData(arr);
      setFilteredData(arr);
    } catch (err) {
      console.error("Save failed", err);
      alert("❌ Failed to save order. Check API / console.");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20, marginLeft: "180px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "5px 14px",
            cursor: "pointer",
            fontSize: "0.85rem",
            color: "#121212",
            marginBottom: 6,
          }}
        >
          Back
        </button>

        <h2
          style={{
            marginBottom: 14,
            color: "#222",
            fontSize: "1.05rem",
            fontWeight: "600",
          }}
        >
          Project Image Display Order
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>Loading...</div>
        ) : (
          <>
            <Table
              columns={columns}
              paginatedData={paginatedData}
              filters={filters}
              openFilter={openFilter}
              toggleFilter={toggleFilter}
              handleCheckboxChange={handleCheckboxChange}
              uniqueValues={uniqueValues}
              clearFilter={clearFilter}
              hasActiveFilter={hasActiveFilter}
              applyFilter={() => setOpenFilter(null)}
              rowKey={(row, idx) => row.id ?? row.ProjectID ?? `row-${idx}`}
            />

            {totalPages > 1 && (
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRow && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 14,
              width:
                editableImages.length <= 3
                  ? Math.max(editableImages.length * 180, 300)
                  : "95%",
              maxWidth: "1500px",
              maxHeight: "90vh",
              overflowY: editableImages.length > 6 ? "auto" : "hidden",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            {/* Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              title="Close"
            >
              <X size={22} color="#222" />
            </button>

            <h3 style={{ marginBottom: 10 }}>{selectedRow.ProjectName}</h3>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={editableImages.map((img) => String(img.sortableId))}
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
                  }}
                >
                  {editableImages.map((imgObj, index) => (
                    <div key={String(imgObj.sortableId)}>
                      <SortableImage
                        img={imgObj}
                        id={String(imgObj.sortableId)}
                        index={index}
                        total={editableImages.length}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {modified && (
              <div style={{ textAlign: "right", marginTop: 20 }}>
                <button
                  onClick={handleSave}
                  style={{
                    background: "#121212",
                    color: "#fff",
                    padding: "8px 24px",
                    borderRadius: 6,
                    fontWeight: 600,
                    border: "none",
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
