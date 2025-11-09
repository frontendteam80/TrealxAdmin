 // src/pages/Approval/Approval.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import DataTable, { Pagination } from "../../Utils/Table.jsx";
import { Eye } from "lucide-react";

const show = (val) => (val === null || val === undefined || val === "" ? "-" : val);

/* ---------- helper: normalize image field into array ---------- */
function parseImageList(raw) {
  if (raw === null || raw === undefined) return [];
  const str = String(raw).trim();
  if (!str) return [];
  // Try JSON parse (["a","b"])
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      return parsed.map((u) => String(u).replace(/["']/g, "").trim()).filter(Boolean);
    }
  } catch (e) {
    // ignore
  }
  // Remove surrounding brackets and quotes then split on comma
  const cleaned = str.replace(/^\[|\]$/g, "").replace(/["']/g, "").trim();
  if (!cleaned) return [];
  return cleaned
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ---------- helper: format date to dd-mm-yyyy (robust) ---------- */
function formatDate(val) {
  if (!val) return "-";
  // try Date parse
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
  // fallback: try to extract numbers from string
  const m = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return String(val);
}

export default function Approval() {
  const { fetchData } = useApi();
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

  // gallery modal states
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Fetch and prepare data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetchData("ApprovalData");
        const arr = Array.isArray(response) ? response : response?.data || [];

        // ---------- GROUP only Rajapushpa Green Dale ----------
        const projectKey = "Rajapushpa Green Dale";
        const repList = arr.filter((r) => r.ProjectName === projectKey);
        const others = arr.filter((r) => r.ProjectName !== projectKey);

        let grouped = [];
        if (repList.length > 0) {
          const representative = { ...repList[0] }; // keep first row's fields
          const allImgs = repList.flatMap((r) => parseImageList(r.ImageUrl));
          // dedupe while preserving order
          const seen = new Set();
          const deduped = [];
          for (const u of allImgs) {
            if (!u) continue;
            if (!seen.has(u)) {
              seen.add(u);
              deduped.push(u);
            }
          }
          representative.ImageUrlList = deduped;
          // Representative's ImageUrl (preview) — keep as first deduped or existing ImageUrl
          representative.ImageUrl = deduped[0] || representative.ImageUrl || "";
          grouped.push(representative);
        }

        // For other rows, attach normalized ImageUrlList (single or multiple if present)
        const normalizedOthers = others.map((r) => {
          const copy = { ...r };
          const imgs = parseImageList(r.ImageUrl);
          copy.ImageUrlList = imgs.length > 0 ? imgs : (r.ImageUrl ? [String(r.ImageUrl).trim()] : []);
          // ensure ImageUrl (preview) exists for consistency
          copy.ImageUrl = copy.ImageUrlList[0] || copy.ImageUrl || "";
          return copy;
        });

        const finalList = [...grouped, ...normalizedOthers];

        setData(finalList);
        setFilteredData(finalList);
      } catch (err) {
        setError(err?.message || "Failed to fetch approval data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchData]);

  // Apply column filters (same as before)
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

  // Table columns (unchanged except action shows Eye icon)
  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "Property Name", key: "PropertyName" },
    { label: "Name", key: "FullName" },
    { label: "Project Name", key: "ProjectName" },
    { label: "Phone Number", key: "PhoneNumber" },
    { label: "Property Type", key: "PropertyType" },
    { label: "Amount", key: "Amount" },
    { label: "Status", key: "verificationStatus" },
    { label: "Added By", key: "AddedBy" },
    {
      label: "Action",
      key: "action",
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRow(row);
          }}
          title="View details"
          style={{
            background: "transparent",
            color: "#121212",
            border: "none",
            padding: 6,
            borderRadius: 6,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="View details"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  const mainKeys = columns.map((c) => c.key);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

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

  const clearFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: [] }));
    setOpenFilter(null);
  };

  const applyFilter = () => setOpenFilter(null);
  const uniqueValues = (key) =>
    Array.from(new Set(data.map((d) => d[key]).filter(Boolean)));

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Exclude ImageUrl and ImageUrlList and sqft from extra details in slide panel
  const extraDetails = selectedRow
    ? Object.entries(selectedRow).filter(
        ([key, value]) =>
          !mainKeys.includes(key) &&
          key !== "ImageUrl" &&
          key !== "ImageUrlList" &&
          // remove sqft column (any case)
          String(key).toLowerCase() !== "sqft" &&
          value !== null &&
          value !== undefined
      )
    : [];

  // Spinner unchanged
  const Spinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
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
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  // Open gallery modal: receive an array of image URLs and optionally start index
  const openGalleryFor = (images = [], startIndex = 0) => {
    setGalleryImages(images || []);
    setGalleryIndex(Math.max(0, startIndex || 0));
    setShowGallery(true);
  };

  // navigate index safely
  const prevImage = () => setGalleryIndex((i) => Math.max(0, i - 1));
  const nextImage = () => setGalleryIndex((i) => Math.min(galleryImages.length - 1, i + 1));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20, marginLeft: "180px" }}>
        {/* Back */}
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
            marginBottom: 10,
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
          Waiting For Approval
        </h2>

        <h2 style={{ marginBottom: 20, color: "#222",fontweight:400 }}>Waiting For Approval</h2>


        {loading ? (
          <Spinner />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <DataTable
              columns={columns}
              data={data}
              paginatedData={paginatedData}
              openFilter={openFilter}
              toggleFilter={toggleFilter}
              filters={filters}
              handleCheckboxChange={handleCheckboxChange}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              uniqueValues={uniqueValues}
              clearFilter={clearFilter}
              applyFilter={applyFilter}
              onRowClick={setSelectedRow}
            />

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        )}

        {/* Slide panel: shows fields not present in main table (extraDetails) + approve/reject/pending UI */}
        {selectedRow && (
          <>
            <div
              onClick={() => setSelectedRow(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
                zIndex: 998,
              }}
            />

            <div
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "420px",
                height: "100%",
                background: "#fff",
                zIndex: 999,
                padding: 20,
                overflowY: "auto",
                boxShadow: "-2px 0 12px rgba(0,0,0,0.15)",
                transform: "translateX(0)",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <style>
                {`
                  @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                  }
                `}
              </style>

              {/* Close icon for slide panel */}
              <button
                onClick={() => setSelectedRow(null)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 18,
                }}
                aria-label="Close"
              >
                ×
              </button>

              {/* IMAGE PREVIEW (single) */}
              {(selectedRow.ImageUrlList && selectedRow.ImageUrlList.length > 0) || selectedRow.ImageUrl ? (
                <div style={{ marginBottom: 16, marginTop: 12 }}>
                  <img
                    src={
                      (selectedRow.ImageUrlList && selectedRow.ImageUrlList.length > 0)
                        ? selectedRow.ImageUrlList[0]
                        : String(selectedRow.ImageUrl || "").replace(/[\[\]"']/g, "")
                    }
                    alt={selectedRow.PropertyName || "Image"}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      // open gallery with all images for this project (if grouped) or just the single image
                      const imgs =
                        (selectedRow.ImageUrlList && selectedRow.ImageUrlList.length > 0)
                          ? selectedRow.ImageUrlList
                          : parseImageList(selectedRow.ImageUrl);
                      openGalleryFor(imgs, 0);
                    }}
                  />
                </div>
              ) : null}

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 12,
                  fontSize: "1.1rem",
                  color: "#121212",
                }}
              >
                {selectedRow.PropertyName ? selectedRow.PropertyName : "Property Details"}
              </h3>

              <div style={{ marginBottom: 12 }}>
                <div><strong>Name:</strong> {show(selectedRow.FullName)}</div>
                <div><strong>Project:</strong> {show(selectedRow.ProjectName)}</div>
                <div><strong>Phone:</strong> {show(selectedRow.PhoneNumber)}</div>
                <div><strong>Type:</strong> {show(selectedRow.PropertyType)}</div>
                <div><strong>Status:</strong> {show(selectedRow.verificationStatus)}</div>
              </div>

              {/* Extra table for other fields (fields not present in main table) */}
              <div style={{ marginTop: 12 }}>
                <h4 style={{ marginBottom: 8 }}>More details</h4>
                {extraDetails.length === 0 ? (
                  <p style={{ color: "#666" }}>No additional details available.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {extraDetails.map(([key, val]) => {
                        // rename keys and format date fields
                        let label = key;
                        let valueToShow = val;
                        if (key === "PropertyListingDate") {
                          label = "ListingDate";
                          valueToShow = formatDate(val);
                        } else if (key === "PropertyAddedAt") {
                          label = "AddedAt";
                          valueToShow = formatDate(val);
                        } else if (key === "PropertyFeatures" || key === "propertyFeatures") {
                          label = "Features";
                        }
                        return (
                          <tr key={key}>
                            <td
                              style={{
                                fontWeight: 600,
                                padding: "6px 8px",
                                borderBottom: "1px solid #eee",
                                textTransform: "capitalize",
                                width: "40%",
                              }}
                            >
                              {label}
                            </td>
                            <td
                              style={{
                                padding: "6px 8px",
                                borderBottom: "1px solid #eee",
                                width: "60%",
                              }}
                            >
                              {String(valueToShow ?? "-")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Approve / Reject / Pending */}
              <div style={{ marginTop: 18, paddingBottom: 60 /* leave space for sticky buttons */ }}>
                <div style={{ marginBottom: 8, fontWeight: 700 }}>Approval / Rejection Notes</div>
                <ApprovalControls
                  currentRow={selectedRow}
                  saveLocal={(uid, payload) => {
                    try {
                      const raw = localStorage.getItem("approvalComments");
                      const map = raw ? JSON.parse(raw) : {};
                      map[uid] = payload;
                      localStorage.setItem("approvalComments", JSON.stringify(map));
                      alert("Saved locally");
                    } catch {
                      alert("Could not save locally");
                    }
                  }}
                />
              </div>

              <div style={{ position: "sticky", bottom: 16, left: 0, background: "transparent", paddingTop: 8 }}>
                {/* spacer for bottom */}
              </div>
            </div>
          </>
        )}

        {/* ---------- IMAGE GALLERY MODAL ---------- */}
        {showGallery && galleryImages && galleryImages.length > 0 && (
          <div
            onClick={() => setShowGallery(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "80%", maxHeight: "85%" }}>
              {/* Close icon */}
              <div
                onClick={() => setShowGallery(false)}
                style={{
                  position: "absolute",
                  right: -10,
                  top: -50,
                  fontSize: 26,
                  color: "#fff",
                  cursor: "pointer",
                }}
                aria-label="Close gallery"
              >
                ✖
              </div>

              {/* Prev */}
              {galleryIndex > 0 && (
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    left: -50,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 32,
                    color: "#fff",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ‹
                </button>
              )}

              {/* Image */}
              <img
                src={galleryImages[galleryIndex]}
                alt={`img-${galleryIndex}`}
                style={{ width: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: 8 }}
              />

              {/* Next */}
              {galleryIndex < galleryImages.length - 1 && (
                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    right: -50,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 32,
                    color: "#fff",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ›
                </button>
              )}

              {/* thumbnails strip (optional) */}
              {galleryImages.length > 1 && (
                <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto" }}>
                  {galleryImages.map((u, idx) => (
                    <img
                      key={idx}
                      src={u}
                      onClick={() => setGalleryIndex(idx)}
                      style={{
                        width: 80,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6,
                        cursor: "pointer",
                        outline: idx === galleryIndex ? "3px solid #fff" : "none",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ApprovalControls component: small self-contained approve/reject/pending UI (kept inside same file)
 * - Shows radio options and textarea, and calls saveLocal(uid, payload)
 * - CHANGES:
 *    • initial status = "" (no default "Pending")
 *    • textarea shown only when a status is selected
 *    • Save / Reset buttons visible (left-aligned)
 */
function ApprovalControls({ currentRow, saveLocal }) {
  const uid =
    currentRow?.UserID ?? currentRow?.UserId ?? currentRow?.PropertyID ?? "unknown";
  // don't default to currentRow.verificationStatus to avoid showing comment box by default
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  useEffectOnceOnMount(uid, setStatus, setReason);

  const onSave = () => {
    const payload = { status: status || "", reason: reason || "", savedAt: new Date().toISOString() };
    saveLocal(uid, payload);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        {["Approved", "Rejected", "Pending"].map((opt) => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="radio" name={`status_${uid}`} value={opt} checked={status === opt} onChange={() => setStatus(opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      {/* textarea appears only when a status is selected */}
      {status && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: "0.95rem", marginBottom: 6, fontWeight: 600 }}>
            {status === "Approved" ? "Reason for Approval" : status === "Rejected" ? "Reason for Rejection" : "Remarks for Pending"}
          </div>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter your comments here..." rows={4} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", resize: "vertical", fontSize: "0.95rem" }} />
        </div>
      )}

      {/* Save & Reset always visible and left-aligned */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onSave} style={{ background: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>
          Save Note
        </button>
        <button onClick={() => { setStatus(""); setReason(""); }} style={{ background: "#fff", color: "#333", border: "1px solid #ddd", padding: "8px 12px", borderRadius: 6 }}>
          Reset
        </button>
      </div>
    </div>
  );
}

/** small helper to initialize approval controls from localStorage if present */
function useEffectOnceOnMount(uid, setStatus, setReason) {
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("approvalComments");
      const map = raw ? JSON.parse(raw) : {};
      if (map && map[uid]) {
        // restore previous saved state if exists; otherwise keep blank (no default)
        setStatus(map[uid].status || "");
        setReason(map[uid].reason || "");
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);
}
