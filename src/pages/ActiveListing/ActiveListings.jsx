 // src/pages/ActiveListings/ActiveListings.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../API/Api.js";
import Table from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";
import BackButton from "../../Utils/Backbutton.jsx";
import { Eye, X } from "lucide-react";

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

  const rowsPerPage = 10;

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetchData("ActiveListingDataInfo");
        const arr = Array.isArray(response) ? response : response?.data || [];
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
        if (!mounted) return;
        setData(cleanedData);
        setFilteredData(cleanedData);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setData([]);
        setFilteredData([]);
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

  // Filtering + search
  useEffect(() => {
    let result = [...data];

    Object.keys(filters).forEach((key) => {
      const selected = filters[key];
      if (selected && selected.length > 0) {
        result = result.filter((row) => selected.includes(row[key]));
      }
    });

    if (searchValue && searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => val && String(val).toLowerCase().includes(lower))
      );
    }

    setFilteredData(result);
    setPage(1);
  }, [filters, data, searchValue]);

  const getUniqueValues = (key) =>
    Array.from(new Set(filteredData.map((item) => item[key]).filter(Boolean)));

  const handleCheckboxChange = (columnKey, value) => {
    setFilters((prev) => {
      const existing = prev[columnKey] || [];
      return existing.includes(value)
        ? { ...prev, [columnKey]: existing.filter((v) => v !== value) }
        : { ...prev, [columnKey]: [...existing, value] };
    });
  };

  const toggleFilter = (columnKey) => {
    setOpenFilter((prev) => (prev === columnKey ? null : columnKey));
  };

  const columns = [
    { label: "S.No", key: "serialNo", canFilter: false },
    { label: "Property ID", key: "PropertyID" },
    { label: "Property Name", key: "PropertyName" },
    { label: "Property Type", key: "PropertyType" },
    { label: "Property Status", key: "PropertyStatus" },
    { label: "Area", key: "PropertyArea" },
    {
      label: "Price",
      key: "AmountWithUnit",
      render: (val) => (val ? (String(val).includes("₹") ? val : `₹ ${val}`) : "-"),
      align: "center",
    },
    { label: "Locality", key: "Locality" },
    { label: "Bedrooms", key: "Bedrooms" },
    {
      label: "Action",
      key: "action",
      canFilter: false,
      render: (_, row) => (
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

  const hasActiveFilter = (key) => Array.isArray(filters[key]) && filters[key].length > 0;

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Simple spinner JSX
  const Spinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
      }}
    >
      <div className="loader" />
      <style>
        {`
          .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #0a0b0bff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: 20, marginLeft: "180px" }}>
        <div style={{ marginBottom: 10 }}>
          <BackButton onClick={() => navigate("/dashboard")} label="Back" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, color: "#222", fontSize: "1.05rem", fontWeight: 600 }}>Active Listings</h2>

          <div style={{ width: 320, maxWidth: "40%" }}>
            <SearchBar
              value={searchValue}
              onChange={(v) => setSearchValue(v)}
              onSubmit={() => setPage(1)}
              pageLabel="Active Listings"
            />
          </div>
        </div>

        <div style={{ borderRadius: 8, background: "#fff", padding: 10 }}>
          {loading ? (
            <Spinner />
          ) : (
            <Table
              columns={columns}
              data={filteredData}
              paginatedData={paginatedData}
              filters={filters}
              openFilter={openFilter}
              toggleFilter={toggleFilter}
              handleCheckboxChange={handleCheckboxChange}
              uniqueValues={getUniqueValues}
              hasActiveFilter={hasActiveFilter}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              totalCount={filteredData.length}
              clearFilter={(colKey) => setFilters((prev) => ({ ...prev, [colKey]: [] }))}
              applyFilter={() => {}}
              onRowClick={(row) => setSelectedRow(row)}
            />
          )}
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
              boxShadow: "-2px 0 8px rgba(0,0,0,0.12)",
              zIndex: 1500,
              padding: 20,
              overflowY: "auto",
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
              .filter(([key]) => !["DisplayAmount", "PropertyLatitude", "PropertyLongitude", "ProjectOrderID"].includes(key))
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
      </main>
    </div>
    </div>
  );
}
