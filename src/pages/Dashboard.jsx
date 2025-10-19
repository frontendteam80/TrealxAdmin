//  import { useState, useEffect, useRef } from "react";
// import Sidebar from "../components/Sidebar.jsx";
// import Navbar from "../components/Navbar.jsx";
// import StatsCard from "../components/StatsCard.jsx";
// import ChartCard from "../components/ChartCard.jsx";
// import Table from "../components/Table.jsx";
// import {
//   listingDensity,
//   priceTrends,
//   demandHotspots,
// } from "../data/chartData.js";
// import {
//   MdHome,
//   MdNewReleases,
//   MdPendingActions,
//   MdPriceChange,
//   MdListAlt,
//   MdLogout,
// } from "react-icons/md";
// import { FiSun, FiMoon } from "react-icons/fi";
// import { useApi } from "../API/Api.js";
// import { useAuth } from "../auth/AuthContext"; // ✅ import auth context
// import "../pages/Dashboard.scss";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("AgentOverview");
//   const [stats, setStats] = useState({});
//   const [agentData, setAgentData] = useState([]);
//   const [feedbackData, setFeedbackData] = useState([]);
//   const [showSignOutModal, setShowSignOutModal] = useState(false); // ✅ modal toggle
//   const calledOnce = useRef(false);
//   const { fetchData } = useApi();
//   const { user, logout } = useAuth(); // ✅ get user and logout from context

//   // Theme
//   const [theme, setTheme] = useState(() => {
//     if (typeof window !== "undefined") {
//       return document.body.classList.contains("dark-theme")
//         ? "dark"
//         : "light";
//     }
//     return "light";
//   });

//   // Fetch dashboard data
//   useEffect(() => {
//     if (calledOnce.current) return;
//     calledOnce.current = true;

//     async function loadDashboardData() {
//       try {
//         const [
//           activeListings,
//           newListings,
//           awaitingApproval,
//           priceUpdates,
//           totalListings,
//           agentOverview,
//           userFeedback,
//         ] = await Promise.all([
//           fetchData("ListingCount"),
//           fetchData("AgentTodayListings"),
//           fetchData("VerificationList"),
//           fetchData("PriceUpdateCount"),
//           fetchData("TotalListings"),
//           fetchData("AgentPanel"),
//           fetchData("UserFeedBack"),
//         ]);

//         setStats({
//           activeListings: Number(
//             activeListings?.[0]?.ActiveListings || 0
//           ).toLocaleString(),
//           newListings: Number(
//             newListings?.[0]?.AgentTodayListingsCount || 0
//           ).toLocaleString(),
//           awaitingApproval: Number(
//             awaitingApproval?.[0]?.VerificationList || 0
//           ).toLocaleString(),
//           priceUpdates: Number(
//             priceUpdates?.[0]?.PriceUpdateCount || 0
//           ).toLocaleString(),
//           totalListings: Number(
//             totalListings?.[0]?.TotalListings || 0
//           ).toLocaleString(),
//         });

//         setAgentData(agentOverview || []);
//         setFeedbackData(userFeedback || []);
//       } catch (err) {
//         console.error("Dashboard data fetch failed:", err);
//       }
//     }
//     loadDashboardData();
//   }, [fetchData]);

//   // Theme effect
//   useEffect(() => {
//     if (theme === "dark") {
//       document.body.classList.add("dark-theme");
//     } else {
//       document.body.classList.remove("dark-theme");
//     }
//   }, [theme]);

//   const toggleTheme = () =>
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));

//   const handleConfirmSignOut = () => {
//     logout();
//     setShowSignOutModal(false);
//     window.location.href = "/login"; // ✅ redirect after logout
//   };

//   return (
//     <div className="dashboard-container">
//     <div className="dashboard">
//       {/* <div className="dashboard-container" style={{display:"flex"}}> */}
//       <Sidebar />
//       <div className="buyers-content">
//       <main>
//         <Navbar />

