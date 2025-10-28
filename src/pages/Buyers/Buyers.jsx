 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table from "../../Utils/Table.jsx";
import formatAmount from "../../Utils/formatAmount.js";
 
function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
 
  if (!value || typeof value !== "string") return <>null</>;
 
  const locations = value.split(",");
  const firstLocation = locations[0];
  const remaining = locations.slice(1).join(", ");
 
  return (
    <span
      style={{
        cursor: remaining ? "pointer" : "default",
        textDecoration: remaining ? "none" : "none",
        color: remaining ? "black" : "black",
      }}
      onClick={() => remaining && setShowAll(!showAll)}
      title={showAll ? "Click to collapse" : "Click to expand full address"}
    >
      {showAll ? value : (
        <>
          {firstLocation}
          {remaining ? ",..." : ""}
        </>
      )}
    </span>
  );
}
 
export default function Buyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchData } = useApi();
 
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchData("Buyer_info");
        setBuyers(data || []);
      } catch (err) {
        setError(err.message || "Error loading buyers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);
 
  const columns = [
    {
      label: "S.No",
      key: "serialNo",
      render: (_, __, index) => index + 1,
    },
    { key: "BuyerID", label: "BuyerID" },
    { label: "Buyer Name", key: "BuyerName" },
    { label: "ContactNumber", key: "ContactNumber" },
    { label: "Email", key: "Email" },
    {
      label: "Preferred Location",
      key: "PreferredLocations",
      render: (val) => <LocationCell value={val} />,
    },
    { label: "Property Types", key: "PropertyTypes" },
    {
      label: "Budget",
      key: "BudgetMin",
      render: (_, row) => {
        const minAmount = formatAmount(row.BudgetMin);
        const maxAmount = formatAmount(row.BudgetMax);
        return `${minAmount} - ${maxAmount}`;
      },
    },
    { label: "Timeline", key: "Timeline" },
    { label: "Payment Mode", key: "PaymentMode" },
  ];
 
  if (error) return <div>Error: {error}</div>;
 
  return (
    <div className="dashboard-container" style={{ display: "flex", backgroundColor: "#fff" }}>
      <Sidebar />
      <div
        className="buyers-content"
        style={{
          flex: 1,
          position: "relative",
          minHeight: "100vh",
          // maxWidth: "calc(100vw - 260px)",
          overflowX: "auto",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>Buyers</h2>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#d4af37",
            }}
          >
            Kiran Reddy Pallaki
          </div>
        </div>
 
        {loading ? <p>Loading...</p> : <Table columns={columns} data={buyers} rowsPerPage={15} />}
      </div>
    </div>
  );
}
 
 