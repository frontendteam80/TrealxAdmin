 
 
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../Utils/Table.jsx";
import "./Alerts.scss";
 
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
  const location = useLocation();
 
  const [buyerAlerts, setBuyerAlerts] = useState([]);
  const [sellerAlerts, setSellerAlerts] = useState([]);
  const [view, setView] = useState("buyer");
 
  const rowsPerPage = 10;
 
  // Fetch buyer alerts
  const fetchBuyerAlerts = async () => {
    const data = await fetchData("BuyerAlerts");
    let alerts = (data || []).map((a) => ({ ...a, isNew: false }));
 
    if (location.state?.newAlert && location.state.newAlert.MinPrice !== undefined) {
      const exists = alerts.find(
        (a) => a.BuyerAlertID === location.state.newAlert.BuyerAlertID
      );
      if (!exists) {
        alerts = [...alerts, { ...location.state.newAlert, isNew: true }];
      }
    }
 
    setBuyerAlerts(alerts);
  };
 
  // Fetch seller alerts
  const fetchSellerAlerts = async () => {
    const data = await fetchData("SellerAlerts");
    let alerts = (data || []).map((a) => ({ ...a, isNew: false }));
 
    if (location.state?.newAlert && location.state.newAlert.Price !== undefined) {
      const exists = alerts.find(
        (a) => a.SellerAlertID === location.state.newAlert.SellerAlertID
      );
      if (!exists) {
        alerts = [...alerts, { ...location.state.newAlert, isNew: true }];
      }
    }
 
    setSellerAlerts(alerts);
  };
 
  const toggleView = async (type, fetchFn) => {
    if (fetchFn) await fetchFn();
    setView(type);
  };
 
  useEffect(() => {
    fetchBuyerAlerts();
    fetchSellerAlerts();
    window.history.replaceState({}, document.title);
  }, [fetchData]);
 
  // Match buyers & sellers
  const findMatches = () => {
    const matches = [];
    buyerAlerts.forEach((buyer) => {
      const buyerLocations = (buyer.Location || "").split(",").map((l) => l.trim());
      sellerAlerts.forEach((seller) => {
        if (
          buyerLocations.includes(seller.Location) &&
          buyer.PropertyType === seller.PropertyType &&
          parseFloat(seller.Price) >= parseFloat(buyer.MinPrice) &&
          parseFloat(seller.Price) <= parseFloat(buyer.MaxPrice)
        ) {
          matches.push({ buyer, seller });
        }
      });
    });
    return matches;
  };
 
  // Column Definitions
  const buyerColumns = [
    { key: "BuyerAlertID", label: "ID" },
    { key: "UserID", label: "UserID" },
    { key: "Location", label: "Location" },
    { key: "MinPrice", label: "Min Price", render: (val) => formatAmount(val) },
    { key: "MaxPrice", label: "Max Price", render: (val) => formatAmount(val) },
    {
      key: "PropertyType",
      label: "Property Type",
      render: (val, row) => (
        <>
          {val}
          {row.isNew && <span className="new-badge">NEW</span>}
        </>
      ),
    },
    {
      key: "AlertDate",
      label: "Date",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    { key: "AdditionalNotes", label: "Additional Notes" },
  ];
 
  const sellerColumns = [
    { key: "SellerAlertID", label: "ID" },
    { key: "UserID", label: "UserID" },
    { key: "Location", label: "Location" },
    { key: "Price", label: "Price", render: (val) => formatAmount(val) },
    {
      key: "PropertyType",
      label: "Property Type",
      render: (val, row) => (
        <>
          {val}
          {row.isNew && <span className="new-badge">NEW</span>}
        </>
      ),
    },
    {
      key: "AlertDate",
      label: "Date",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    { key: "AdditionalNotes", label: "Additional Notes" },
  ];
 
  const matchColumns = [
    { key: "buyerId", label: "Buyer ID" },
    { key: "sellerId", label: "Seller ID" },
    { key: "propertyType", label: "Property Type" },
    { key: "buyerRange", label: "Buyer Range" },
    { key: "sellerPrice", label: "Seller Price" },
    { key: "location", label: "Location" },
  ];
 
  const matchData = findMatches().map((m) => ({
    buyerId: m.buyer.BuyerAlertID,
    sellerId: m.seller.SellerAlertID,
    propertyType: m.buyer.PropertyType,
    buyerRange: `${formatAmount(m.buyer.MinPrice)} - ${formatAmount(m.buyer.MaxPrice)}`,
    sellerPrice: formatAmount(m.seller.Price),
    location: m.buyer.Location,
  }));
 
  // UI
  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <Sidebar />
      <div
        className="buyers-content"
        style={{
          flex: 1,
          backgroundColor: "#fff",
          minHeight: "100vh",
          padding: 24,
        }}
      >
        <div className="alerts-container" style={{ flex: 1 }}>
          <header className="alerts-header">Alerts & Matches</header>
          <div className="user-name">Mounika</div>
 
          <div className="alerts-top">
            <div className="alerts-buttons">
              <button
                onClick={() => toggleView("buyer", fetchBuyerAlerts)}
                className={`alerts-btn ${view === "buyer" ? "active" : ""}`}
              >
                Buyer Alerts
              </button>
              <button
                onClick={() => toggleView("seller", fetchSellerAlerts)}
                className={`alerts-btn ${view === "seller" ? "active" : ""}`}
              >
                Seller Alerts
              </button>
              <button
                onClick={() => toggleView("matches")}
                className={`alerts-btn ${view === "matches" ? "active" : ""}`}
              >
                Matches
              </button>
            </div>
            <button
              className="create-alert-btn"
              onClick={() => navigate("/create-alert")}
            >
              Create Alert
            </button>
          </div>
 
          <div className="alerts-content">
            {view === "buyer" && (
              <Table
                // title="Buyer Alerts"
                columns={buyerColumns}
                data={buyerAlerts}
                rowsPerPage={15}
              />
            )}
 
            {view === "seller" && (
              <Table
                // title="Seller Alerts"
                columns={sellerColumns}
                data={sellerAlerts}
                rowsPerPage={15}
              />
            )}
 
            {view === "matches" && (
              matchData.length === 0 ? (
                <p style={{ color: "#777" }}>No matches found</p>
              ) : (
                <Table
                  // title="Buyer-Seller Matches"
                  columns={matchColumns}
                  data={matchData}
                  rowsPerPage={15}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Alerts;
 
 