 import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate } from "react-router-dom";
import Table,{Pagination} from "../../Utils/Table.jsx";

const formatAmount = (num) => {
  if (!num || isNaN(num)) return "-";
  const n = parseFloat(num);
  if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, "") + " L";
  return n.toLocaleString("en-IN");
};

function Alerts() {
  const { fetchData } = useApi();
  const navigate = useNavigate();
  const filterRef = useRef();

  const [buyerAlerts, setBuyerAlerts] = useState([]);
  const [sellerAlerts, setSellerAlerts] = useState([]);
  const [view, setView] = useState("buyer");
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const rowsPerPage = 15;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addSerials(arr) {
    return (Array.isArray(arr) ? arr : []).map((a, idx) => ({
      ...a,
      serialNo: idx + 1,
    }));
  }

  const fetchBuyerAlerts = async () => {
    const data = await fetchData("BuyerAlerts");
    setBuyerAlerts(addSerials(data || []));
  };

  const fetchSellerAlerts = async () => {
    const data = await fetchData("SellerAlerts");
    setSellerAlerts(addSerials(data || []));
  };

  useEffect(() => {
    fetchBuyerAlerts();
    fetchSellerAlerts();
  }, []);

  const toggleFilter = (key) => {
    setOpenFilter((prev) => (prev === key ? null : key));
    setSearchValue("");
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  const applyFilter = () => setOpenFilter(null);
  const clearFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: [] }));
    setOpenFilter(null);
  };

  const uniqueValues = (key) => {
    const data = view === "buyer" ? buyerAlerts : sellerAlerts;
    return [...new Set(data.map((item) => item[key]).filter(Boolean))];
  };

  const filteredData = useMemo(() => {
    const data = view === "buyer" ? buyerAlerts : sellerAlerts;
    return data.filter((item) =>
      Object.keys(filters).every((key) => {
        const selected = filters[key];
        if (!selected || selected.length === 0) return true;
        return selected.includes(item[key]);
      })
    );
  }, [view, buyerAlerts, sellerAlerts, filters]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const buyerColumns = [
    { key: "serialNo", label: "S.No" },
    { key: "BuyerAlertID", label: "ID" },
    { key: "UserID", label: "UserID" },
    { key: "Location", label: "Location" },
    { key: "MinPrice", label: "Min Price", render: (val) => formatAmount(val) },
    { key: "MaxPrice", label: "Max Price", render: (val) => formatAmount(val) },
    { key: "PropertyType", label: "Property Type" },
    {
      key: "AlertDate",
      label: "Date",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    { key: "AdditionalNotes", label: "Additional Notes" },
  ];

  const sellerColumns = [
    { key: "serialNo", label: "S.No" },
    { key: "SellerAlertID", label: "ID" },
    { key: "UserID", label: "UserID" },
    { key: "Location", label: "Location" },
    { key: "Price", label: "Price", render: (val) => formatAmount(val) },
    { key: "PropertyType", label: "Property Type" },
    {
      key: "AlertDate",
      label: "Date",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    { key: "AdditionalNotes", label: "Additional Notes" },
  ];

  const columns = view === "buyer" ? buyerColumns : sellerColumns;

  return (
    <div style={{ display: "flex", background: "#fff" }}>
      {/* Wrap Sidebar with flexShrink: 0 */}
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Main content with flex grow and minWidth 0 */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          minHeight: "100vh",
          padding: 24,
          marginLeft:"180px",
        }}
      >
        

        {/* Header and Create Alert button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
            <h2
          style={{
            marginBottom: 14,
            color: "#222",
            fontSize: "1.05rem",
            fontWeight: "600",
          }}
        >
          Alerts & Matches
        </h2>
          <button
            onClick={() => navigate("/create-alert")}
            style={{
              color: "#121212",
              border: "1px solid #eed61d",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              background: "transparent",
              fontWeight: 500,
            }}
          >
            Create Alert
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 20,
          }}
        >
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
                  outline: "none",
                  cursor: "pointer",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  borderBottom: isActive
                    ? "3px solid #2c3e50"
                    : "3px solid transparent",
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  transition: "0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.color = "#666";
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div ref={filterRef}>
          <Table
            columns={columns}
            paginatedData={paginatedData}
            openFilter={openFilter}
            toggleFilter={toggleFilter}
            filters={filters}
            handleCheckboxChange={handleCheckboxChange}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            uniqueValues={uniqueValues}
            clearFilter={clearFilter}
            applyFilter={applyFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default Alerts;
