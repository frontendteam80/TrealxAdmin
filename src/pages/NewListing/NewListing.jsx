 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table,{Pagination} from "../../Utils/Table.jsx"; // your table component
import { useApi } from "../../API/Api.js";
 
export default function NewListings() {
  const { fetchData } = useApi();
 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null); // for detail slide panel
  const [panelOpen, setPanelOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
 
  // Fetch data on load
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchData("PropertyAdded");
        setData(res || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchData]);
 
  // Triggered on clicking "View" button
  const handleView = (row) => {
    setSelectedRow(row);
    setPanelOpen(true);
  };
 
  const handleClosePanel = () => {
    setPanelOpen(false);
    setSelectedRow(null);
  };
 
  // Table columns including the View button
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
      render: (_, row) => (
        <button
          onClick={() => handleView(row)}
          style={{
            background: "#8d8181ff",
            color: "#121212",
            border: "none",
            borderRadius: "6px",
            padding: "6px 14px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(90deg, #0056b3, #007bff)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(90deg, #007bff, #0056b3)";
          }}
        >
          View
        </button>
      ),
    },
  ];
 
  // Table data for pagination
  const paginatedData = React.useMemo(() => {
    const startIdx = (page - 1) * rowsPerPage;
    return data.slice(startIdx, startIdx + rowsPerPage);
  }, [data, page]);
 
  const totalPages = Math.ceil(data.length / rowsPerPage);
 
  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "24px", minHeight: "100vh", overflowX: "auto", position: "relative" ,marginLeft: "180px"}}>
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(90deg, #0056b3, #007bff)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(90deg, #007bff, #0056b3)";
            }}
          >
            Back
          </button>
        </div>
 
        {/* Heading */}
         <h2
          style={{
            marginBottom: 14,
            color: "#222",
            fontSize: "1.05rem",
            fontWeight: "600",
          }}
        >
          New Listings
        </h2>
 
        {/* Data Table */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <Table
            columns={columns}
            paginatedData={paginatedData}
            rowsPerPage={rowsPerPage}
            onRowClick={null} // optional: you could add row click here
          />
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
                display: "block",
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
              >
                ✕
              </button>
 
              {/* Property Details Content */}
              <h3 style={{ marginTop: 40, marginBottom: 20 }}>Property Details</h3>
              <div style={{ lineHeight: "1.8" }}>
                <p>
                  <strong>Country Code:</strong>{" "}
                  {selectedRow.PropertyCountryCode ?? "–"}
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
 
 