 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import Table from "../../Utils/Table.jsx";
import { useApi } from "../../API/Api.js";

const show = (val) => (val === null || val === undefined || val === "" ? "-" : val);

const parseImages = (imgField) => {
  if (!imgField) return [];
  if (Array.isArray(imgField)) return imgField.filter(Boolean);
  if (typeof imgField === "string") {
    try {
      const parsed = JSON.parse(imgField);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
    return imgField.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

export default function AwaitingApproval() {
  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [commentsMap, setCommentsMap] = useState(() => {
    try {
      const raw = localStorage.getItem("approvalComments");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData("ApprovalData");
        if (!cancelled) setApprovals(data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Error loading approval data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  const projectNameToGroup = "Rajapushpa Green Dale";
  const mainTableData = [];

  const rajRows = approvals.filter(
    (a) => (a.ProjectName ?? a.propertyName ?? "-") === projectNameToGroup
  );
  if (rajRows.length) {
    const allImages = rajRows.flatMap((row) => parseImages(row.ImageUrl || row.imageUrl));
    mainTableData.push({
      ...rajRows[0],
      allProjectImages: Array.from(new Set(allImages)),
      PhoneNumber: rajRows[0].PhoneNumber,
    });
  }
  approvals.forEach((item) => {
    const name = item.ProjectName ?? item.propertyName ?? "-";
    if (name !== projectNameToGroup) mainTableData.push(item);
  });

  const handleView = (item) => setSelectedItem(item);
  const closePanel = () => setSelectedItem(null);

  const openGallerySlidePanel = (item) => {
    if (item.ProjectName === projectNameToGroup && item.allProjectImages?.length) {
      setGalleryImages(item.allProjectImages);
    } else {
      setGalleryImages(parseImages(item.ImageUrl));
    }
    setGalleryOpen(true);
  };

  const saveCommentFor = (userId, payload) => {
    const next = { ...commentsMap, [userId]: payload };
    setCommentsMap(next);
    try {
      localStorage.setItem("approvalComments", JSON.stringify(next));
    } catch (e) {
      console.warn("Could not persist comments locally", e);
    }
  };

  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "Property Name", key: "PropertyName", render: show },
    { label: "Name", key: "FullName", render: show },
    { label: "Project Name", key: "ProjectName", render: show },
    { label: "Phone Number", key: "PhoneNumber", render: show },
    { label: "Property Type", key: "PropertyType", render: show },
    { label: "Amount", key: "Amount", render: show },
    { label: "Status", key: "verificationStatus", render: show },
    { label: "Added By", key: "AddedBy", render: show },
    {
      label: "Action",
      key: "action",
      render: (_, row) => (
        <button
          style={{
            background: "linear-gradient(90deg,#007bff,#0056b3)",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
          onClick={() => handleView(row)}
        >
          View
        </button>
      ),
    },
  ];

  const rowStyle = (row, i) => ({
    height: 36,
    backgroundColor: i % 2 === 0 ? "#fafafa" : "#fff",
    cursor: "pointer",
    padding: "0 8px",
  });

  // --- ✅ Comment Section with Pending option ---
  function CommentSection({ item }) {
    const uid = item?.UserID ?? item?.UserId ?? item?.PropertyID ?? "unknown";
    const existing = commentsMap[uid] || { status: item?.verificationStatus ?? "", reason: "" };
    const [status, setStatus] = useState(existing.status || "");
    const [reason, setReason] = useState(existing.reason || "");

    useEffect(() => {
      const saved = commentsMap[uid] || { status: item?.verificationStatus ?? "", reason: "" };
      setStatus(saved.status ?? item?.verificationStatus ?? "");
      setReason(saved.reason || "");
    }, [uid, item?.UserID]);

    const onSave = () => {
      const payload = {
        status: status || "",
        reason: reason || "",
        savedAt: new Date().toISOString(),
      };
      saveCommentFor(uid, payload);
      alert("Comment saved locally");
    };

    return (
      <div style={{ marginTop: 18 }}>
        <div style={{ marginBottom: 8, fontWeight: 700 }}>Approval / Rejection Notes</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          {["Approved", "Rejected", "Pending"].map((opt) => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name={`status_${uid}`}
                value={opt}
                checked={status === opt}
                onChange={() => setStatus(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        {(status === "Approved" || status === "Rejected" || status === "Pending") && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: "0.95rem", marginBottom: 6, fontWeight: 600 }}>
              {status === "Approved"
                ? "Reason for Approval"
                : status === "Rejected"
                ? "Reason for Rejection"
                : "Remarks for Pending"}
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your comments here..."
              rows={4}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ddd",
                resize: "vertical",
                fontSize: "0.95rem",
              }}
            />
          </div>
        )}
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            onClick={onSave}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Save Note
          </button>
          <button
            onClick={() => {
              setStatus("");
              setReason("");
            }}
            style={{
              background: "#fff",
              color: "#333",
              border: "1px solid #ddd",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  // --- UI Rendering ---
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: "0 0 190px" }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, padding: 20, background: "#f9f9f9", minWidth: 0 }}>
        {/* Back Button */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "#5259d4",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>

        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Waiting For Approval</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div
            style={{
              width: windowWidth < 900 ? "100%" : "95%",
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            <Table
              columns={columns}
              data={mainTableData}
              rowsPerPage={10}
              rowStyle={rowStyle}
              rowHoverStyle={{ backgroundColor: "#e8f0ff" }}
            />
          </div>
        )}

        {/* Slide Panel */}
        {selectedItem && (
          <>
            <div
              onClick={closePanel}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.35)",
                zIndex: 998,
              }}
            />
            <div
              role="dialog"
              aria-modal="true"
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: windowWidth < 600 ? "100%" : "460px",
                height: "100%",
                background: "#fff",
                zIndex: 999,
                padding: 20,
                overflowY: "auto",
                transform: selectedItem ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.38s ease",
                boxShadow: "-6px 0 20px rgba(0,0,0,0.12)",
              }}
            >
              <button
                onClick={closePanel}
                style={{
                  float: "right",
                  fontSize: 22,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Close panel"
              >
                ✕
              </button>

              {/* Image */}
              {(selectedItem?.allProjectImages?.length ||
                parseImages(selectedItem?.ImageUrl).length) ? (
                <div style={{ marginBottom: 14, textAlign: "center" }}>
                  <img
                    src={
                      selectedItem?.allProjectImages
                        ? selectedItem.allProjectImages[0]
                        : parseImages(selectedItem?.ImageUrl)[0]
                    }
                    alt={selectedItem?.PropertyName ?? "-"}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 8,
                      cursor: "zoom-in",
                    }}
                    onClick={() => openGallerySlidePanel(selectedItem)}
                  />
                  <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                    Click image to open gallery
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 12, color: "#666" }}>No image available</div>
              )}

              <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                {show(selectedItem?.PropertyName)}
              </h3>

              <div style={{ color: "#555", lineHeight: 1.6 }}>
                <div><strong>Name:</strong> {show(selectedItem?.FullName)}</div>
                <div><strong>Location:</strong> {show(selectedItem?.Locality)} {selectedItem?.PropertyCity ? `, ${show(selectedItem?.PropertyCity)}` : ""}</div>
                <div><strong>Property Type:</strong> {show(selectedItem?.PropertyType)}</div>
                <div><strong>Features:</strong> {show(selectedItem?.PropertyFeatures)}</div>
                <div><strong>Company:</strong> {show(selectedItem?.CompanyName)}</div>
                <div><strong>Company ID:</strong> {show(selectedItem?.CompanyID)}</div>
                <div><strong>Phone Number:</strong> {show(selectedItem?.PhoneNumber)}</div>
                <div><strong>Listing Date:</strong> {selectedItem?.propertyListingDate ? new Date(selectedItem.propertyListingDate).toLocaleDateString() : "-"}</div>
                <div><strong>Added At:</strong> {selectedItem?.PropertyAddedAt ? new Date(selectedItem.PropertyAddedAt).toLocaleString() : "-"}</div>
                {selectedItem?.PropertyPossessionStatus && (
                  <div><strong>Possession Status:</strong> {show(selectedItem?.PropertyPossessionStatus)}</div>
                )}
              </div>

              <CommentSection item={selectedItem} />
            </div>
          </>
        )}

        {/* Image Gallery Modal */}
        {galleryOpen && (
          <div
            onClick={() => setGalleryOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.7)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              overflowY: "auto",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: windowWidth < 700 ? "100%" : "85%",
                maxWidth: 1200,
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
                position: "relative",
                padding: 20,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
                justifyItems: "center",
              }}
            >
              <button
                aria-label="close gallery"
                onClick={() => setGalleryOpen(false)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 8,
                  background: "rgba(0,0,0,0.08)",
                  color: "#333",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 8px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
              {galleryImages.length === 0 ? (
                <div style={{ color: "#000", gridColumn: "1 / -1", textAlign: "center" }}>
                  No images found.
                </div>
              ) : (
                galleryImages.map((img, idx) => (
                  <img
                    key={img + idx}
                    src={img}
                    alt={`image-${idx}`}
                    style={{
                      maxHeight: "180px",
                      width: "100%",
                      objectFit: "contain",
                      borderRadius: 6,
                      background: "#fff",
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
