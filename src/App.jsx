 // import the ThemeProvider from ThemeContext.jsx
import { ThemeProvider } from "./theme/ThemeContext.jsx";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Alerts from "./pages/Alerts/Alerts.jsx";
import Buyers from "./pages/Buyers/Buyers.jsx";
import Updates from "./pages/Updates/Updates.jsx";
import Sellers from "./pages/Sellers/Sellers.jsx";
import SocialActivity from "./pages/SocialActivity/SocialActivity.jsx";
import PriceHistory from "./pages/Updates/PriceHistory.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";
import CreateAlert from "./pages/Alerts/CreateAlert.jsx";
import Orderimages from "./pages/Orderimages/Orderimages.jsx";
import AgentDetailsTable from "./pages/SocialActivity/AgentDetailsTable.jsx";
import CRMDATA from "./pages/CRMDATA/CRMData.jsx";
import ProjectDetailsTabComponent from "./pages/SocialActivity/ProjectDetailsTabsComponent.jsx";
import ProjectDetails from "./pages/ProjectManagement/ProjectsDetails.jsx";
import TotalListings from "./pages/TotalListings/TotalListings.jsx";
import ActiveListings from "./pages/ActiveListing/ActiveListings.jsx";
import Approval from "./pages/Approval/Approval.jsx";
import NewListings from "./pages/NewListing/NewListing.jsx";
import ProjectManagement from "./pages/ProjectManagement/ProjectsDetails.jsx";
// import ProfilePage from "./components/Profile/ProfilePage.jsx";
// import SettingsPage from "./components/Profile/SettingsPage.jsx";
// import UserRoleManager from "./components/Profile/UserRoleManager.jsx";

function App() {
  const { bearerToken, loading } = useAuth();

  if (loading) return null;

  return (
    <ThemeProvider>
      {/* ThemeProvider wraps entire app so theme state is global */}
      <Routes>
        <Route
          path="/login"
          element={bearerToken ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/updates" element={<ProtectedRoute><Updates /></ProtectedRoute>} />
        <Route path="/buyers" element={<ProtectedRoute><Buyers /></ProtectedRoute>} />
        <Route path="/sellers" element={<ProtectedRoute><Sellers /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        <Route path="/socialActivity" element={<ProtectedRoute><SocialActivity /></ProtectedRoute>} />
        <Route path="/price-history/:projectID" element={<ProtectedRoute><PriceHistory /></ProtectedRoute>} />
        <Route path="/MainLayout" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
        <Route path="/create-alert" element={<ProtectedRoute><CreateAlert/></ProtectedRoute>} />
        <Route path="/AgentDetailsTable" element={<ProtectedRoute><AgentDetailsTable/></ProtectedRoute>} />
        <Route path="/ProjectDetailsTabComponent" element={<ProtectedRoute><ProjectDetailsTabComponent/></ProtectedRoute>} />
        <Route path="/orderimages" element={<ProtectedRoute><Orderimages/></ProtectedRoute>} />
        <Route path="/CRMData" element={<ProtectedRoute><CRMDATA/></ProtectedRoute>} />
        <Route path="/ProjectsDetails" element={<ProtectedRoute><ProjectDetails/></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={bearerToken ? "/" : "/login"} replace />} />
        <Route path="/activelistings" element={<ProtectedRoute><ActiveListings/></ProtectedRoute>} />
        <Route path="/totallistings" element={<ProtectedRoute><TotalListings/></ProtectedRoute>} />
        <Route path="/approval" element={<ProtectedRoute><Approval/></ProtectedRoute>} />
        <Route path="/newlistings" element={<ProtectedRoute><NewListings/></ProtectedRoute>} />
        <Route path="/projectmanagement" element={<ProtectedRoute><ProjectManagement/></ProtectedRoute>} />
        {/* <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
         <Route path="/settings" element={<ProtectedRoute><SettingsPage/></ProtectedRoute>} />*/}
      </Routes> 
    </ThemeProvider>
  );
}

export default App;
