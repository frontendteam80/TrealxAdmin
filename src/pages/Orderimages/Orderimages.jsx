//  // src/pages/Orderimages/Orderimages.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useNavigate } from "react-router-dom";
// import { useApi } from "../../API/Api.js";
// import Table from "../../Utils/Table.jsx";
// import SearchBar from "../../Utils/SearchBar.jsx";
// import BackButton from "../../Utils/Backbutton.jsx";

// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   rectSortingStrategy,
//   useSortable,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { Eye, X } from "lucide-react";

// /* ---------- Sortable Image Card (compact) ---------- */
// function SortableImage({ img, id, index, total }) {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
//     useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.75 : 1,
//     cursor: "grab",
//   };

//   const isSingle = total === 1;
//   const cardWidth = isSingle ? 300 : 150;
//   const imgHeight = isSingle ? 180 : 110;
//   const orderNumber = img.DisplayOrderID != null ? img.DisplayOrderID : index + 1;

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "#fff",
//         borderRadius: 10,
//         padding: 8,
//         boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
//         width: cardWidth,
//         ...style,
//       }}
//     >
//       <img
//         src={img.ImageUrl}
//         alt={`Project image ${orderNumber}`}
//         style={{ width: "100%", height: imgHeight, objectFit: "cover", borderRadius: 8 }}
//       />
//       <span style={{ marginTop: 6, fontSize: "0.85em", color: "#333", fontWeight: 600 }}>
//         Order ID: {orderNumber}
//       </span>
//     </div>
//   );
// }

// /* ---------- Main Component ---------- */
// export default function OrderImages() {
//   const { fetchData, postData } = useApi();
//   const navigate = useNavigate();

//   const [data, setData] = useState([]); // grouped full dataset
//   const [filteredData, setFilteredData] = useState([]); // after filters/search
//   const [filters, setFilters] = useState({});
//   const [openFilter, setOpenFilter] = useState(null);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   const [searchValue, setSearchValue] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [editableImages, setEditableImages] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [modified, setModified] = useState(false);

//   const sensors = useSensors(useSensor(PointerSensor));

//   // apply current filters/search to dataset
//   const applyFiltersTo = (dataset) => {
//     let result = Array.isArray(dataset) ? [...dataset] : [];
//     Object.keys(filters).forEach((k) => {
//       const sel = filters[k];
//       if (sel && sel.length > 0 && !sel.includes("All")) {
//         result = result.filter((r) => sel.includes(r[k]));
//       }
//     });
//     if (searchValue && searchValue.trim()) {
//       const q = searchValue.toLowerCase();
//       result = result.filter((r) =>
//         ["ProjectID", "ProjectName", "Locality", "City", "Zipcode"].some((k) =>
//           r[k] ? String(r[k]).toLowerCase().includes(q) : false
//         )
//       );
//     }
//     return result;
//   };

//   /* ---------- Fetch and group data ---------- */
//   useEffect(() => {
//     let mounted = true;
//     async function load() {
//       try {
//         setLoading(true);
//         const result = await fetchData("OrderImage");
//         const grouped = {};
//         (result || []).forEach((img) => {
//           const pid = img.ProjectID ?? "__unknown__";
//           if (!grouped[pid]) {
//             grouped[pid] = {
//               id: pid,
//               ProjectID: pid,
//               ProjectName: img.ProjectName,
//               Locality: img.Locality,
//               City: img.City,
//               Zipcode: img.Zipcode,
//               images: [],
//             };
//           }
//           grouped[pid].images.push(img);
//         });
//         const arr = Object.values(grouped);
//         if (!mounted) return;
//         setData(arr);
//         setFilteredData(arr);
//       } catch (err) {
//         if (!mounted) return;
//         setError(err?.message || "Error loading images");
//       } finally {
//         if (!mounted) return;
//         setLoading(false);
//       }
//     }
//     load();
//     return () => {
//       mounted = false;
//     };
//   }, [fetchData]);

//   /* ---------- Filter & Search (derive filteredData) ---------- */
//   useEffect(() => {
//     const result = applyFiltersTo(data);
//     setFilteredData(result);
//     setPage(1);
//   }, [filters, data, searchValue]); // eslint-disable-line

