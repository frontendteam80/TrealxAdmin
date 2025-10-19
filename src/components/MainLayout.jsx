// src/layout/MainLayout.jsx
import Sidebar from '../components/Sidebar.jsx';
import '../styles/layout.scss';

export default function MainLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}