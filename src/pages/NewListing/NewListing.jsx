 // src/pages/NewListings/NewListings.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table, { Pagination } from "../../Utils/Table.jsx"; // your table component
import { useApi } from "../../API/Api.js";
import { Eye } from "lucide-react";

export default function NewListings() {
  const { fetchData } = useApi();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null); // for detail slide panel
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch data on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const res = await fetchData("PropertyAdded");
        if (!mounted) return;
        setData(res || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (!mounted) return;
        setError(err?.message || "Failed to load data");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [fetchData]);

  // Open detail panel
  const handleView = (row) => {
    setSelectedRow(row);
  };

  const handleClosePanel = () => {
    setSelectedRow(null);
  };

  // Table columns including Eye icon action
  const columns = [
    { label: "S.No", key: "sno", render: (_, __, idx) => idx + 1 },
    { label: "Property ID", key: "propertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Property Type", key: "PropertyType" },
    { label: "Property Status", key: "PropertyStatus" },
    {
      label: "Area",
      key: "PropertyArea",
      render: (val) => (val ? `${val} SqFt` : "–"),
    },
    {
      label: "Amount",
      key: "Amount",
      render: (val) => (val ? `${val} Cr` : "–"),
    },
    { label: "City", key: "PropertyCity" },
    { label: "State", key: "PropertyState" },
    {
      label: "View",
      key: "view",
      canFilter: false,
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleView(row);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleView(row);
            }
          }}
          title="View details"
          aria-label={`View details for ${row.PropertyName || row.propertyID || "item"}`}
          style={{
            background: "transparent",
            border: "none",
            padding: 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: 6,
            color: "#111",
          }}
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  // Paginate
  const paginatedData = React.useMemo(() => {
    const startIdx = (page - 1) * rowsPerPage;
    return data.slice(startIdx, startIdx + rowsPerPage);
  }, [data, page]);

  const totalPages = Math.max(1, Math.ceil((data?.length || 0) / rowsPerPage));

  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "24px", minHeight: "100vh", overflowX: "auto", position: "relative" }}>
        {/* Back Button */}
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            style={{
              background: "#fff",
              color: "#121212",
              border: "none",
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              transition: "background 0.3s ease",
            }}
          >
            Back
          </button>
        </div>

        {/* Heading */}
        <h2 style={{ marginBottom: 14, color: "#222", fontSize: "1.05rem", fontWeight: "600" }}>New Listings</h2>

        {/* Data Table */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <Table columns={columns} paginatedData={paginatedData} rowsPerPage={rowsPerPage} onRowClick={null} />
        )}

        <Pagination page={page} setPage={setPage} totalPages={totalPages} />

        {/* Slide-over Panel for Property Details */}
        {selectedRow && (
          <>
            {/* Overlay */}
            <div
              onClick={handleClosePanel}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.3)",
                zIndex: 998,
              }}
            />
            {/* Details Sidebar */}
            <div
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "380px",
                height: "100%",
                backgroundColor: "#fff",
                boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
                padding: "20px",
                overflowY: "auto",
                zIndex: 999,
                transition: "transform 0.4s ease",
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleClosePanel}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#333",
                  position: "absolute",
                  top: 10,
                  right: 20,
                }}
                aria-label="Close details"
              >
                ✕
              </button>

              {/* Property Details Content */}
              <h3 style={{ marginTop: 40, marginBottom: 20 }}>Property Details</h3>
              <div style={{ lineHeight: "1.8" }}>
                <p>
                  <strong>Country Code:</strong> {selectedRow.PropertyCountryCode ?? "–"}
                </p>
                <p>
                  <strong>Zip Code:</strong> {selectedRow.PropertyZipCode ?? "–"}
                </p>
                <p>
                  <strong>Property Type ID:</strong> {selectedRow.PropertyTypeID ?? "–"}
                </p>
                <p>
                  <strong>Property Added At:</strong> {selectedRow.PropertyAddedAt ?? "–"}
                </p>
                <p>
                  <strong>Property Listing Date:</strong> {selectedRow.PropertyListingDate ?? "–"}
                </p>
                <p>
                  <strong>Added This Week:</strong> {selectedRow.PropertyAddedThisWeek ?? "–"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
