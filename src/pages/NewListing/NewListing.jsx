 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Table from "../../Utils/Table.jsx";
import { useApi } from "../../API/Api.js";

export default function NewListings() {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchData } = useApi();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchData("PropertyAdded");
        setData(res || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchData]);

  const handleView = (row) => setSelectedRow(row);
  const handleClosePanel = () => setSelectedRow(null);

  const handleBack = () => {
    window.location.href = "/dashboard";
  };

  const renderValue = (val) => (val === null || val === "" ? "–" : val);

  const columns = [
    { label: "S.No", key: "sno", render: (_, __, index) => index + 1 },
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
            background: "linear-gradient(90deg, #007bff, #0056b3)",
            color: "#fff",
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

  return (
    <div
      className="dashboard-container"
      style={{
        display: "flex",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "24px",
          minHeight: "100vh",
          overflowX: "auto",
          position: "relative",
        }}
      >
        {/* BACK BUTTON */}
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={handleBack}
            style={{
              background: "linear-gradient(90deg, #007bff, #0056b3)",
              color: "#fff",
              border: "none",
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              transition: "background 0.3s ease",
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
            ← Back
          </button>
        </div>

        {/* PAGE HEADING */}
        <h2 style={{ marginBottom: "20px", color: "#333" }}>New Listings</h2>

        {/* MAIN TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table columns={columns} data={data} rowsPerPage={10} />
        )}

        {/* SLIDE PANEL */}
        {selectedRow && (
          <>
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

              <h3 style={{ marginTop: 40, marginBottom: 20 }}>
                Property Details
              </h3>

              <div style={{ lineHeight: "1.8" }}>
                <p>
                  <strong>Country Code:</strong>{" "}
                  {renderValue(selectedRow.PropertyCountryCode)}
                </p>
                <p>
                  <strong>Zip Code:</strong>{" "}
                  {renderValue(selectedRow.PropertyZipCode)}
                </p>
                <p>
                  <strong>Property Type ID:</strong>{" "}
                  {renderValue(selectedRow.PropertyTypeID)}
                </p>
                <p>
                  <strong>Property Added At:</strong>{" "}
                  {renderValue(selectedRow.PropertyAddedAt)}
                </p>
                <p>
                  <strong>Property Listing Date:</strong>{" "}
                  {renderValue(selectedRow.PropertyListingDate)}
                </p>
                <p>
                  <strong>Added This Week:</strong>{" "}
                  {renderValue(selectedRow.PropertyAddedThisWeek)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
