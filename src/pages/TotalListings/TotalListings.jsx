 import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import { Funnel } from "lucide-react";
import formatAmount from "../../Utils/formatAmount.js";

export default function TotalListings() {
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

  // ✅ Fetch Total Listings Data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetchData("TotalListingDetails");
        const arr = Array.isArray(response) ? response : response.data || [];
        setData(arr);
        setFilteredData(arr);
      } catch (err) {
        setError(err.message || "Failed to fetch total listings");
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

  // ✅ Table Columns
  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Property Type", key: "PropertyType" },
    { label: "Property Status", key: "PropertyStatus" },
    { label: "Area", key: "PropertyArea" },
    {
      label: "Amount",
      key: "Amount",
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
            background: "#e8edf1ff",
            color: "#121212",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          View
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

  // ✅ Spinner
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
          borderTop: "5px solid #007bff",
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

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const extraDetails = selectedRow
    ? Object.entries(selectedRow).filter(
        ([key]) => !mainKeys.includes(key) && selectedRow[key] !== null
      )
    : [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#e7e7e7",
            border: "none",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.9rem",
            color: "#333",
          }}
        >
          ← Back
        </button>

        <h2 style={{ marginBottom: 20, color: "#222" }}>Total Listings</h2>

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
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
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
                      {col.key !== "serialNo" && col.key !== "more" && (
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
                              //width: "100%",
                              padding: "8px 12px 8px 34px",
                               background: "#f7fafd",
                fontSize: 14,
                color: "#1a2230",
                width: "170px",
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: 6,
                            }}
                          >
                            <button
                              onClick={() => clearFilter(col.key)}
                              style={{
                                background: "#f3f4f6",
                                border: "none",
                                borderRadius: 4,
                                padding: "4px 8px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                              }}
                            >
                              Clear
                            </button>
                            <button
                              onClick={applyFilter}
                              style={{
                                background: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                padding: "4px 8px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                              }}
                            >
                              Apply
                            </button>
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
                      <td key={col.key} style={{ padding: "4px 6px", color: "#333" }}>
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
                alignItems: "center",
                gap: "6px",
                padding: "10px 0",
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{
                  background: "#007bff",
                  color: "#fff",
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
                  background: "#007bff",
                  color: "#fff",
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

        {/* ✅ Slide Panel */}
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
                width: "360px",
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

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 20,
                  fontSize: "1.1rem",
                  color: "#007bff",
                  borderBottom: "1px solid #eee",
                  paddingBottom: 6,
                }}
              >
                {selectedRow.PropertyName || "Property Details"}
              </h3>

              {extraDetails.length === 0 ? (
                <p style={{ color: "#666" }}>No additional details available.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {extraDetails.map(([key, val]) => (
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
                          {key}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            borderBottom: "1px solid #eee",
                            width: "60%",
                          }}
                        >
                          {val ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
