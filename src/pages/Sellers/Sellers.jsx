 import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import Table from "../../components/Table.jsx";
 
function LocationCell({ value }) {
  const [showAll, setShowAll] = useState(false);
 
  if (!value || typeof value !== "string") return null;
 
  const locations = value.split(",").map ((item)=>item.trim());
  const firstLocation = locations[0];
  const hasMore = locations.length>1;
 
  return (
    <span
      style={{
        cursor: hasMore ? "pointer" : "default",
        textDecoration: hasMore ? "none" : "none",
        color: hasMore ? "black" : "black",
      }}
      onClick={() => hasMore && setShowAll(!showAll)}
      title={
        hasMore?showAll ? "Click to collapse" : "Click to expand full address":""}
    >
      {showAll
        ? locations.join (","):(
        <>
          {firstLocation}
          {hasMore? ",..." : ""}
        </>
      )}
    </span>
  );
}
export default function Sellers() {
  const [Sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchData } = useApi();
 
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchData("SellersDetails");
        setSellers(data || []);
      } catch (err) {
        setError(err.message || "Error loading sellers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchData]);
 
  const columns = [
    {label:"S.No",
      key:"serialNo",
      render: (_, __, index) => index + 1,
    },
    { label: "Seller Id", key: "Sellerid" },
    { label: "Seller Name", key: "SellerName" },
    { label: "Residential Address",
       key: "ResidentialAddress" ,
       render:(val) => <LocationCell value={val}/>
     
    },
    {
      label: "Owner",
      key: "IslegalOwner",
      render: (val) => (val ? "yes" : "no"),
    },
    { label: "Contact Number", key: "ContactNumber" },
    { label: "Email", key: "Email" },
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
          <h2 style={{ margin: 0 }}>Sellers</h2>
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
        {loading ? <p>Loading...</p> : <Table columns={columns} data={Sellers} rowsPerPage={15} />}
      </div>
    </div>
  );
}