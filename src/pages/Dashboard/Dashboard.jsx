 import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/Navbar.jsx";
import StatsCard from "../../components/StatsCard.jsx";
import Table from "../../Utils/Table.jsx";
import {
  MdHome,
  MdNewReleases,
  MdPendingActions,
  MdPriceChange,
  MdListAlt,
  MdLogout,
  MdImage,
  MdBusiness,
} from "react-icons/md";
import { FiSun, FiMoon } from "react-icons/fi";
import { useApi } from "../../API/Api.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../Dashboard/Dashboard.scss";

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

  const [theme, setTheme] = useState(() =>
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );

  useEffect(() => {
    if (calledOnce.current) return;
    calledOnce.current = true;

    async function loadDashboardData() {
      try {
        const [dashboardSummary, agentOverview, userFeedback] = await Promise.all([
          fetchData("DashboardSummary"),
          fetchData("AgentPanel"),
          fetchData("UserFeedBack"),
        ]);

        const data = dashboardSummary?.[0] || {};
        setStats({
          activeListings: Number(data.ActiveListing || 0).toLocaleString(),
          newListings: Number(data.PropertyAddedThisWeek || 0).toLocaleString(),
          awaitingApproval: Number(data.VerificationList || 0).toLocaleString(),
          priceUpdates: Number(data.PriceUpdateCount || 0).toLocaleString(),
          totalListings: Number(data.TotalListings || 0).toLocaleString(),
          orderImages: Number(data.CountOfProjectsThatHaveImages || 0).toLocaleString(),
          crmCount: Number(data.CRMCount || 0).toLocaleString(),
          projectData: Number(data.ProjectData || 0).toLocaleString(), // 🆕
          propertyData: Number(data.PropertyData || 0).toLocaleString(), // 🆕
        });

        setAgentData(agentOverview || []);
        setFeedbackData(userFeedback || []);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      }
    }

    loadDashboardData();
  }, [fetchData]);

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

          {/* Theme toggle + logout */}
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
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
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

              {showSignOutPopup && (
                <div
                  ref={popupRef}
                  className="signout-popup"
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: "0",
                    background: theme === "dark" ? "#1f1f1f" : "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    borderRadius: "12px",
                    padding: "15px 20px",
                    width: "250px",
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
                      background: "linear-gradient(90deg,#f5365c,#fb6340)",
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

          {/* 📊 Stats Cards Section */}
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
                title="New Listings"
                value={stats.newListings}
                change="+2 this week"
                icon={MdNewReleases}
                gradient="linear-gradient(90deg, #2dce89, #11cdef)"
              />
            </div>

            <div onClick={() => handleCardClick("/approval")}>
              <StatsCard
                title="Waiting For Approval"
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

            <div onClick={() => handleCardClick("/orderimages")}>
              <StatsCard
                title="Order Images"
                value={stats.orderImages}
                change="+5 this month"
                icon={MdImage}
                gradient="linear-gradient(90deg, #00c6ff, #0072ff)"
              />
            </div>

            <div onClick={() => handleCardClick("/crmdata")}>
              <StatsCard
                title="CRM Data"
                value={stats.crmCount}
                change="+2 this week"
                icon={MdBusiness}
                gradient="linear-gradient(90deg, #ff9a9e, #fad0c4)"
              />
            </div>

            {/* 🆕 New Stats Cards */}
            <div onClick={() => handleCardClick("/Projectmanagement")}>
              <StatsCard
                title="Project Data"
                value={stats.projectData || 0}
                change="+3 this week"
                icon={MdBusiness}
                gradient="linear-gradient(90deg, #bf75ffff, #c77effff)"
              />
            </div>

            <div onClick={() => handleCardClick("/Projectmanagement")}>
              <StatsCard
                title="Property Data"
                value={stats.propertyData || 0}
                change="+4 this week"
                icon={MdHome}
                gradient="linear-gradient(90deg, #42e695, #3bb2b8)"
              />
            </div>
          </section>

          {/* Tabs Section */}
          <div className="tabs-container">
            <div
              className={`tab ${activeTab === "AgentOverview" ? "active" : ""}`}
              onClick={() => setActiveTab("AgentOverview")}
            >
              Agent Overview
            </div>
            <div
              className={`tab ${activeTab === "UserFeedback" ? "active" : ""}`}
              onClick={() => setActiveTab("UserFeedback")}
            >
              User Feedback
            </div>
          </div>

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
