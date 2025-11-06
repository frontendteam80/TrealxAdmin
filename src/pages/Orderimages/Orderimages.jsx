 import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import { Funnel } from "lucide-react";
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
  const { fetchData, postData } = useApi();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editableImages, setEditableImages] = useState([]);
  const [modified, setModified] = useState(false);

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

  // ✅ Columns
  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
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
      render: (_, row) => (
        <button
          onClick={() => {
            const sortedImgs = [...row.images].sort(
              (a, b) => (a.DisplayOrderID || 0) - (b.DisplayOrderID || 0)
            );
            setSelectedRow(row);
            setEditableImages(sortedImgs);
            setShowModal(true);
            setModified(false);
          }}
          style={{
            background: "#121212",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Edit
        </button>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = editableImages.findIndex(
      (img, idx) => (img.DisplayOrderID || idx + 1).toString() === active.id
    );
    const newIndex = editableImages.findIndex(
      (img, idx) => (img.DisplayOrderID || idx + 1).toString() === over.id
    );

    const newArr = arrayMove(editableImages, oldIndex, newIndex).map(
      (img, idx) => ({ ...img, DisplayOrderID: idx + 1 })
    );
    setEditableImages(newArr);
    setModified(true);
  };

  const handleSave = async () => {
    try {
      await postData("OrderImage/UpdateOrder", editableImages);
      alert("✅ Image order saved successfully!");
      setShowModal(false);
      setModified(false);
    } catch (err) {
      alert("❌ Failed to save order. Check server/API.");
    }
  };

  const Spinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <div
        style={{
          width: 45,
          height: 45,
          border: "5px solid #ccc",
          borderTop: "5px solid #252a2fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );

  const toggleFilter = (key) => {
    setOpenFilter(openFilter === key ? null : key);
    setSearchValue("");
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      if (value === "All") return { ...prev, [key]: ["All"] };
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current.filter((v) => v !== "All"), value];
      return { ...prev, [key]: updated };
    });
  };

  const uniqueValues = (key) =>
    Array.from(new Set(data.map((d) => d[key]).filter(Boolean)));

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20,marginLeft: "180px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#fff",
            border: "#121212",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.9rem",
            color: "#121212",
          }}
        >
           Back
        </button>

        <h2 style={{ marginBottom: 20, color: "#222" ,fontweight:400}}>
          Project Image Display Order
        </h2>

        {loading ? (
          <Spinner />
        ) : (
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
              padding: "10px 0",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6", height: 38 }}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        padding: "6px 8px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #e5e7eb",
                        position: "relative",
                      }}
                    >
                      {col.label}
                      {col.key !== "serialNo" && col.key !== "action" && (
                        <Funnel
                          size={13}
                          style={{
                            marginLeft: 4,
                            cursor: "pointer",
                            verticalAlign: "middle",
                          }}
                          onClick={() => toggleFilter(col.key)}
                        />
                      )}
                      {openFilter === col.key && (
                        <div
                          style={{
                            position: "absolute",
                            top: "110%",
                            right: 0,
                            background: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            width: 180,
                            zIndex: 1000,
                            padding: 8,
                            textAlign: "left",
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "4px 6px",
                              marginBottom: 6,
                              fontSize: "0.8rem",
                              border: "1px solid #ccc",
                              borderRadius: 4,
                            }}
                          />
                          <div
                            style={{
                              maxHeight: 150,
                              overflowY: "auto",
                              fontSize: "0.8rem",
                            }}
                          >
                            <label style={{ display: "block" }}>
                              <input
                                type="checkbox"
                                checked={
                                  (filters[col.key] || []).includes("All") ||
                                  (filters[col.key] || []).length === 0
                                }
                                onChange={() =>
                                  handleCheckboxChange(col.key, "All")
                                }
                              />{" "}
                              All
                            </label>
                            {uniqueValues(col.key)
                              .filter((v) =>
                                v
                                  ?.toString()
                                  .toLowerCase()
                                  .includes(searchValue.toLowerCase())
                              )
                              .map((val) => (
                                <label key={val} style={{ display: "block" }}>
                                  <input
                                    type="checkbox"
                                    checked={(filters[col.key] || []).includes(
                                      val
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(col.key, val)
                                    }
                                  />{" "}
                                  {val}
                                </label>
                              ))}
                          </div>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      height: 34,
                      borderBottom: "1px solid #f0f0f0",
                      fontSize: "0.83rem",
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={{ padding: "4px 6px" }}>
                        {col.render
                          ? col.render(row[col.key], row, idx)
                          : row[col.key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                padding: "10px 0",
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  cursor: "pointer",
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  cursor: "pointer",
                  opacity: page === totalPages ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Image reorder modal */}
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
            }}
          >
            <h3 style={{ marginBottom: 10 }}>{selectedRow.ProjectName}</h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={editableImages.map((img, idx) =>
                  (img.DisplayOrderID != null
                    ? img.DisplayOrderID
                    : idx + 1
                  ).toString()
                )}
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
                    <SortableImage
                      key={
                        imgObj.DisplayOrderID != null
                          ? imgObj.DisplayOrderID
                          : index + 1
                      }
                      img={imgObj}
                      id={(
                        imgObj.DisplayOrderID != null
                          ? imgObj.DisplayOrderID
                          : index + 1
                      ).toString()}
                      index={index}
                      total={editableImages.length}
                    />
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
