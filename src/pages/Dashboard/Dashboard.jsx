
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

  // Listing menu states (NEW, inline only)
  const [showListingMenu, setShowListingMenu] = useState(false);
  const listingMenuRef = useRef(null);
  const [previewIndex, setPreviewIndex] = useState(null); // null = not previewing

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

  // Popup click outside (signout)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowSignOutPopup(false);
      }
    };
    if (showSignOutPopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSignOutPopup]);

  // Click-outside handler for listing menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (listingMenuRef.current && !listingMenuRef.current.contains(e.target)) {
        setShowListingMenu(false);
        setPreviewIndex(null);
      }
    };
    if (showListingMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showListingMenu]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const handleCardClick = (route, state = {}) => navigate(route, { state });

  // Listing options (keeps your routes unchanged)
  const listingOptions = [
    {
      id: "active",
      label: "Active Listings",
      desc: "View all currently active listings",
      route: "/activelistings",
    },
    {
      id: "new",
      label: "New Listings",
      desc: "Recently added properties this week",
      route: "/newlistings",
    },
    {
      id: "total",
      label: "Total Listings",
      desc: "All listings (projects & properties)",
      route: "/ProjectsDetails",
      state: { defaultTab: "PROPERTIES", fromDashboard: true }, // <-- changed to PROPERTIES (uppercase)
    },
    {
      id: "project",
      label: "Project Data",
      desc: "Project-specific listings & details",
      route: "/ProjectsDetails", // <-- changed to open ProjectsDetails since you said Projectmanagement.jsx doesn't exist
      state: { defaultTab: "PROJECTS", fromDashboard: true }, // <-- set PROJECTS
    },
  ];

  const openListingRoute = (opt) => {
    setShowListingMenu(false);
    setPreviewIndex(null);
    if (opt.state) navigate(opt.route, { state: opt.state });
    else navigate(opt.route);
  };

  // Preview controls: next / previous
  const previewNext = () => {
    if (previewIndex === null) setPreviewIndex(0);
    else setPreviewIndex((i) => (i + 1) % listingOptions.length);
  };
  const previewPrev = () => {
    if (previewIndex === null) setPreviewIndex(0);
    else setPreviewIndex((i) => (i - 1 + listingOptions.length) % listingOptions.length);
  };

  // ---------- Table Helpers ----------
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
          //  marginLeft: "180px",
           // overflowX: "hidden",
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
          <section className="stats-grid" style={{ position: "relative" }}>
            {/* Single Listings Card (replaces Active/New/Total/Project cards) */}
            <div
              style={{ position: "relative", cursor: "pointer", width: "100%" }}
              onClick={() => {
                setShowListingMenu((s) => !s);
                setPreviewIndex(null);
              }}
            >
              <StatsCard
                title="Listings"
                value={stats.totalListings}
                change="+ aggregated"
                icon={MdListAlt}
                gradient="linear-gradient(90deg, #6c757d, #adb5bd)"
              />

              {/* Dropdown Panel anchored to the Listings card */}
              {showListingMenu && (
                <div
                  ref={listingMenuRef}
                  style={{
                    position: "absolute",
                    top: "110px",
                    left: 0,
                    minWidth: 300,
                    maxWidth: 420,
                    background: theme === "dark" ? "#1a1a1a" : "#fff",
                    color: theme === "dark" ? "#eee" : "#111",
                    borderRadius: 12,
                    boxShadow: "0 8px 30px rgba(2,6,23,0.2)",
                    padding: 16,
                    zIndex: 9999,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Listing Options</div>
                    <div style={{ fontSize: 13, color: theme === "dark" ? "#bbb" : "#666" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewIndex(0); }}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(0,0,0,0.06)",
                          padding: "6px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Menu content: either list of options or preview box */}
                  {previewIndex === null ? (
                    <div style={{ display: "grid", gap: 8 }}>
                      {listingOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => openListingRoute(opt)}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            display: "flex",
                            flexDirection: "column",
                            cursor: "pointer",
                            background: theme === "dark" ? "#171717" : "#fbfbfb",
                            border: theme === "dark" ? "1px solid #222" : "1px solid #f0f0f0",
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{opt.label}</div>
                          <div style={{ fontSize: 13, color: theme === "dark" ? "#bfbfbf" : "#666" }}>{opt.desc}</div>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowListingMenu(false); }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: theme === "dark" ? "#ddd" : "#444"
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Preview card (one-by-one flow)
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>
                        {listingOptions[previewIndex].label}
                      </div>
                      <div style={{ color: theme === "dark" ? "#ccc" : "#666" }}>
                        {listingOptions[previewIndex].desc}
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); openListingRoute(listingOptions[previewIndex]); }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "none",
                            background: "linear-gradient(90deg,#5e72e4,#825ee4)",
                            color: "#fff",
                            fontWeight: 700,
                            flex: 1,
                          }}
                        >
                          Open
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); previewPrev(); }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "1px solid rgba(0,0,0,0.08)",
                            background: "transparent",
                            flex: 1,
                          }}
                        >
                          Previous
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); previewNext(); }}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "1px solid rgba(0,0,0,0.08)",
                            background: "transparent",
                            flex: 1,
                          }}
                        >
                          Next
                        </button>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPreviewIndex(null); }}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: theme === "dark" ? "#ddd" : "#444",
                          }}
                        >
                          Back to list
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Remaining stat cards (unchanged) */}
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
