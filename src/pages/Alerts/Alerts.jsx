import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Pagination from "../../components/Pagination/Pagination";
import { useApi } from "../../API/Api.js";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // ✅ Fetch buyer alerts (append new alert to end if created recently)
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

  // ✅ Fetch seller alerts (append new alert to end)
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
    setCurrentPage(1);
    setView(type);
  };

  // ✅ Re-fetch both buyer and seller alerts to ensure persistence
  useEffect(() => {
    fetchBuyerAlerts();
    fetchSellerAlerts();
    // clear navigation state so newAlert doesn't reappear on next visit
    window.history.replaceState({}, document.title);
  }, [fetchData]);

  // ✅ Find property matches
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

  // ✅ Table rendering
  const Table = ({ headers, rows, tableType }) => {
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentRows = rows.slice(indexOfFirst, indexOfLast);

    return (
      <div className="table-wrapper">
        <table className={`alerts-table ${tableType}`}>
          <thead>
            <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {currentRows.map((row, idx) => (
              <tr key={idx}>
                {row.map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  };

  // ✅ UI
  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <Sidebar />
    <div className = "buyers-content"
      style={{
            flex: 1,
            backgroundColor: "#fff",
            minHeight: "100vh",
            // maxWidth: "calc(100vw - 260px)",
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
              tableType="buyer-alerts-table"
              headers={[
                "ID",
                "UserID",
                "Location",
                "Min Price",
                "Max Price",
                "Property Type",
                "Date",
                "Additional Notes",
              ]}
              rows={buyerAlerts.map((b) => [
                b.BuyerAlertID || "-",
                b.UserID || "-",
                b.Location,
                formatAmount(b.MinPrice),
                formatAmount(b.MaxPrice),
                <>
                  {b.PropertyType}
                  {b.isNew && <span className="new-badge">NEW</span>}
                </>,
                b.AlertDate ? new Date(b.AlertDate).toLocaleDateString() : "-",
                b.AdditionalNotes || "-",
              ])}
            />
          )}

          {view === "seller" && (
            <Table
              tableType="seller-alerts-table"
              headers={[
                "ID",
                "UserID",
                "Location",
                "Price",
                "Property Type",
                "Date",
                "Additional Notes",
              ]}
              rows={sellerAlerts.map((s) => [
                s.SellerAlertID || "-",
                s.UserID || "-",
                s.Location,
                formatAmount(s.Price),
                <>
                  {s.PropertyType}
                  {s.isNew && <span className="new-badge">NEW</span>}
                </>,
                s.AlertDate ? new Date(s.AlertDate).toLocaleDateString() : "-",
                s.AdditionalNotes || "-",
              ])}
            />
          )}

          {view === "matches" &&
            (() => {
              const matches = findMatches();
              if (matches.length === 0)
                return <p style={{ color: "#777" }}>No matches found</p>;
              return (
                <Table
                  tableType="matches-table"
                  headers={[
                    "Buyer ID",
                    "Seller ID",
                    "Property Type",
                    "Buyer Range",
                    "Seller Price",
                    "Location",
                  ]}
                  rows={matches.map((m) => [
                    m.buyer.BuyerAlertID,
                    m.seller.SellerAlertID,
                    m.buyer.PropertyType,
                    `${formatAmount(m.buyer.MinPrice)} - ${formatAmount(
                      m.buyer.MaxPrice
                    )}`,
                    formatAmount(m.seller.Price),
                    m.buyer.Location,
                  ])}
                />
              );
            })()}
        </div>
      </div>
    </div>
  </div>
  );
}

export default Alerts;
// import React, { useState, useEffect } from "react";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useApi } from "../../API/Api.js";
// import { useNavigate, useLocation } from "react-router-dom";
// import Table from "../../components/Table.jsx";
// import "./Alerts.scss";

// const formatAmount = (num) => {
//   if (!num || isNaN(num)) return "-";
//   const n = parseFloat(num);
//   if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
//   if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, "") + " L";
//   return n.toLocaleString("en-IN");
// };

// function Alerts() {
//   const { fetchData } = useApi();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [buyerAlerts, setBuyerAlerts] = useState([]);
//   const [sellerAlerts, setSellerAlerts] = useState([]);
//   const [view, setView] = useState("buyer");

//   const rowsPerPage = 10;

//   // Fetch buyer alerts
//   const fetchBuyerAlerts = async () => {
//     const data = await fetchData("BuyerAlerts");
//     let alerts = (data || []).map((a) => ({ ...a, isNew: false }));

//     if (location.state?.newAlert && location.state.newAlert.MinPrice !== undefined) {
//       const exists = alerts.find(
//         (a) => a.BuyerAlertID === location.state.newAlert.BuyerAlertID
//       );
//       if (!exists) {
//         alerts = [...alerts, { ...location.state.newAlert, isNew: true }];
//       }
//     }

//     setBuyerAlerts(alerts);
//   };

//   // Fetch seller alerts
//   const fetchSellerAlerts = async () => {
//     const data = await fetchData("SellerAlerts");
//     let alerts = (data || []).map((a) => ({ ...a, isNew: false }));

//     if (location.state?.newAlert && location.state.newAlert.Price !== undefined) {
//       const exists = alerts.find(
//         (a) => a.SellerAlertID === location.state.newAlert.SellerAlertID
//       );
//       if (!exists) {
//         alerts = [...alerts, { ...location.state.newAlert, isNew: true }];
//       }
//     }

//     setSellerAlerts(alerts);
//   };

//   const toggleView = async (type, fetchFn) => {
//     if (fetchFn) await fetchFn();
//     setView(type);
//   };

//   useEffect(() => {
//     fetchBuyerAlerts();
//     fetchSellerAlerts();
//     window.history.replaceState({}, document.title);
//   }, [fetchData]);

//   // Match buyers & sellers
//   const findMatches = () => {
//     const matches = [];
//     buyerAlerts.forEach((buyer) => {
//       const buyerLocations = (buyer.Location || "").split(",").map((l) => l.trim());
//       sellerAlerts.forEach((seller) => {
//         if (
//           buyerLocations.includes(seller.Location) &&
//           buyer.PropertyType === seller.PropertyType &&
//           parseFloat(seller.Price) >= parseFloat(buyer.MinPrice) &&
//           parseFloat(seller.Price) <= parseFloat(buyer.MaxPrice)
//         ) {
//           matches.push({ buyer, seller });
//         }
//       });
//     });
//     return matches;
//   };

//   // Column Definitions
//   const buyerColumns = [
//     { key: "BuyerAlertID", label: "ID" },
//     { key: "UserID", label: "UserID" },
//     { key: "Location", label: "Location" },
//     { key: "MinPrice", label: "Min Price", render: (val) => formatAmount(val) },
//     { key: "MaxPrice", label: "Max Price", render: (val) => formatAmount(val) },
//     {
//       key: "PropertyType",
//       label: "Property Type",
//       render: (val, row) => (
//         <>
//           {val}
//           {row.isNew && <span className="new-badge">NEW</span>}
//         </>
//       ),
//     },
//     {
//       key: "AlertDate",
//       label: "Date",
//       render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
//     },
//     { key: "AdditionalNotes", label: "Additional Notes" },
//   ];

//   const sellerColumns = [
//     { key: "SellerAlertID", label: "ID" },
//     { key: "UserID", label: "UserID" },
//     { key: "Location", label: "Location" },
//     { key: "Price", label: "Price", render: (val) => formatAmount(val) },
//     {
//       key: "PropertyType",
//       label: "Property Type",
//       render: (val, row) => (
//         <>
//           {val}
//           {row.isNew && <span className="new-badge">NEW</span>}
//         </>
//       ),
//     },
//     {
//       key: "AlertDate",
//       label: "Date",
//       render: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
//     },
//     { key: "AdditionalNotes", label: "Additional Notes" },
//   ];

//   const matchColumns = [
//     { key: "buyerId", label: "Buyer ID" },
//     { key: "sellerId", label: "Seller ID" },
//     { key: "propertyType", label: "Property Type" },
//     { key: "buyerRange", label: "Buyer Range" },
//     { key: "sellerPrice", label: "Seller Price" },
//     { key: "location", label: "Location" },
//   ];

//   const matchData = findMatches().map((m) => ({
//     buyerId: m.buyer.BuyerAlertID,
//     sellerId: m.seller.SellerAlertID,
//     propertyType: m.buyer.PropertyType,
//     buyerRange: `${formatAmount(m.buyer.MinPrice)} - ${formatAmount(m.buyer.MaxPrice)}`,
//     sellerPrice: formatAmount(m.seller.Price),
//     location: m.buyer.Location,
//   }));

//   // UI
//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div
//         className="buyers-content"
//         style={{
//           flex: 1,
//           backgroundColor: "#fff",
//           minHeight: "100vh",
//           padding: 24,
//         }}
//       >
//         <div className="alerts-container" style={{ flex: 1 }}>
//           <header className="alerts-header">Alerts & Matches</header>
//           <div className="user-name">Mounika</div>

//           <div className="alerts-top">
//             <div className="alerts-buttons">
//               <button
//                 onClick={() => toggleView("buyer", fetchBuyerAlerts)}
//                 className={`alerts-btn ${view === "buyer" ? "active" : ""}`}
//               >
//                 Buyer Alerts
//               </button>
//               <button
//                 onClick={() => toggleView("seller", fetchSellerAlerts)}
//                 className={`alerts-btn ${view === "seller" ? "active" : ""}`}
//               >
//                 Seller Alerts
//               </button>
//               <button
//                 onClick={() => toggleView("matches")}
//                 className={`alerts-btn ${view === "matches" ? "active" : ""}`}
//               >
//                 Matches
//               </button>
//             </div>
//             <button
//               className="create-alert-btn"
//               onClick={() => navigate("/create-alert")}
//             >
//               Create Alert
//             </button>
//           </div>

//           <div className="alerts-content">
//             {view === "buyer" && (
//               <Table
//                 title="Buyer Alerts"
//                 columns={buyerColumns}
//                 data={buyerAlerts}
//                 rowsPerPage={rowsPerPage}
//               />
//             )}

//             {view === "seller" && (
//               <Table
//                 title="Seller Alerts"
//                 columns={sellerColumns}
//                 data={sellerAlerts}
//                 rowsPerPage={rowsPerPage}
//               />
//             )}

//             {view === "matches" && (
//               matchData.length === 0 ? (
//                 <p style={{ color: "#777" }}>No matches found</p>
//               ) : (
//                 <Table
//                   title="Buyer-Seller Matches"
//                   columns={matchColumns}
//                   data={matchData}
//                   rowsPerPage={rowsPerPage}
//                 />
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Alerts;
