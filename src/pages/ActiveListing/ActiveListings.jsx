 import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import { Search, Eye, X } from "lucide-react";
import Table,{Pagination}from "../../Utils/Table.jsx";

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

  // Filtering logic (global search + column filters)
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

  const getUniqueValues = (key) =>
    [...new Set(data.map((item) => item[key]).filter(Boolean))];

  const handleCheckboxChange = (columnKey, value) => {
    setFilters((prev) => {
      const existing = prev[columnKey] || [];
      return existing.includes(value)
        ? { ...prev, [columnKey]: existing.filter((v) => v !== value) }
        : { ...prev, [columnKey]: [...existing, value] };
    });
  };

  // toggleFilter adapter for Table component
  const toggleFilter = (columnKey) => {
    setOpenFilter((prev) => (prev === columnKey ? null : columnKey));
  };

  const columns = [
    // Table computes serial using page + rowsPerPage if passed
    { label: "S.No", key: "serialNo", canFilter: false },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Property Type", key: "PropertyType" },
    { label: "Property Status", key: "PropertyStatus" },
    { label: "Area", key: "PropertyArea" },
    {
      label: "Price",
      key: "AmountWithUnit",
      render: (val) =>
        val ? (val.toString().includes("₹") ? val : `₹ ${val}`) : "-",
      // align right if your Table supports `align` (Table.jsx treats `align` if present)
      align: "right",
    },
    { label: "Locality", key: "Locality" },
    { label: "Bedrooms", key: "Bedrooms" },
    {
      label: "Action",
      key: "action",
      canFilter: false,
      render: (_, row) => (
        // Eye icon only (no surrounding button box)
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRow(row);
          }}
          role="button"
          aria-label="View property"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedRow(row);
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
            margin: 0,
            lineHeight: 0,
            color: "#1b2337",
          }}
        >
          <Eye size={16} />
        </span>
      ),
    },
  ];

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const formatKeyName = (key) => {
    if (key === "MainEntranceFacing") return "Facing";
    if (key === "AmountWithUnit") return "Price";
    let name = key.replace(/^Property/, "");
    if (name === "ID") return "ID";
    return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  };

  // helper used by Table to indicate active filters (optional for your UI)
  const hasActiveFilter = (key) => filters[key]?.length > 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, padding: 20, marginLeft: "180px", position: "relative" }}>
        {/* reduced gap: marginBottom lowered */}
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
            marginBottom: 1,
          }}
        >
          Back
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2
            style={{
              marginBottom: 3,
              color: "#222",
              fontSize: "1.05rem",
              fontWeight: "600",
            }}
          >
            Active Listings
          </h2>

          <div style={{ position: "relative", width: 200 }}>
            <Search
              size={17}
              color="#adb1bd"
              style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              style={{
                padding: "8px 12px 8px 34px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f7fafd",
                fontSize: 14,
                color: "#1a2230",
                width: "170px",
              }}
            />
          </div>
        </div>

        <div style={{ borderRadius: 8, background: "#fff", padding: 10 }}>
          {/* Reusable Table component */}
          <Table
            columns={columns}
            paginatedData={paginatedData}
            filters={filters}
            openFilter={openFilter}
            toggleFilter={toggleFilter}
            handleCheckboxChange={handleCheckboxChange}
            uniqueValues={getUniqueValues}
            hasActiveFilter={hasActiveFilter}
            page={page}
            rowsPerPage={rowsPerPage}
            clearFilter={(colKey) => setFilters((prev) => ({ ...prev, [colKey]: [] }))}
            applyFilter={() => {}}
            onRowClick={(row) => setSelectedRow(row)}
          />

          <Pagination
            page={page}
            setPage={setPage}
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          />
        </div>

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
             // overflowY: "auto",
              padding: 20,
            }}
          >
            <X
              size={22}
              color="red"
              style={{ cursor: "pointer", float: "right" }}
              onClick={() => setSelectedRow(null)}
            />
            <h3 style={{ fontSize: "1.4rem", marginBottom: 10 }}>Property Details</h3>

            {Object.entries(selectedRow)
              .filter(
                ([key]) =>
                  key !== "DisplayAmount" &&
                  key !== "PropertyLatitude" &&
                  key !== "PropertyLongitude" &&
                  key !== "ProjectOrderID"
              )
              .sort(([a], [b]) => {
                if (a === "PropertyState" || a === "PropertyZipcode") return 1;
                if (b === "PropertyState" || b === "PropertyZipcode") return -1;
                return 0;
              })
              .map(([key, value]) => (
                <p key={key} style={{ fontSize: "1.05rem", margin: "6px 0", lineHeight: "1.6" }}>
                  <strong>{key === "PropertyMainEntranceFacing" ? "Facing" : formatKeyName(key)}:</strong>{" "}
                  {key === "AmountWithUnit" && value ? `₹ ${value}` : value || "-"}
                </p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