//   /* ---------- Table columns ---------- */
//   const columns = [
//     {
//       label: "S.No",
//       key: "serialNo",
//       render: (_, __, idx) => (page - 1) * rowsPerPage + (idx + 1),
//       canFilter: false,
//     },
//     { label: "Project ID", key: "ProjectID" },
//     { label: "Project Name", key: "ProjectName" },
//     { label: "Locality", key: "Locality" },
//     { label: "City", key: "City" },
//     { label: "Zipcode", key: "Zipcode" },
//     {
//       label: "Image Count",
//       key: "images",
//       render: (imgs) => (Array.isArray(imgs) ? imgs.length : 0),
//     },
//     {
//       label: "Action",
//       key: "action",
//       canFilter: false,
//       render: (_, row) => (
//         <button
//           onClick={() => {
//             const sortedImgs = (row.images || [])
//               .slice()
//               .sort((a, b) => (a.DisplayOrderID || 0) - (b.DisplayOrderID || 0))
//               .map((img, idx) => ({
//                 ...img,
//                 // stable sortableId: prefer ImageID, else include project id for stability
//                 sortableId: img.ImageID ? String(img.ImageID) : `temp-${row.ProjectID}-${idx}`,
//                 DisplayOrderID: img.DisplayOrderID ?? idx + 1,
//               }));
//             setSelectedRow(row);
//             setEditableImages(sortedImgs);
//             setShowModal(true);
//             setModified(false);
//           }}
//           style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
//           title="View Images"
//         >
//           <Eye size={16} color="#111" />
//         </button>
//       ),
//     },
//   ];

//   /* ---------- Pagination helper ---------- */
//   const paginatedData = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return filteredData.slice(start, start + rowsPerPage);
//   }, [filteredData, page]); // eslint-disable-line

//   /* ---------- Filter helpers ---------- */
//   const toggleFilter = (key) => setOpenFilter((p) => (p === key ? null : key));
//   const handleCheckboxChange = (key, value) =>
//     setFilters((p) => {
//       const cur = p[key] || [];
//       return cur.includes(value) ? { ...p, [key]: cur.filter((x) => x !== value) } : { ...p, [key]: [...cur, value] };
//     });

//   // produce dropdown values from currently filteredData (so other columns show options constrained by active filters)
//   const uniqueValues = (key) => Array.from(new Set((filteredData || []).map((d) => d[key]).filter(Boolean)));

//   const clearFilter = (key) => setFilters((p) => {
//     const c = { ...p };
//     delete c[key];
//     return c;
//   });

//   const hasActiveFilter = (key) => Array.isArray(filters[key]) && filters[key].length > 0;

//   /* ---------- Drag end ---------- */
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;

//     const oldIdx = editableImages.findIndex((i) => String(i.sortableId) === String(active.id));
//     const newIdx = editableImages.findIndex((i) => String(i.sortableId) === String(over.id));
//     if (oldIdx === -1 || newIdx === -1) return;

//     const newArr = arrayMove(editableImages, oldIdx, newIdx).map((img, idx) => ({ ...img, DisplayOrderID: idx + 1 }));
//     setEditableImages(newArr);
//     setModified(true);
//   };

//   /* ---------- Save updated order (fallback if postData missing) ---------- */
//    // Replace your existing handleSave with this function
// async function handleSave() {
//   // normalize payload: ensure DisplayOrderID is a number
//   const payload = editableImages.map((img) => ({
//     ImageID: img.ImageID ?? null,
//     ProjectID: img.ProjectID ?? selectedRow?.ProjectID ?? null,
//     ImageUrl: img.ImageUrl ?? "",
//     DisplayOrderID: Number(img.DisplayOrderID ?? 0),
//   }));

//   console.log("OrderImages: prepared payload", payload);

//   // canonical endpoint you've been hitting (use same host)
//   const url = "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data";

//   // wrapper shape: action + data as JSON string (this is the single focused attempt)
//   const body = {
//     action: "OrderImage/UpdateOrder",
//     data: JSON.stringify(payload), // <--- important: stringified array inside `data`
//   };

//   // headers (include Bearer if token present)
//   const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
//   const headers = {
//     "Content-Type": "application/json; charset=utf-8",
//     Accept: "application/json",
//   };
//   if (token) headers.Authorization = `Bearer ${token}`;

//   try {
//     console.log(`OrderImages: POST ${url}`, body);
//     const resp = await fetch(url, {
//       method: "POST",
//       mode: "cors",
//       credentials: "include",
//       headers,
//       body: JSON.stringify(body),
//     });

