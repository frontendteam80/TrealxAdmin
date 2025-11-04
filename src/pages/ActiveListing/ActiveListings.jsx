 import React, { useEffect, useState, useMemo, useRef } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import { Search, Filter, Eye, X } from "lucide-react";
import { Pagination } from "../../Utils/Table.jsx";

// FilterDropdown unchanged...
function FilterDropdown({
  columnKey,
  uniqueValues,
  selectedValues,
  onApply,
  onCancel,
  onSelectAll,
  onClearAll,
  onCheckboxChange,
}) {
  const [search, setSearch] = useState("");
  const filteredValues = uniqueValues.filter((val) =>
    val?.toString().toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        background: "#fff",
        border: "1px solid #e3e6eb",
        borderRadius: 8,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        zIndex: 1000,
        width: 230,
        maxHeight: 320,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Same content as before */}
      <div style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "6px 8px",
            border: "1px solid #dcdfe4",
            borderRadius: 6,
            fontSize: "0.85rem",
          }}
        />
        <div
          style={{
            marginTop: 8,
            fontSize: "0.8rem",
            color: "#007bff",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ cursor: "pointer" }} onClick={onSelectAll}>
            Select All
          </span>
          <span style={{ cursor: "pointer" }} onClick={onClearAll}>
            Clear All
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "6px 10px" }}>
        {filteredValues.map((val) => (
          <label
            key={val}
            style={{
              display: "block",
              fontSize: "0.85rem",
              marginBottom: 4,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(val)}
              onChange={() => onCheckboxChange(val)}
              style={{ marginRight: 6 }}
            />
            {val || "N/A"}
          </label>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
          borderTop: "1px solid #f0f0f0",
          background: "#fafafa",
        }}
      >
        <button
          onClick={onApply}
          style={{
            background: "#22253b",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Apply
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "#ccc",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ActiveListings() {
  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 15;
  const filterRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetchData("ActiveListingDataInfo");
        const arr = Array.isArray(response) ? response : response.data || [];
        const cleanedData = arr.map(
          ({
            PropertyLatitude,
            PropertyLongitude,
            ProjectSpecialOrderID,
            PreCalculatedSqft,
            PreCalculatedDisplayAmount,
            DisplayOrderID,
            ...rest
          }) => rest
        );
        setData(cleanedData);
        setFilteredData(cleanedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchData]);

  useEffect(() => {
    let result = [...data];
    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });

    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => val && val.toString().toLowerCase().includes(lower)
        )
      );
    }

    setFilteredData(result);
    setPage(1);
  }, [filters, data, searchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUniqueValues = (key) => [
    ...new Set(data.map((item) => item[key]).filter(Boolean)),
  ];

  const handleCheckboxChange = (columnKey, value) => {
    setFilters((prev) => {
      const existing = prev[columnKey] || [];
      return existing.includes(value)
        ? { ...prev, [columnKey]: existing.filter((v) => v !== value) }
        : { ...prev, [columnKey]: [...existing, value] };
    });
  };

  const columns = [
    { label: "S.No", key: "serialNo", render: (_, __, idx) => idx + 1 },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Property Type", key: "PropertyType" },
    { label: "Property Status", key: "PropertyStatus" },
    { label: "Area", key: "PropertyArea" },
    {
      label: "Price",
      key: "AmountWithUnit",
      render: (val) =>
        val
          ? val.toString().includes("₹")
            ? val
            : `₹ ${val}`
          : "-",
    },
    { label: "Locality", key: "Locality" },
    { label: "Bedrooms", key: "Bedrooms" },
    {
      label: "Action",
      key: "action",
      render: (_, row) => (
        <button
          onClick={() => setSelectedRow(row)}
          style={{
            background: "#c4ced6",
            color: "#121212",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Eye size={10} /> View
        </button>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const formatKeyName = (key) => {
    let name = key.replace(/^Property/, "");
    if (name === "AmountWithUnit") return "Price";
    if (name === "ID") return "ID";
    return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Sidebar container with flexShrink to avoid collapsing */}
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Main content container with flex grow and minWidth to prevent overlap */}
      <div style={{ flex: 1, padding: 20, marginLeft: "180px", position: "relative" }}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.8rem",
            color: "#121212",
            marginBottom: 10,
          }}
        >
          Back
        </button>

        {/* Header and Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <h2 style={{ color: "#222", margin: 0 }}>Active Listings</h2>
          <div style={{ position: "relative", width: 200 }}>
            <Search
              size={18}
              color="#adb1bd"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              style={{
                padding: "8px 12px 8px 34px",
                borderRadius: 8,
                border:  "1px solid #e5e7eb",
                background: "#f7fafd",
                fontSize: 14,
                color: "#1a2230",
                width: "130px",
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            borderRadius: 8,
            background: "#fff",
            padding: 10,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              position: "relative",
              fontSize: "0.85rem",
            }}
            ref={filterRef}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      borderBottom: "2px solid #eee",
                      padding: "6px 8px",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <span>{col.label}</span>
                    {col.key !== "serialNo" && col.key !== "action" && (
                      <Filter
                        size={15}
                        style={{
                          marginLeft: 7,
                          cursor: "pointer",
                          color: openFilter === col.key ? "#22253b" : "#adb1bd",
                        }}
                        onClick={() =>
                          setOpenFilter(openFilter === col.key ? null : col.key)
                        }
                      />
                    )}
                    {openFilter === col.key && (
                      <FilterDropdown
                        columnKey={col.key}
                        uniqueValues={getUniqueValues(col.key)}
                        selectedValues={filters[col.key] || []}
                        onApply={() => setOpenFilter(null)}
                        onCancel={() => setOpenFilter(null)}
                        onSelectAll={() =>
                          setFilters((prev) => ({
                            ...prev,
                            [col.key]: getUniqueValues(col.key),
                          }))
                        }
                        onClearAll={() =>
                          setFilters((prev) => ({ ...prev, [col.key]: [] }))
                        }
                        onCheckboxChange={(val) =>
                          handleCheckboxChange(col.key, val)
                        }
                      />
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
                    borderBottom: "1px solid #f0f0f0",
                    height: "34px",
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        textAlign: "center",
                        fontWeight: "400",
                        padding: "4px 6px",
                      }}
                    >
                      {col.render
                        ? col.render(row[col.key], row, idx)
                        : row[col.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            page={page}
            setPage={setPage}
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          />
        </div>

        {/* Slide Panel */}
        {selectedRow && (
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "400px",
              height: "100%",
              background: "#fff",
              boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
              zIndex: 1500,
              overflowY: "auto",
              padding: 20,
            }}
          >
            <X
              size={22}
              color="red"
              style={{
                cursor: "pointer",
                float: "right",
              }}
              onClick={() => setSelectedRow(null)}
            />
            <h3 style={{ fontSize: "1.4rem", marginBottom: 10 }}>
              Property Details
            </h3>

            {Object.entries(selectedRow)
              .filter(
                ([key]) =>
                  key !== "DisplayAmount" &&
                  key !== "PropertyLatitude" &&
                  key !== "PropertyLongitude"
              )
              .sort(([a], [b]) => {
                if (a === "PropertyState" || a === "PropertyZipcode") return 1;
                if (b === "PropertyState" || b === "PropertyZipcode") return -1;
                return 0;
              })
              .map(([key, value]) => (
                <p
                  key={key}
                  style={{
                    fontSize: "1.05rem",
                    margin: "6px 0",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>{formatKeyName(key)}:</strong> {value || "-"}
                </p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
