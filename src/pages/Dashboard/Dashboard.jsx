 // src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/Navbar.jsx";
import StatsCard from "../../components/StatsCard.jsx";
import ProfileIcon from "../../components/Profile/profileIcon.jsx"; // your theme toggle / small icon
// import ProfileMenu from "../../components/Profile/ProfileMenu.jsx"; // full profile dropdown menu

import {
  MdPendingActions,
  MdPriceChange,
  MdListAlt,
  MdImage,
  MdBusiness,
  MdClose,
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

  // Table states
  const [filters, setFilters] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Menus
  const [showListingMenu, setShowListingMenu] = useState(false);
  const [showCrmMenu, setShowCrmMenu] = useState(false);
  const listingMenuRef = useRef(null);
  const crmMenuRef = useRef(null);

  // anchor refs to position popups where the card is
  const listingCardRef = useRef(null);
  const crmCardRef = useRef(null);

  // dynamic styles for anchored popups
  const [listingMenuStyle, setListingMenuStyle] = useState({});
  const [crmMenuStyle, setCrmMenuStyle] = useState({});

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

  // Click outside for popups (closes menus/popups)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target))
        setShowSignOutPopup(false);
      if (listingMenuRef.current && !listingMenuRef.current.contains(e.target) &&
          listingCardRef.current && !listingCardRef.current.contains(e.target))
        setShowListingMenu(false);
      if (crmMenuRef.current && !crmMenuRef.current.contains(e.target) &&
          crmCardRef.current && !crmCardRef.current.contains(e.target))
        setShowCrmMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const handleCardClick = (route, state = {}) => navigate(route, { state });

  // Listing options
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
      id: "flagged",
      label: "Flagged Listings",
      desc: "Listings flagged for review",
      route: "/FlaggedListings",
    },
    {
      id: "total",
      label: "Total Listings",
      desc: "All listings (projects & properties)",
      route: "/ProjectsDetails",
      state: { defaultTab: "PROPERTIES", fromDashboard: true },
    },
    {
      id: "project",
      label: "Project Data",
      desc: "Project-specific listings",
      route: "/ProjectsDetails",
      state: { defaultTab: "PROJECTS", fromDashboard: true },
    },
    {
      id:"expired",
      label: "Expired Listings",
      desc: "ExpiredListings",
      route: "/ExpiredListings",
    }
  ];

  const openListingRoute = (opt) => {
    setShowListingMenu(false);
    if (opt.state) navigate(opt.route, { state: opt.state });
    else navigate(opt.route);
  };

  // CRM options (only show CRM Data and Lead Management as requested)
  const crmOptions = [
    {
      id: "crm",
      label: "CRM Data",
      desc: "Open CRM Data",
      route: "/CRMData",
    },
    {
      id: "lead",
      label: "Lead Management",
      desc: "Manage CRM leads and performance",
      route: "/LeadManagement",
    },
    {
      id: "Deals",
      label: "Deals Management",
      desc: "Deals Management Module",
      route: "/DealsManagement",
    }
  ];

  const openCrmRoute = (opt) => {
    setShowCrmMenu(false);
    navigate(opt.route);
  };

  // When opening a menu, compute its anchored position to card
  const openListingMenuAnchored = () => {
    if (listingCardRef.current) {
      const rect = listingCardRef.current.getBoundingClientRect();
      setListingMenuStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: 280,
      });
    }
    setShowListingMenu((s) => !s);
  };

  const openCrmMenuAnchored = () => {
    if (crmCardRef.current) {
      const rect = crmCardRef.current.getBoundingClientRect();
      // place popup aligned with the card's right edge if there's space, otherwise left-aligned
     const preferredLeft = rect.left + window.scrollX;
      const fallbackLeft = Math.max(16, window.innerWidth - 600); // avoid overflow
      setCrmMenuStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY + 8,
        left: preferredLeft,
        width: 200,
      });
    }
    setShowCrmMenu((s) => !s);
  };

  // Table filter logic
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

  const agentColumns = [
    { label: "S.No", key: "serialNo" },
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
        <main style={{ flex: 1, padding: "20px 30px" }}>
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
            <button
              onClick={toggleTheme}
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
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: "0",
                    background: theme === "dark" ? "#1f1f1f" : "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    borderRadius: "12px",
                    padding: "10px 15px",
                    width: "200px",
                    color: theme === "dark" ? "#eee" : "#333",
                  }}
                >
                  <h4>{user?.firstName || "Unknown User"}</h4>
                  <p style={{ fontSize: "0.9rem", color: "#777" }}>
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

          {/* Stats Cards */}
          <section className="stats-grid">
            {/* Listings Card (anchor) */}
            <div
              ref={listingCardRef}
              onClick={(e) => {
                e.stopPropagation();
                // compute anchored position & toggle
                openListingMenuAnchored();
                // ensure CRM menu closed
                setShowCrmMenu(false);
              }}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <StatsCard
                title="Listings"
                value={stats.totalListings}
                change="+ aggregated"
                icon={MdListAlt}
                gradient="linear-gradient(90deg, #6c757d, #adb5bd)"
              />
            </div>

            {/* Approval */}
            <div onClick={() => handleCardClick("/approval")}>
              <StatsCard
                title="Waiting For Approval"
                value={stats.awaitingApproval}
                change="+1 this week"
                icon={MdPendingActions}
                gradient="linear-gradient(90deg, #f5365c, #fb6340)"
              />
            </div>

            {/* Price Updates */}
            <div onClick={() => handleCardClick("/updates")}>
              <StatsCard
                title="Price Updates"
                value={stats.priceUpdates}
                change="+3 this week"
                icon={MdPriceChange}
                gradient="linear-gradient(90deg, #344767, #6c757d)"
              />
            </div>

            {/* Order Images */}
            <div onClick={() => handleCardClick("/orderimages")}>
              <StatsCard
                title="Order Images"
                value={stats.orderImages}
                change="+5 this month"
                icon={MdImage}
                gradient="linear-gradient(90deg, #00c6ff, #0072ff)"
              />
            </div>

            {/* CRM Data Card (anchor) */}
            <div
              ref={crmCardRef}
              onClick={(e) => {
                e.stopPropagation();
                openCrmMenuAnchored();
                // ensure listing menu closed
                setShowListingMenu(false);
              }}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <StatsCard
                title="CRM Data"
                value={stats.crmCount}
                change="+2 this week"
                icon={MdBusiness}
                gradient="linear-gradient(90deg, #ff9a9e, #fad0c4)"
              />
            </div>

            {/* Listing popup (anchored) */}
            {showListingMenu && (
              <div
                ref={listingMenuRef}
                style={{
                  ...listingMenuStyle,
                  background: theme === "dark" ? "#1a1a1a" : "#fff",
                  color: theme === "dark" ? "#eee" : "#111",
                  borderRadius: 10,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  padding: 12,
                  zIndex: 9999,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    Listing Options
                  </div>
                  <MdClose
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowListingMenu(false);
                    }}
                  />
                </div>
                {listingOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => openListingRoute(opt)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      cursor: "pointer",
                      marginBottom: 6,
                      background: theme === "dark" ? "#171717" : "#fafafa",
                      border:
                        theme === "dark"
                          ? "1px solid #222"
                          : "1px solid #eee",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: "#777" }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CRM popup (anchored) */}
            {showCrmMenu && (
              <div
                ref={crmMenuRef}
                style={{
                  ...crmMenuStyle,
                  background: theme === "dark" ? "#1a1a1a" : "#fff",
                  color: theme === "dark" ? "#eee" : "#111",
                  borderRadius: 10,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  padding: 12,
                  zIndex: 9999,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15 }}>CRM Options</div>
                  <MdClose
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCrmMenu(false);
                    }}
                  />
                </div>

                {/* ONLY show CRM Data and Lead Management as you asked */}
                {crmOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => openCrmRoute(opt)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: theme === "dark" ? "#171717" : "#fafafa",
                      border: theme === "dark" ? "1px solid #222" : "1px solid #eee",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: "#777" }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            )}
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
            {[{ id: "AgentOverview", label: "Agent Overview" }, { id: "UserFeedback", label: "User Feedback" }].map(
              (tab) => {
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
                      borderBottom: isActive ? "3px solid #2c3e50" : "3px solid transparent",
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                    }}
                  >
                    {tab.label}
                  </button>
                );
              }
            )}
          </div>

          {/* Table */}
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
              clearFilter={clearFilter}
              hasActiveFilter={hasActiveFilter}
              getUniqueValues={getUniqueValues}
              theme={theme}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