//     const text = await resp.text();
//     let parsed = text;
//     try { parsed = text ? JSON.parse(text) : text; } catch (e) { /* keep raw text */ }

//     console.log("OrderImages: response status:", resp.status, "body:", parsed);

//     if (resp.ok) {
//       // Success: refresh UI like before
//       try {
//         const refreshed = await fetchData("OrderImage");
//         const grouped = {};
//         (refreshed || []).forEach((img) => {
//           const pid = img.ProjectID ?? "__unknown__";
//           if (!grouped[pid]) {
//             grouped[pid] = {
//               id: pid,
//               ProjectID: pid,
//               ProjectName: img.ProjectName,
//               Locality: img.Locality,
//               City: img.City,
//               Zipcode: img.Zipcode,
//               images: [],
//             };
//           }
//           grouped[pid].images.push(img);
//         });
//         const arr = Object.values(grouped);
//         setData(arr);
//         setFilteredData(arr);
//         setModified(false);
//         setShowModal(false);
//         alert("✅ Image order saved successfully!");
//       } catch (refreshErr) {
//         console.warn("OrderImages: saved but refresh failed:", refreshErr);
//         setModified(false);
//         setShowModal(false);
//         alert("✅ Saved (server OK) — but refresh failed. Check console.");
//       }
//       return;
//     }

//     // non-OK response: log + surface to you
//     console.error("OrderImages: server returned non-OK with body — check response above for expected schema");
//     // If the server returned structured error info (like {Errors:[...]}) show it
//     const friendly = parsed && typeof parsed === "object" ? JSON.stringify(parsed) : String(parsed || "(empty)");
//     alert(`❌ Save failed: server returned ${resp.status}. See console for details.\n\nServer message: ${friendly}`);
//   } catch (err) {
//     console.error("OrderImages: network/error while saving:", err);
//     alert("❌ Failed to save due to network error. Check console (CORS, network).");
//   }
// }

//   /* ---------- Render ---------- */
//   if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

//   return (
//     <div className="dashboard-container" style={{ height: "100vh", overflow: "hidden" }}>
//       <div style={{ height: "100vh", background: "#f9fafb", overflow: "hidden", display: "flex" }}>
//         <Sidebar />

//         <main style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden" }}>
//           {/* Back button */}
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <BackButton onClick={() => navigate("/dashboard")} label="Back" style={{ padding: "6px 10px", fontSize: "0.9rem" }} />
//           </div>

//           {/* Heading + Search */}
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 14 }}>
//             <h2 style={{ color: "#222", fontSize: "1.05rem", fontWeight: 600, margin: 0 }}>Project Image Display Order</h2>

//             <div style={{ width: 260 }}>
//               <SearchBar value={searchValue} onChange={setSearchValue} onSubmit={() => setPage(1)} pageLabel="Projects" />
//             </div>
//           </div>

//           {/* Table */}
//           <div style={{ borderRadius: 8, background: "#fff", padding: 10, flex: 1, overflow: "hidden" }}>
//             {loading ? (
//               <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>
//             ) : (
//               <Table
//                 columns={columns}
//                 data={filteredData} // pass filtered dataset so dropdowns reflect active filters
//                 paginatedData={paginatedData}
//                 filters={filters}
//                 openFilter={openFilter}
//                 toggleFilter={toggleFilter}
//                 handleCheckboxChange={handleCheckboxChange}
//                 uniqueValues={uniqueValues}
//                 clearFilter={clearFilter}
//                 hasActiveFilter={hasActiveFilter}
//                 page={page}
//                 setPage={setPage}
//                 rowsPerPage={rowsPerPage}
//                 totalCount={filteredData.length}
//                 rowKey={(row, idx) => row.id ?? row.ProjectID ?? `row-${idx}`}
//               />
//             )}
//           </div>
//         </main>

//         {/* Modal */}
//         {showModal && selectedRow && (
//           <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1200, display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <div
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 background: "#fff",
//                 padding: 20,
//                 borderRadius: 12,
//                 width: editableImages.length <= 3 ? Math.max(editableImages.length * 150, 360) : "90%",
//                 maxWidth: "1200px",
//                 maxHeight: "88vh",
//                 overflowY: editableImages.length > 6 ? "auto" : "hidden",
//                 boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
//                 position: "relative",
//               }}
//             >
//               <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 10, right: 10, background: "transparent", border: "none", cursor: "pointer" }} title="Close">
//                 <X size={20} color="#222" />
//               </button>

