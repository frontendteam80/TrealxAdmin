 import { useState,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdTableChart, MdNotifications, MdPerson,MdBadge, MdGroup, MdPhoto } from 'react-icons/md';
import './Sidebar.scss';
 
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(()=>{
    const handleResize=()=> {
      if (window.innerWidth <= 768)setCollapsed(true);
      else setCollapsed(false);
    };
    window.addEventListener('resize',handleResize);
    handleResize();
    return () =>window.removeEventListener('resize',handleResize);
  },[]);
 
  return (
    <>
      {/* Hamburger Menu for Mobile */}
      {/* <button className="menu-toggle" onClick={toggleSidebar}>☰</button> */}
     
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <img src="data:image/png;base64,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"alt="Logo" />
        {/* <span className="sidebar-name">TREALX</span> */}
        <nav>
          <NavLink to="/" end><MdDashboard /><span className="nav-label">Dashboard</span></NavLink>
          <NavLink to="/updates"><MdTableChart /> <span className="nav-label">Updates</span></NavLink>
          <NavLink to="/buyers"><MdPerson /> <span className="nav-label">Buyers</span></NavLink>
          <NavLink to="/sellers"><MdPerson /> <span className="nav-label">Sellers</span></NavLink>
          <NavLink to="/alerts"><MdNotifications /> <span className="nav-label">Alerts</span></NavLink>
          <NavLink to="/Socialactivity"><MdGroup/> <span className="nav-label">Social Actvity</span></NavLink>
          <NavLink to="/Orderimages"><MdPhoto/> <span className="nav-label">OrderImages</span></NavLink>
          <NavLink to="/Agentdetails"><MdBadge/><span className="nav-label">CRM Data</span></NavLink>
          <NavLink to="/ProjectsDetails"><MdBadge/><span className="nav-label">Project Management</span></NavLink>
        </nav>
      </aside>
    </>
  );
}
 
 