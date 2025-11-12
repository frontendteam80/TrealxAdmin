
// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/Navbar.jsx";
import StatsCard from "../../components/StatsCard.jsx";
import ProfileIcon from "../../components/Profile/profileIcon.jsx"; // your theme toggle / small icon
// import ProfileMenu from "../../components/Profile/ProfileMenu.jsx"; // full profile dropdown menu

import {
  MdHome,
  MdNewReleases,
  MdPendingActions,
  MdPriceChange,
  MdListAlt,
  MdImage,
  MdBusiness,
} from "react-icons/md";

import { useApi } from "../../API/Api.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Table, { Pagination } from "../../Utils/Table.jsx";
import "../Dashboard/Dashboard.scss";

export default function Dashboard() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "light"
  );
  const [activeTab, setActiveTab] = useState("AgentOverview");
  const [stats, setStats] = useState({});
  const [agentData, setAgentData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const popupRef = useRef(null);
  const { fetchData } = useApi();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const calledOnce = useRef(false);

  // Global table states
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Theme
  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch Dashboard Data
  useEffect(() => {
    if (calledOnce.current) return;
    calledOnce.current = true;

    async function loadDashboardData() {
      try {
        const [dashboardSummary, agentOverview, userFeedback] = await Promise.all([
          fetchData("DashboardSummary"),
          fetchData("AgentPanel"),
          fetchData("UserFeedback"),
        ]);

        const data = Array.isArray(dashboardSummary) ? dashboardSummary[0] || {} : {};
        setStats({
          activeListings: Number(data.ActiveListing || 0).toLocaleString(),
          newListings: Number(data.PropertyAddedThisWeek || 0).toLocaleString(),
          awaitingApproval: Number(data.VerificationList || 0).toLocaleString(),
          priceUpdates: Number(data.PriceUpdateCount || 0).toLocaleString(),
          totalListings: Number(data.TotalListings || 0).toLocaleString(),
          orderImages: Number(data.CountOfProjectsThatHaveImages || 0).toLocaleString(),
          crmCount: Number(data.CRMCount || 0).toLocaleString(),
          projectData: Number(data.ProjectData || 0).toLocaleString(),
          propertyData: Number(data.PropertyData || 0).toLocaleString(),
        });

        setAgentData(
          Array.isArray(agentOverview)
            ? agentOverview.map((a, i) => ({ serialNo: i + 1, ...a }))
            : []
        );
        setFeedbackData(
          Array.isArray(userFeedback)
            ? userFeedback.map((f, i) => ({ serialNo: i + 1, ...f }))
            : []
        );
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      }
    }
    loadDashboardData();
  }, [fetchData]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const handleCardClick = (route, state = {}) => navigate(route, { state });

  // Table Helpers
  const toggleFilter = (key) =>
    setOpenFilter((prev) => (prev === key ? null : key));

  const handleCheckboxChange = (columnKey, value) => {
    setFilters((prev) => {
      const existing = prev[columnKey] || [];
      return existing.includes(value)
        ? { ...prev, [columnKey]: existing.filter((v) => v !== value) }
        : { ...prev, [columnKey]: [...existing, value] };
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

  const hasActiveFilter = (key) => filters[key]?.length > 0;

  const getUniqueValues = (data, key) =>
    [...new Set(data.map((i) => i[key]).filter(Boolean))];

  const activeData = activeTab === "AgentOverview" ? agentData : feedbackData;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return activeData.slice(start, start + rowsPerPage);
  }, [activeData, page]);

  const totalPages = Math.ceil(activeData.length / rowsPerPage);

  // Columns
  const agentColumns = [
    { label: "S.No", key: "serialNo", canFilter: false },
    { label: "Agent Name", key: "AgentName" },
    { label: "Total Listings", key: "TotalListings" },
    { label: "Avg Listing Time", key: "AvgListingTime" },
    { label: "Approval Rate", key: "ApprovalRate" },
    { label: "Active Listings", key: "ActiveListings" },
    { label: "Inactive Listings", key: "InActiveListings" },
  ];

  const feedbackColumns = [
    { key: "serialNo", label: "S.No" },
    { key: "AgentName", label: "Agent Name" },
    { key: "AverageRatings", label: "Average Ratings" },
    { key: "Complaints", label: "Complaints" },
    { key: "AgentResponseTime", label: "Agent Response Time" },
  ];

  const columns = activeTab === "AgentOverview" ? agentColumns : feedbackColumns;

  return (
    <div className={`dashboard-container ${theme}`}>
      <div className="dashboard">
        <Sidebar theme={theme} />
        <main
          style={{
            flex: 1,
            padding: "20px 30px",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Navbar />

          {/* Profile Icon + Profile Menu: top-right */}
          <div
            style={{
              position: "fixed",
              top: 20,
              right: 25,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* existing theme toggle/simple profile icon */}
             {/* <ProfileIcon currentTheme={theme} onToggleTheme={toggleTheme} />  */}

            {/* full profile menu (User & Role, Property Management, Platform Settings) */}
            <ProfileIcon
              user={user || {}}
              cureentTheme={theme}
              onToggleTheme={toggleTheme}
              onNavigate={(path, state) => {
                // Normalize navigation signature: allow (path) or (path, state)
                if (state && typeof state === "object" && state.hasOwnProperty("state")) {
                  navigate(path, state);
                } else {
                  navigate(path, { state });
                }
              }}
              onOpenSection={(id) => {
                // Called when a specific section item is clicked
                // You can replace this with modal toggles or analytics
                console.log("Profile menu open section:", id);
              }}
              onSignOut={() => {
                // call your existing logout from auth context then route to login
                try {
                  logout();
                } catch (e) {
                  console.warn("Logout failed:", e);
                }
                navigate("/login");
              }}
            />
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
            <div
              onClick={() =>
                handleCardClick("/ProjectsDetails", {
                  defaultTab: "properties",
                  fromDashboard: true,
                })
              }
            >
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
            <div
              onClick={() =>
                handleCardClick("/Projectmanagement", {
                  defaultTab: "projects",
                  fromDashboard: true,
                })
              }
            >
              <StatsCard
                title="Project Data"
                value={stats.projectData || 0}
                change="+3 this week"
                icon={MdBusiness}
                gradient="linear-gradient(90deg, #bf75ff, #c77eff)"
              />
            </div>
          </section>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              paddingBottom: 15,
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            {[
              { id: "AgentOverview", label: "Agent Overview" },
              { id: "UserFeedback", label: "User Feedback" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
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
                    borderBottom: isActive
                      ? "3px solid #2c3e50"
                      : "3px solid transparent",
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Table Section (Agent + Feedback use same component) */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Table
              columns={columns}
              paginatedData={paginatedData}
              filters={filters}
              openFilter={openFilter}
              toggleFilter={toggleFilter}
              handleCheckboxChange={handleCheckboxChange}
              uniqueValues={(key) => getUniqueValues(activeData, key)}
              clearFilter={clearFilter}
              hasActiveFilter={hasActiveFilter}
              applyFilter={() => setOpenFilter(null)}
            />

            {totalPages > 1 && (
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