//               <h3 style={{ marginBottom: 10 }}>{selectedRow.ProjectName}</h3>

//               <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//                 <SortableContext items={editableImages.map((i) => String(i.sortableId))} strategy={rectSortingStrategy}>
//                   <div style={{ display: "grid", gap: 12, gridTemplateColumns: editableImages.length === 1 ? "1fr" : `repeat(auto-fit, minmax(140px, 1fr))`, justifyItems: "center" }}>
//                     {editableImages.map((imgObj, idx) => (
//                       <SortableImage key={String(imgObj.sortableId)} img={imgObj} id={String(imgObj.sortableId)} index={idx} total={editableImages.length} />
//                     ))}
//                   </div>
//                 </SortableContext>
//               </DndContext>

//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
//                 <div style={{ color: "#666", fontSize: 13 }}>
//                   {modified ? "You have unsaved changes." : "Drag images to reorder, then click Save."}
//                 </div>
//                 <div>
//                   <button onClick={() => { setShowModal(false); setEditableImages([]); }} style={{ marginRight: 8, background: "#fff", border: "1px solid #e6eef8", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     disabled={!modified}
//                     style={{
//                       background: modified ? "#111" : "#d1d5db",
//                       color: "#fff",
//                       padding: "7px 14px",
//                       borderRadius: 8,
//                       border: "none",
//                       fontWeight: 600,
//                       cursor: modified ? "pointer" : "not-allowed",
//                     }}
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/Orderimages/Orderimages.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import Table from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import BackButton from "../../Utils/Backbutton.jsx";

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

/* ---------- Sortable Image Card (compact) ---------- */
function SortableImage({ img, id, index, total }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
    cursor: "grab",
  };

  const isSingle = total === 1;
  const cardWidth = isSingle ? 300 : 150;
  const imgHeight = isSingle ? 180 : 110;
  const orderNumber = img.DisplayOrderID != null ? img.DisplayOrderID : index + 1;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        borderRadius: 10,
        padding: 8,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        width: cardWidth,
        ...style,
      }}
    >
      <img
        src={img.ImageUrl}
        alt={`Project image ${orderNumber}`}
        style={{ width: "100%", height: imgHeight, objectFit: "cover", borderRadius: 8 }}
      />
      <span style={{ marginTop: 6, fontSize: "0.85em", color: "#333", fontWeight: 600 }}>
        Order ID: {orderNumber}
      </span>
    </div>
  );
}

/* ---------- Local storage helpers ---------- */
const localKeyForProject = (projectId) => `order_${String(projectId)}`;

function applyLocalOrder(projectId, images = []) {
  try {
    const raw = localStorage.getItem(localKeyForProject(projectId));
    if (!raw) {
      return images.slice().sort((a, b) => (a.DisplayOrderID ?? 0) - (b.DisplayOrderID ?? 0));
    }
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length === 0) return images;
    const map = new Map();
    for (const s of saved) {
      if (s.ImageID) map.set(String(s.ImageID), Number(s.DisplayOrderID));
      else if (s.ImageUrl) map.set(String(s.ImageUrl), Number(s.DisplayOrderID));
    }
    const assigned = images.map((img, idx) => {
      const key = img.ImageID ? String(img.ImageID) : String(img.ImageUrl);
      const savedOrder = map.has(key) ? map.get(key) : img.DisplayOrderID ?? idx + 1;
      return { ...img, DisplayOrderID: Number(savedOrder) };
    });
    assigned.sort((a, b) => (a.DisplayOrderID ?? 0) - (b.DisplayOrderID ?? 0));
    return assigned;
  } catch (e) {
    console.warn("applyLocalOrder parse error", e);
    return images.slice().sort((a, b) => (a.DisplayOrderID ?? 0) - (b.DisplayOrderID ?? 0));
  }
}

