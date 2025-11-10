// export default Alerts;
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate } from "react-router-dom";
import Table, { Pagination } from "../../Utils/Table.jsx";
import SearchBar from "../../Utils/SearchBar.jsx";

// Format amount helper
const formatAmount = (num) => {
  if (!num || isNaN(num)) return "-";
  const n = parseFloat(num);
  if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, "") + " L";
  return n.toLocaleString("en-IN");
};


export default function Alerts() {
  const { fetchData } = useApi();
  const navigate = useNavigate();

  const [buyerAlerts, setBuyerAlerts] = useState([]);
  const [sellerAlerts, setSellerAlerts] = useState([]);
  const [view, setView] = useState("buyer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  // filter states (used by Table)
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterSearchValue, setFilterSearchValue] = useState("");

  // global search
  const [searchQuery, setSearchQuery] = useState("");

  // fetch alerts data
  useEffect(() => {
    async function load() {
      try {
        const [buyerRes, sellerRes] = await Promise.all([
          fetchData("BuyerAlerts"),
          fetchData("SellerAlerts"),
        ]);

        const addSerials = (arr) =>
          (Array.isArray(arr) ? arr : []).map((a, idx) => ({
            ...a,
            serialNo: idx + 1,
          }));

        setBuyerAlerts(addSerials(buyerRes || []));
        setSellerAlerts(addSerials(sellerRes || []));
      } catch (err) {
        setError(err.message || "Error loading alerts");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);

  // handle filters
  const toggleFilter = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
    setFilterSearchValue("");
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const clearFilter = (key) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setOpenFilter(null);
  };

  const uniqueValues = (key) => {
    const data = view === "buyer" ? buyerAlerts : sellerAlerts;
    return Array.from(
      new Set(data.map((item) => item[key]).filter((v) => v !== null && v !== undefined))
    );
  };

  const applyFilter = () => {
    setOpenFilter(null);
  };

  // combine filters + search
  const allData = view === "buyer" ? buyerAlerts : sellerAlerts;

  const filteredData = useMemo(() => {
    let result = allData.filter((item) =>
      Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true;
        return values.includes(item[key]);
      })
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some(
          (val) => val && val.toString().toLowerCase().includes(query)
        )
      );
    }

    return result;
  }, [allData, filters, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  // columns
  const columns =
    view === "buyer"
      ? [
          { label: "S.No", key: "serialNo", render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1 },
          { label: "ID", key: "BuyerAlertID" },
          { label: "User ID", key: "UserID" },
          { label: "Location", key: "Location" },
          { label: "Min Price", key: "MinPrice", render: (val) => formatAmount(val) },
          { label: "Max Price", key: "MaxPrice", render: (val) => formatAmount(val) },
          { label: "Property Type", key: "PropertyType" },
          { label: "Date", key: "AlertDate", render: (val) => (val ? new Date(val).toLocaleDateString() : "-") },
          { label: "Additional Notes", key: "AdditionalNotes" },
        ]
      : [
          { label: "S.No", key: "serialNo", render: (_, __, idx) => (page - 1) * rowsPerPage + idx + 1 },
          { label: "ID", key: "SellerAlertID" },
          { label: "User ID", key: "UserID" },
          { label: "Location", key: "Location" },
          { label: "Price", key: "Price", render: (val) => formatAmount(val) },
          { label: "Property Type", key: "PropertyType" },
          { label: "Date", key: "AlertDate", render: (val) => (val ? new Date(val).toLocaleDateString() : "-") },
          { label: "Additional Notes", key: "AdditionalNotes" },
        ];

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;

  return (
    <div
      className="dashboard-container"
      style={{
        // display: "flex",
        height: "100vh",
        overflow: "hidden", // 🚫 No page scroll
        backgroundColor: "#fff",
        marginLeft:"180px",
      }}
    >
    <div style={{ display: "flex", background: "#fff" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          minHeight: "100vh",
          padding: 24,
          marginLeft: 0,
          position: "relative",
        }}
      >
        {/* Back Button */}
        {/* <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none",
            color: "#2c3e50",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          ← Back
        </button> */}

        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, color: "#22253b", fontWeight: 600 }}>Alerts & Matches</h2>
         
          <button
            onClick={() => navigate("/create-alert")}
            style={{
              color: "#121212",
              border: "1px solid #eed61d",
              // borderRadius: 6,
              padding: "6px 6px",
              cursor: "pointer",
              background: "transparent",
              fontWeight: 500,
            }}
          >
            + Create Alert
          </button>
        
          
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, justifyContent:"space-between"}}>
          <div>
          {[
            { label: "Buyer Alerts", value: "buyer" },
            { label: "Seller Alerts", value: "seller" },
          ].map((tab) => {
            const isActive = view === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setView(tab.value);
                  setPage(1);
                }}
                style={{
                  backgroundColor: isActive ? "#fff" : "#f0f0f0",
                  color: isActive ? "#2c3e50" : "#666",
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  borderBottom: isActive ? "3px solid #2c3e50" : "3px solid transparent",
                  // borderTopLeftRadius: 6,
                  // borderTopRightRadius: 6,
                  gap:"2px",
                }}
              >
                {tab.label}
              </button>
            );
          })}
          </div>
      

        {/* 🔍 Global Search Bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={() => {}}
           
            style={{ width: 320 }}
          />
        </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          paginatedData={paginatedData}
          page={page}
          rowsPerPage={rowsPerPage}
          openFilter={openFilter}
          toggleFilter={toggleFilter}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          clearFilter={clearFilter}
          applyFilter={applyFilter}
          uniqueValues={uniqueValues}
          searchValue={filterSearchValue}
          setSearchValue={setFilterSearchValue}
        />

        {/* Pagination */}
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.max(1, Math.ceil(filteredData.length / rowsPerPage))}
        />
      </div>
    </div>
    </div>
  );
}