//         {/* --- Top Right Controls --- */}
//         <div
//           style={{
//             position: "fixed",
//             top: 20,
//             right: 20,
//             zIndex: 9999,
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//           }}
//         >
//           {/* User Info */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               padding: "6px 12px",
//               borderRadius: "6px",
//               backgroundColor: theme === "dark" ? "#333" : "#eee",
//               color: theme === "dark" ? "#fff" : "#000",
//               fontSize: "0.9rem",
//             }}
//           >
//             {user?.firstName || "User"}
//           </div>

//           {/* Sign Out */}
//           <button
//             onClick={() => setShowSignOutModal(true)} // ✅ opens modal
//             title="Sign Out"
//             style={{
//               background: "transparent",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "1.8rem",
//               color: "inherit",
//             }}
//           >
//             <MdLogout />
//           </button>

//           {/* Theme toggle */}
//           <button
//             onClick={toggleTheme}
//             title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
//             style={{
//               fontSize: "1.8rem",
//               cursor: "pointer",
//               background: "transparent",
//               border: "none",
//               color: "inherit",
//             }}
//           >
//             {theme === "dark" ? <FiSun /> : <FiMoon />}
//           </button>
//         </div>

//         {/* --- Signout Modal --- */}
//         {showSignOutModal && (
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: "rgba(0,0,0,0.5)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 10000,
//             }}
//           >
//             <div
//               style={{
//                 background: theme === "dark" ? "#222" : "#fff",
//                 color: theme === "dark" ? "#fff" : "#000",
//                 padding: "20px 30px",
//                 borderRadius: "10px",
//                 textAlign: "center",
//                 boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
//                 width: "320px",
//               }}
//             >
//               <h3>Confirm Sign Out</h3>
//               <p style={{ marginTop: "10px" }}>
//                 You are logged in as:
//                 <br />
//                 <strong>{user?.firstName || "Unknown User"}</strong>
//                 <br />
//                 <span style={{ fontSize: "0.9rem", color: "#888" }}>
//                   {user?.email || "No email available"}
//                 </span>
//               </p>

//               <div
//                 style={{
//                   marginTop: "20px",
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: "10px",
//                 }}
//               >
//                 <button
//                   onClick={handleConfirmSignOut}
//                   style={{
//                     backgroundColor: "#e63946",
//                     color: "#fff",
//                     border: "none",
//                     padding: "8px 14px",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Sign Out
//                 </button>
//                 <button
//                   onClick={() => setShowSignOutModal(false)}
//                   style={{
//                     backgroundColor: "#6c757d",
//                     color: "#fff",
//                     border: "none",
//                     padding: "8px 14px",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats */}
//         <section className="stats-grid">
//           <StatsCard
//             title="Active Listings"
//             value={stats.activeListings}
//             change="+12% this month"
//             icon={MdHome}
//             gradient="linear-gradient(90deg, #5e72e4, #825ee4)"
//           />
//           <StatsCard
//             title="New Listings Today"
//             value={stats.newListings}
//             change="+2 this week"
//             icon={MdNewReleases}
//             gradient="linear-gradient(90deg, #2dce89, #11cdef)"
//           />
//           <StatsCard
//             title="Awaiting Approval"
//             value={stats.awaitingApproval}
//             change="+1 this week"
//             icon={MdPendingActions}
//             gradient="linear-gradient(90deg, #f5365c, #fb6340)"
//           />
//           <StatsCard
//             title="Price Updates"
//             value={stats.priceUpdates}
//             change="+3 this week"
//             icon={MdPriceChange}
//             gradient="linear-gradient(90deg, #344767, #6c757d)"
//           />
//           <StatsCard
//             title="Total Listings"
//             value={stats.totalListings}
//             change="+6% overall"
//             icon={MdListAlt}
//             gradient="linear-gradient(90deg, #6c757d, #adb5bd)"
//           />
//         </section>

//         {/* Charts */}
//         <section className="charts-grid">
//           <ChartCard
//             type="bar"
//             title="Listing Density"
//             dataPoints={listingDensity}
//             color="#5e72e4"
//           />
//           <ChartCard
//             type="line"
//             title="Price Trends"
//             dataPoints={priceTrends}
//             color="#2dce89"
//           />
//           <ChartCard
//             type="line"
//             title="Demand Hotspots"
//             dataPoints={demandHotspots}
//             color="#344767"
//           />
//         </section>