/* ---------- Main Component ---------- */
export default function OrderImages() {
  const { fetchData, postData } = useApi();
  const navigate = useNavigate();

  const [data, setData] = useState([]); // grouped full dataset
  const [filteredData, setFilteredData] = useState([]); // after filters/search
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editableImages, setEditableImages] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modified, setModified] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  // apply current filters/search to dataset
  const applyFiltersTo = (dataset) => {
    let result = Array.isArray(dataset) ? [...dataset] : [];
    Object.keys(filters).forEach((k) => {
      const sel = filters[k];
      if (sel && sel.length > 0 && !sel.includes("All")) {
        result = result.filter((r) => sel.includes(r[k]));
      }
    });
    if (searchValue && searchValue.trim()) {
      const q = searchValue.toLowerCase();
      result = result.filter((r) =>
        ["ProjectID", "ProjectName", "Locality", "City", "Zipcode"].some((k) =>
          r[k] ? String(r[k]).toLowerCase().includes(q) : false
        )
      );
    }
    return result;
  };

  /* ---------- Fetch and group data ---------- */
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const result = await fetchData("OrderImage");
        const grouped = {};
        (result || []).forEach((img) => {
          const pid = img.ProjectID ?? "__unknown__";
          if (!grouped[pid]) {
            grouped[pid] = {
              id: pid,
              ProjectID: pid,
              ProjectName: img.ProjectName,
              Locality: img.Locality,
              City: img.City,
              Zipcode: img.Zipcode,
              images: [],
            };
          }
          grouped[pid].images.push(img);
        });
        // apply local order if present for each project
        const arr = Object.values(grouped).map((g) => ({ ...g, images: applyLocalOrder(g.ProjectID, g.images) }));
        if (!mounted) return;
        setData(arr);
        setFilteredData(arr);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Error loading images");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [fetchData]);

  /* ---------- Filter & Search (derive filteredData) ---------- */
  useEffect(() => {
    const result = applyFiltersTo(data);
    setFilteredData(result);
    setPage(1);
  }, [filters, data, searchValue]); // eslint-disable-line

  /* ---------- Table columns ---------- */
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
            const sortedImgs = (row.images || [])
              .slice()
              .sort((a, b) => (a.DisplayOrderID || 0) - (b.DisplayOrderID || 0))
              .map((img, idx) => ({
                ...img,
                // stable sortableId: prefer ImageID, else include project id for stability
                sortableId: img.ImageID ? String(img.ImageID) : `temp-${row.ProjectID}-${idx}`,
                DisplayOrderID: img.DisplayOrderID ?? idx + 1,
              }));
            setSelectedRow(row);
            setEditableImages(sortedImgs);
            setShowModal(true);
            setModified(false);
          }}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
          title="View Images"
        >
          <Eye size={16} color="#111" />
        </button>
      ),
    },
  ];

  /* ---------- Pagination helper ---------- */
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]); // eslint-disable-line

  /* ---------- Filter helpers ---------- */
  const toggleFilter = (key) => setOpenFilter((p) => (p === key ? null : key));
  const handleCheckboxChange = (key, value) =>
    setFilters((p) => {
      const cur = p[key] || [];
      return cur.includes(value) ? { ...p, [key]: cur.filter((x) => x !== value) } : { ...p, [key]: [...cur, value] };
    });

  // produce dropdown values from currently filteredData (so other columns show options constrained by active filters)
  const uniqueValues = (key) => Array.from(new Set((filteredData || []).map((d) => d[key]).filter(Boolean)));

  const clearFilter = (key) =>
    setFilters((p) => {
      const c = { ...p };
      delete c[key];
      return c;
    });

  const hasActiveFilter = (key) => Array.isArray(filters[key]) && filters[key].length > 0;

  /* ---------- Drag end ---------- */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = editableImages.findIndex((i) => String(i.sortableId) === String(active.id));
    const newIdx = editableImages.findIndex((i) => String(i.sortableId) === String(over.id));
    if (oldIdx === -1 || newIdx === -1) return;

    const newArr = arrayMove(editableImages, oldIdx, newIdx).map((img, idx) => ({ ...img, DisplayOrderID: idx + 1 }));
    setEditableImages(newArr);
    setModified(true);
  };

  /* ---------- Save updated order: try server then fallback to local ---------- */
  async function handleSave() {
    if (!editableImages || editableImages.length === 0) {
      alert("Nothing to save");
      return;
    }
    setSaving(true);

    const payload = editableImages.map((img) => ({
      ImageID: img.ImageID ?? null,
      ProjectID: img.ProjectID ?? selectedRow?.ProjectID ?? null,
      ImageUrl: img.ImageUrl ?? "",
      DisplayOrderID: Number(img.DisplayOrderID ?? 0),
    }));

    const projectId = selectedRow?.ProjectID ?? "__unknown__";

    // helper to update UI state with newly saved order (both data & filteredData)
    const applyToState = (projId, orderedArr) => {
      setData((prev) =>
        prev.map((proj) => {
          if (String(proj.ProjectID) !== String(projId)) return proj;
          return { ...proj, images: orderedArr.slice() };
        })
      );
      setFilteredData((prev) =>
        prev.map((proj) => {
          if (String(proj.ProjectID) !== String(projId)) return proj;
          return { ...proj, images: orderedArr.slice() };
        })
      );
    };

    // 1) If useApi.postData exists, try using it (best effort)
    if (typeof postData === "function") {
      try {
        // some backends expect action path + payload; adapt if your postData expects other args.
        // If your postData is (path, body) use the same here:
        const tryResp = await postData("OrderImage/UpdateOrder", payload);
        // If postData returns an object indicating success, assume ok. Adjust as needed.
        if (tryResp && (tryResp.success || tryResp.status === 200 || tryResp.ok || tryResp === true)) {
          // refresh dataset from server if possible
          try {
            const refreshed = await fetchData("OrderImage");
            const grouped = {};
            (refreshed || []).forEach((img) => {
              const pid = img.ProjectID ?? "__unknown__";
              if (!grouped[pid]) {
                grouped[pid] = {
                  id: pid,
                  ProjectID: pid,
                  ProjectName: img.ProjectName,
                  Locality: img.Locality,
                  City: img.City,
                  Zipcode: img.Zipcode,
                  images: [],
                };
              }
              grouped[pid].images.push(img);
            });
            const arr = Object.values(grouped).map((g) => ({ ...g, images: applyLocalOrder(g.ProjectID, g.images) }));
            setData(arr);
            setFilteredData(arr);
          } catch (rerr) {
            // fallback: apply local payload ordering to UI
            const ordered = payload.slice().sort((a, b) => a.DisplayOrderID - b.DisplayOrderID);
            applyToState(projectId, ordered);
          }

          // also save local copy to persist
          localStorage.setItem(localKeyForProject(projectId), JSON.stringify(payload));
          setModified(false);
          setShowModal(false);
          alert("✅ Image order saved to server.");
          setSaving(false);
          return;
        }
        // otherwise fall through to try fetch-based call
      } catch (err) {
        console.warn("postData attempt failed:", err);
        // continue to attempt fetch-based POST / local fallback
      }
    }

    // 2) Try direct POST to canonical API wrapper URL (the one you used in logs)
    const apiUrl = "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data";
    // server wrapper commonly used in your project:
    const bodyVariants = [
      { action: "OrderImage/UpdateOrder", data: payload }, // data as array
      { action: "OrderImage/UpdateOrder", data: JSON.stringify(payload) }, // data as string
      { action: "OrderImage/UpdateOrder", data: { records: payload } }, // alternative wrap
    ];

    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    const headers = { "Content-Type": "application/json; charset=utf-8", Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    let serverOk = false;
    for (const b of bodyVariants) {
      try {
        console.log("OrderImages: trying POST", apiUrl, b);
        const resp = await fetch(apiUrl, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers,
          body: JSON.stringify(b),
        });
        const txt = await resp.text();
        let parsed = txt;
        try {
          parsed = txt ? JSON.parse(txt) : txt;
        } catch (e) {
          // keep raw
        }
        console.log("OrderImages: response", resp.status, parsed);
        if (resp.ok) {
          serverOk = true;
          break;
        } else {
          // continue trying other shapes
          console.warn("OrderImages: non-ok response, trying next shape", resp.status, parsed);
        }
      } catch (err) {
        console.warn("OrderImages: fetch attempt failed", err);
      }
    }

    if (serverOk) {
      // server accepted one of the shapes; persist local copy and refresh from server if possible
      try {
        localStorage.setItem(localKeyForProject(projectId), JSON.stringify(payload));
      } catch (e) {
        console.warn("Failed to write localStorage backup", e);
      }
      try {
        const refreshed = await fetchData("OrderImage");
        const grouped = {};
        (refreshed || []).forEach((img) => {
          const pid = img.ProjectID ?? "__unknown__";
          if (!grouped[pid]) {
            grouped[pid] = {
              id: pid,
              ProjectID: pid,
              ProjectName: img.ProjectName,
              Locality: img.Locality,
              City: img.City,
              Zipcode: img.Zipcode,
              images: [],
            };
          }
          grouped[pid].images.push(img);
        });
        const arr = Object.values(grouped).map((g) => ({ ...g, images: applyLocalOrder(g.ProjectID, g.images) }));
        setData(arr);
        setFilteredData(arr);
      } catch (rerr) {
        // fallback: apply payload locally
        const ordered = payload.slice().sort((a, b) => a.DisplayOrderID - b.DisplayOrderID);
        applyToState(projectId, ordered);
      }
      setModified(false);
      setShowModal(false);
      setSaving(false);
      alert("✅ Image order saved to server.");
      return;
    }

    // 3) All server attempts failed — save it locally and update UI immediately
    try {
      localStorage.setItem(localKeyForProject(projectId), JSON.stringify(payload));
      const ordered = payload.slice().sort((a, b) => a.DisplayOrderID - b.DisplayOrderID);
      applyToState(projectId, ordered);
      setModified(false);
      setShowModal(false);
      setSaving(false);
      alert("order saved locally. It will persist in this browser.");
      console.warn("OrderImages: All server attempts failed; saved locally under", localKeyForProject(projectId));
    } catch (err) {
      console.error("OrderImages: final fallback save to localStorage failed", err);
      setSaving(false);
      alert("❌ Failed to save (server & local failed). See console.");
    }
  }

  /* ---------- Render ---------- */
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

  return (
    <div className="dashboard-container" style={{ height: "100vh", overflow: "hidden" }}>
      <div style={{ height: "100vh", background: "#f9fafb", overflow: "hidden", display: "flex" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden" }}>
          {/* Back button */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BackButton onClick={() => navigate("/dashboard")} label="Back" style={{ padding: "6px 10px", fontSize: "0.9rem" }} />
          </div>

          {/* Heading + Search */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 14 }}>
            <h2 style={{ color: "#222", fontSize: "1.05rem", fontWeight: 600, margin: 0 }}>Project Image Display Order</h2>

            <div style={{ width: 260 }}>
              <SearchBar value={searchValue} onChange={setSearchValue} onSubmit={() => setPage(1)} pageLabel="Projects" />
            </div>
          </div>

          {/* Table */}
          <div style={{ borderRadius: 8, background: "#fff", padding: 10, flex: 1, overflow: "hidden" }}>
            {loading ? (
              <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>
            ) : (
              <Table
                columns={columns}
                data={filteredData} // pass filtered dataset so dropdowns reflect active filters
                paginatedData={paginatedData}
                filters={filters}
                openFilter={openFilter}
                toggleFilter={toggleFilter}
                handleCheckboxChange={handleCheckboxChange}
                uniqueValues={uniqueValues}
                clearFilter={clearFilter}
                hasActiveFilter={hasActiveFilter}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                totalCount={filteredData.length}
                rowKey={(row, idx) => row.id ?? row.ProjectID ?? `row-${idx}`}
              />
            )}
          </div>
        </main>

        {/* Modal */}
        {showModal && selectedRow && (
          <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1200, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                width: editableImages.length <= 3 ? Math.max(editableImages.length * 150, 360) : "90%",
                maxWidth: "1200px",
                maxHeight: "88vh",
                overflowY: editableImages.length > 6 ? "auto" : "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                position: "relative",
              }}
            >
              <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 10, right: 10, background: "transparent", border: "none", cursor: "pointer" }} title="Close">
                <X size={20} color="#222" />
              </button>

              <h3 style={{ marginBottom: 10 }}>{selectedRow.ProjectName}</h3>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={editableImages.map((i) => String(i.sortableId))} strategy={rectSortingStrategy}>
                  <div style={{ display: "grid", gap: 12, gridTemplateColumns: editableImages.length === 1 ? "1fr" : `repeat(auto-fit, minmax(140px, 1fr))`, justifyItems: "center" }}>
                    {editableImages.map((imgObj, idx) => (
                      <SortableImage key={String(imgObj.sortableId)} img={imgObj} id={String(imgObj.sortableId)} index={idx} total={editableImages.length} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <div style={{ color: "#666", fontSize: 13 }}>
                  {modified ? "You have unsaved changes." : "Drag images to reorder, then click Save."}
                </div>
                <div>
                  <button onClick={() => { setShowModal(false); setEditableImages([]); }} style={{ marginRight: 8, background: "#fff", border: "1px solid #e6eef8", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!modified || saving}
                    style={{
                      background: modified ? "#111" : "#d1d5db",
                      color: "#fff",
                      padding: "7px 14px",
                      borderRadius: 8,
                      border: "none",
                      fontWeight: 600,
                      cursor: modified ? "pointer" : "not-allowed",
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
