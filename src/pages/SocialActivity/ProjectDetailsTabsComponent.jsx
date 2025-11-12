 import React, { useState } from "react";
import {MdApartment,MdCheckCircle,MdBedroomParent,MdOutlineViewDay,MdStraighten,MdOutlineWc,MdOutlineWaves,MdLocationOn,MdShare,MdFavorite,MdFavoriteBorder,} from "react-icons/md";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import formatAmount from "../../Utils/formatAmount.js";
import Table from "../../Utils/Table.jsx";
 
 
const detailTabs = ["Details", "Facts & Features", "Amenities", "Highlights", "Location", "More"];
const GOOGLE_MAPS_API_KEY = "AIzaSyAlgntKS8paPrbLphDLlpNUW0W0j0NzslY";
 
 
export default function ProjectDetailsTabsComponent({
  data,
  initialTab = "Details",
  onClose,
  onRequestShare,
  currentPropertyId,
}) {
  if (!data || !data.units) return <div>loading...</div>;
 
  const [activeTab, setActiveTab] = useState(initialTab);
  const selectedUnit = data.units.find((unit) => unit.id === currentPropertyId);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
  const [favorites, setFavorites] = useState([]);
 
  const priceArray = data?.allPricesOfProject ?? [];
  const minPrice = priceArray.length ? Math.min(...priceArray) : 0;
  const maxPrice = priceArray.length ? Math.max(...priceArray) : 0;
  const priceRange = `${formatAmount(minPrice)} - ${formatAmount(maxPrice)}`;
  const remainingUnits = data.units.filter((unit) => unit.id !== currentPropertyId);
 
  const toggleFavorite = (unitId) =>
    setFavorites((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
 
  if (!isLoaded) return <div>Loading map...</div>;
 
  // Common table styles for reusable rendering
  const commonActionButtons = (row) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 22,
          color: "#121212",
        }}
        title="Share Property"
        onClick={() => onRequestShare(row)}
      >
        <MdShare />
      </button>
 
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 22,
          color: favorites.includes(row.id) ? "red" : "#121212",
        }}
        title={favorites.includes(row.id) ? "Remove from Favorites" : "Add to Favorites"}
        onClick={() => toggleFavorite(row.id)}
      >
        {favorites.includes(row.id) ? <MdFavorite /> : <MdFavoriteBorder />}
      </button>
    </div>
  );
 
  const detailsColumns = selectedUnit
    ? [
        { label: "Property Type", key: "type" },
        {
          label: "Price",
          key: "price",
          render: (val) => <span style={{ color: "green" }}>{formatAmount(val)}</span>,
        },
        { label: "Area", key: "area" },
        { label: "Facing", key: "facing" },
        { label: "BHK", key: "bhk" },
        { label: "Bath", key: "bath" },
        {
          label: "Details",
          key: "id",
          render: (val) => <a href={`/details/${val}`}>Details</a>,
        },
        {
          label: "Action",
          key: "id",
          render: (_, row) => commonActionButtons(row),
        },
      ]
    : [];
 
  const moreColumns = [
    { label: "Property Type", key: "type" },
    {
      label: "Price",
      key: "price",
      render: (val) => <span style={{ color: "green" }}> {formatAmount(val)}</span>,
    },
    { label: "Area", key: "area" },
    { label: "BHK", key: "bhk" },
    { label: "Bath", key: "bath" },
    {
      label: "Details",
      key: "id",
      render: (val) => <a href={`/details/${val}`}>Details</a>,
    },
    {
      label: "Action",
      key: "id",
      render: (_, row) => commonActionButtons(row),
    },
  ];
 
  const containerStyle = { width: "100%", height: "350px" };
  const center = { lat: data.latitude, lng: data.longitude };
 
  return (
    <div>
      <button
        onClick={onClose}
        style={{
          float: "right",
          cursor: "pointer",
          background: "none",
          border: "none",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        &times;
      </button>
 
      <h2>{data.details.name}</h2>
      <div style={{ color: "#666", display: "flex", alignItems: "center", gap: "6px" }}>
        <MdLocationOn style={{ color: "#777" }} />
        <span>
          {data.details.location}
          {data.details.ZipCode && data.details.ZipCode !== "N/A" ? `,${data.details.ZipCode}` : ""}
        </span>
      </div>
 
      {/* Description Section + Price Range */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginTop: 18,
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 2 }}>
          <h3>Description</h3>
          <div>
            {data.details.description}{" "}
            <a href="#" style={{ textDecoration: "underline" }}>
              Read more
            </a>
          </div>
        </div>
 
        {/* RIGHT SIDE PRICE RANGE DISPLAY */}
        <div
          style={{
            flex: 1,
            textAlign: "right",
            fontWeight: "bold",
            color: "#121212",
            fontSize: 18,
          }}
        >
          Price Range:<br />
          <span style={{ fontSize: 20, color: "#1B5E20" }}>{priceRange} Cr</span>
        </div>
      </div>
 
      {/* Tabs Section */}
      <div style={{ display: "flex", marginTop: 32, marginBottom: 24 ,gap:2}}>
        {detailTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 15px",
                  // borderRadius: 7,
                  fontWeight:activeTab === tab ?600:500,
                  fontSize: "13px",
                  border: "none",
                  backgroundColor: activeTab === tab ? "#fff" : "#f0f0f0",
                  color: activeTab === tab ? "#2c3e50" : "#666",
                  cursor: "pointer",
                  borderBottom:activeTab === tab?"3px solid #2c3e50":"3px solid transparent",
                  transition:"background-color 0.3s ease,color 0.3s ease",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
 
      <div style={{ marginTop: 16}}>
        {activeTab === "Details" && selectedUnit && (
          <Table columns={detailsColumns} paginatedData={[selectedUnit]} rowsPerPage={5} />
        )}
 
        {activeTab === "Facts & Features" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "22px" }}>
            <Card label="Project ID" value={data.facts.projectId} icon={<MdApartment />} />
            <Card label="Project Type" value={data.facts.projectType} icon={<MdOutlineViewDay />} />
            <Card label="Project Status" value={data.facts.status} icon={<MdCheckCircle />} />
            <Card label="Area" value={data.facts.area} icon={<MdStraighten />} />
            <Card label="Bedrooms" value={data.facts.bedrooms} icon={<MdBedroomParent />} />
            <Card label="Bathrooms" value={data.facts.bathrooms} icon={<MdOutlineWc />} />
            <Card label="Facings" value={data.facts.facings} icon={<MdOutlineWaves />} />
            <Card label="Number Of Units" value={data.facts.unitCount} icon={<MdApartment />} />
          </div>
        )}
 
        {activeTab === "Location" && (
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
            <Marker position={center} />
          </GoogleMap>
        )}
 
        {activeTab === "More" && (
          remainingUnits.length > 0 ? (
            <Table columns={moreColumns} paginatedData={remainingUnits} rowsPerPage={10} />
          ) : (
            <div style={{ textAlign: "center", color: "#999", marginTop: 48 }}>
              No additional properties available.
            </div>
          )
        )}
      </div>
    </div>
  );
}
 
function Card({ label, value, icon }) {
  return (
    <div
      style={{
        flex: "1 1 30%",
        padding: 18,
        background: "#fafbfc",
        borderRadius: 8,
        boxShadow: "0 0 3px #eee",
      }}
    >
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontWeight: "bold" }}>{label}</div>
      <div style={{ color: "#444", fontSize: 18 }}>{value}</div>
    </div>
  );
}