//         {/* Tabs */}
//         <div className="tabs-container">
//           <div
//             className={`tab ${
//               activeTab === "AgentOverview" ? "active" : ""
//             }`}
//             onClick={() => setActiveTab("AgentOverview")}
//           >
//             Agent Overview
//           </div>
//           <div
//             className={`tab ${
//               activeTab === "UserFeedback" ? "active" : ""
//             }`}
//             onClick={() => setActiveTab("UserFeedback")}
//           >
//             User Feedback
//           </div>
//         </div>

//         {/* Table */}
//         <div className="table-wrapper">
//           {activeTab === "AgentOverview" ? (
//             agentData?.length > 0 ? (
//               <Table data={agentData} />
//             ) : (
//               <p className="no-data">No agent data available</p>
//             )
//           ) : feedbackData?.length > 0 ? (
//             <Table data={feedbackData} />
//           ) : (
//             <p className="no-data">No feedback data available</p>
//           )}
//         </div>
        
//       </main>
//     </div>
//     </div> 
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import StatsCard from "../components/StatsCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import Table from "../components/Table.jsx";
import {
  listingDensity,
  priceTrends,
  demandHotspots,
} from "../data/chartData.js";
import {
  MdHome,
  MdNewReleases,
  MdPendingActions,
  MdPriceChange,
  MdListAlt,
  MdLogout,
} from "react-icons/md";
import { FiSun, FiMoon } from "react-icons/fi";
import { useApi } from "../API/Api.js";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../pages/Dashboard.scss";
 
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("AgentOverview");
  const [stats, setStats] = useState({});
  const [agentData, setAgentData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const popupRef = useRef(null);
  const { fetchData } = useApi();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const calledOnce = useRef(false);
 
  const [theme, setTheme] = useState(() => {
    return document.body.classList.contains("dark-theme")
      ? "dark"
      : "light";
  });
 
  useEffect(() => {
    if (calledOnce.current) return;
    calledOnce.current = true;
 
    async function loadDashboardData() {
      try {
        const [
          activeListings,
          newListings,
          awaitingApproval,
          priceUpdates,
          totalListings,
          agentOverview,
          userFeedback,
        ] = await Promise.all([
          fetchData("ListingCount"),
          fetchData("AgentTodayListings"),
          fetchData("VerificationList"),
          fetchData("PriceUpdateCount"),
          fetchData("TotalListings"),
          fetchData("AgentPanel"),
          fetchData("UserFeedBack"),
        ]);
 
        setStats({
          activeListings: Number(
            activeListings?.[0]?.ActiveListings || 0
          ).toLocaleString(),
          newListings: Number(
            newListings?.[0]?.AgentTodayListingsCount || 0
          ).toLocaleString(),
          awaitingApproval: Number(
            awaitingApproval?.[0]?.VerificationList || 0
          ).toLocaleString(),
          priceUpdates: Number(
            priceUpdates?.[0]?.PriceUpdateCount || 0
          ).toLocaleString(),
          totalListings: Number(
            totalListings?.[0]?.TotalListings || 0
          ).toLocaleString(),
        });
        setAgentData(agentOverview || []);
        setFeedbackData(userFeedback || []);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      }
    }
    loadDashboardData();
  }, [fetchData]);
 
  // close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowSignOutPopup(false);
      }
    };
    if (showSignOutPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSignOutPopup]);
 
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    document.body.classList.toggle("dark-theme");
  };
 
  const handleSignOut = () => {
    logout();
    navigate("/login");
  };
 
  const handleCardClick = (route) => {
    navigate(route);
  };
 
  return (
    <div className="dashboard-container">
    <div className="dashboard">
      <Sidebar />
      <main>
        <Navbar />
 
        {/* Floating Controls */}
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 25,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <button
            onClick={toggleTheme}
            title={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } mode`}
            style={{
              fontSize: "1.8rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
 
          {/* Sign Out Icon */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowSignOutPopup((p) => !p)}
              aria-label="Sign out"
              title="Sign Out"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1.8rem",
                color: "inherit",
              }}
            >
              <MdLogout />
            </button>
 
            {/* Popup */}
            {showSignOutPopup && (
              <div
                ref={popupRef}
                className="signout-popup"
                style={{
                  position: "absolute",
                  top: "45px",
                  right: "0",
                  background:
                    theme === "dark" ? "#1f1f1f" : "#fff",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "12px",
                  padding: "15px 20px",
                  width: "250px",
                  animation: "slideInRight 0.3s ease",
                  color: theme === "dark" ? "#eee" : "#333",
                }}
              >
                <h4 style={{ marginBottom: "8px", fontSize: "1rem" }}>
                  {user?.firstName || "Unknown User"}
                </h4>
                <p
                  style={{
                    marginBottom: "15px",
                    fontSize: "0.9rem",
                    color: theme === "dark" ? "#ccc" : "#555",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.email || "No email found"}
                </p>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: "100%",
                    padding: "8px 0",
                    background:
                      "linear-gradient(90deg,#f5365c,#fb6340)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
 
        {/* Stats Cards */}
        <section className="stats-grid">
          <div onClick={() => handleCardClick("/activelistings")}>
            <StatsCard
              title="Active Listings"
              value={stats.activeListings}
              change="+12% this month"
              icon={MdHome}
              gradient="linear-gradient(90deg, #5e72e4, #825ee4)"
            />
          </div>
          <div onClick={() => handleCardClick("/newlistings")}>
            <StatsCard
              title="New Listings Today"
              value={stats.newListings}
              change="+2 this week"
              icon={MdNewReleases}
              gradient="linear-gradient(90deg, #2dce89, #11cdef)"
            />
          </div>
          <div onClick={() => handleCardClick("/verification")}>
            <StatsCard
              title="Awaiting Approval"
              value={stats.awaitingApproval}
              change="+1 this week"
              icon={MdPendingActions}
              gradient="linear-gradient(90deg, #f5365c, #fb6340)"
            />
          </div>
          <div onClick={() => handleCardClick("/updates")}>
            <StatsCard
              title="Price Updates"
              value={stats.priceUpdates}
              change="+3 this week"
              icon={MdPriceChange}
              gradient="linear-gradient(90deg, #344767, #6c757d)"
            />
          </div>
          <div onClick={() => handleCardClick("/totallistings")}>
            <StatsCard
              title="Total Listings"
              value={stats.totalListings}
              change="+6% overall"
              icon={MdListAlt}
              gradient="linear-gradient(90deg, #6c757d, #adb5bd)"
            />
          </div>
        </section>
 
        {/* Charts */}
        <section className="charts-grid">
          <ChartCard
            type="bar"
            title="Listing Density"
            dataPoints={listingDensity}
            color="#5e72e4"
          />
          <ChartCard
            type="line"
            title="Price Trends"
            dataPoints={priceTrends}
            color="#2dce89"
          />
          <ChartCard
            type="line"
            title="Demand Hotspots"
            dataPoints={demandHotspots}
            color="#344767"
          />
        </section>
 
        {/* Tabs */}
        <div className="tabs-container">
          <div
            className={`tab ${
              activeTab === "AgentOverview" ? "active" : ""
            }`}
            onClick={() => setActiveTab("AgentOverview")}
          >
            Agent Overview
          </div>
          <div
            className={`tab ${
              activeTab === "UserFeedback" ? "active" : ""
            }`}
            onClick={() => setActiveTab("UserFeedback")}
          >
            User Feedback
          </div>
        </div>
 
        {/* Table */}
        <div className="table-wrapper">
          {activeTab === "AgentOverview" &&
            (agentData.length > 0 ? (
              <Table data={agentData} />
            ) : (
              <p className="no-data">No agent data available</p>
            ))}
          {activeTab === "UserFeedback" &&
            (feedbackData.length > 0 ? (
              <Table data={feedbackData} />
            ) : (
              <p className="no-data">No feedback data available</p>
            ))}
        </div>
      </main>
    </div>
    </div>
  );
}
 