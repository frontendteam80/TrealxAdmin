 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table from "../../Utils/Table.jsx";
import formatAmount from "../../Utils/formatAmount.js";

export default function ActiveListings() {
  const { fetchData } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetchData("ActiveListingDataInfo");
        setData(response || []);
      } catch (err) {
        setError(err.message || "Failed to fetch active listings");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchData]);

  const mainKeys = [
    "PropertyID",
    "PropertyName",
    "PropertyType",
    "PropertyStatus",
    "PropertyArea",
    "DisplayAmount",
    "Locality",
    "Bedrooms",
  ];

  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Property Type", key: "PropertyType" },
    { label: "Property Status", key: "PropertyStatus" },
    { label: "Area", key: "PropertyArea" },
    {
      label: "Amount",
      key: "DisplayAmount",
      render: (val) => (val ? formatAmount(val) : "-"),
    },
    { label: "Locality", key: "Locality" },
    { label: "Bedrooms", key: "Bedrooms" },
    {
      label: "More",
      key: "more",
      render: (_, row) => (
        <button
          onClick={() => setSelectedRow(row)}
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          View
        </button>
      ),
    },
  ];

  const hiddenCols = selectedRow
    ? Object.entries(selectedRow).filter(([key]) => !mainKeys.includes(key))
    : [];

  const renameKey = (key) => {
    const mapping = {
      PropertyCity: "City",
      PropertyState: "State",
      PropertyZipcode: "Zipcode",
      PropertyLatitude: "Latitude",
      PropertyLongitude: "Longitude",
      AmountWithUnit: "Amount with Unit",
      ProjectID: "Project ID",
      DisplayOrderID: "Display Order ID",
      ProjectSpecialOrderID: "Special Order ID",
      PropertyBathrooms: "Bathrooms",
      PropertyMainEntranceFacing: "Main Entrance Facing",
    };
    return mapping[key] || key;
  };

  if (loading) return <p style={{ padding: 24 }}>Loading active listings...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;
  if (!data.length) return <p style={{ padding: 24 }}>No active listings found.</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9f9f9" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: 24,
          marginLeft: 235, // Important to prevent table overflow
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Active Listings</h2>

        <div
          style={{
            borderRadius: 8,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <Table
            columns={columns}
            data={data}
            rowsPerPage={15}
            rowStyle={{ height: 30, fontSize: "0.85rem" }} // Reduced row height
          />
        </div>

        {/* Slide Panel */}
        {selectedRow && (
          <>
            <div
              onClick={() => setSelectedRow(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "90%",
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
                width: "350px",
                height: "100%",
                background: "#fff",
                zIndex: 999,
                padding: 20,
                overflowY: "auto",
                boxShadow: "-2px 0 12px rgba(0,0,0,0.15)",
              }}
            >
              <button
                onClick={() => setSelectedRow(null)}
                style={{
                  float: "right",
                  fontSize: 24,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              {selectedRow.ImageUrl && (
                <div style={{ marginBottom: 16 }}>
                  <img
                    src={selectedRow.ImageUrl.replace(/[\[\]"']/g, "")}
                    alt={selectedRow.PropertyName}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </div>
              )}

              <h3 style={{ marginTop: 0, marginBottom: 20 }}>Property Details</h3>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: 6, borderBottom: "2px solid #ddd" }}>Column</th>
                    <th style={{ textAlign: "left", padding: 6, borderBottom: "2px solid #ddd" }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {hiddenCols.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ textAlign: "center", padding: 16 }}>
                        No additional details
                      </td>
                    </tr>
                  ) : (
                    hiddenCols.map(([key, val]) => (
                      <tr key={key}>
                        <td style={{ fontWeight: 600, padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                          {renameKey(key)}
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{val ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
