// ProfileIcon.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MdPerson,
  MdLock,
  MdSettings,
  MdExitToApp,
  MdLanguage,
  MdBrush,
  MdShare,
  MdNotifications,
} from "react-icons/md";

// Use relative import without extension (Vite resolves .jsx)
import PersonalInformation from "./PersonalInformation.jsx";

export default function ProfileIcon({
  user = {},
  currentTheme = "light",
  onToggleTheme = () => {},
  onNavigate = () => {},
  onSignOut = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const btnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 360 });

  const displayName =
    user?.name || user?.firstName || user?.email?.split?.("@")?.[0] || "User";
  const initials = (displayName || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatar = user?.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt="avatar"
      style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
    />
  ) : (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        color: "#121212",
      }}
    >
      {initials}
    </div>
  );

  // --- Positioning logic
  useEffect(() => {
    function updatePosition() {
      const btn = btnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const menuWidth = 360;
      const margin = 8;
      const top = rect.bottom + margin;
      const left = Math.min(
        window.innerWidth - menuWidth - margin,
        Math.max(margin, rect.right - menuWidth)
      );
      setMenuPos({ top, left, width: menuWidth });
    }
    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  // --- Close on click outside or ESC
  useEffect(() => {
    function handleClick(e) {
      const btn = btnRef.current;
      const menuEl = document.getElementById("profile-menu-portal");
      if (
        menuEl &&
        !menuEl.contains(e.target) &&
        btn &&
        !btn.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const MenuRow = ({ icon, label, onClick, subtle = false }) => (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: "8px 10px",
        borderRadius: 8,
        width: "100%",
        background: "transparent",
        border: "none",
        textAlign: "left",
        cursor: "pointer",
        color: subtle ? "#444" : "#222",
        fontSize: 13,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );

  // --- Menu dropdown (portal)
  const menuContent = (
    <div
      id="profile-menu-portal"
      style={{
        position: "fixed",
        top: menuPos.top,
        left: menuPos.left,
        width: menuPos.width,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        zIndex: 999999,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
      }}
    >
      {/* Scroll container */}
      <div
        style={{
          overflowY: "auto",
          padding: 12,
          flex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {avatar}
            <div>
              <div style={{ fontWeight: 700 }}>{displayName}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{user?.email || ""}</div>
              {user?.role && (
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                  {String(user.role).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div style={{ padding: "8px 4px", marginBottom: 8 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              color: "#666",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Account
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <MenuRow
              icon={<MdPerson />}
              label="Personal Information"
              onClick={() => {
                setOpen(false);
                // Open the in-place Personal Information popup (instead of navigate)
                setShowProfilePopup(true);
              }}
            />
            {/* <div style={{ marginLeft: 6 }}>
              <MenuRow
                icon={<MdLock />}
                label="Security & Password"
                subtle
                onClick={() => {
                  setOpen(false);
                  onNavigate("/profile/security");
                }}
              />
            </div> */}
          </div>
        </div>

        {/* Settings Section */}
        <div style={{ padding: "8px 4px", marginBottom: 8 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              color: "#666",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Settings
          </div>

          {/* only showing Notifications for now */}
          <div style={{ display: "grid", gap: 6 }}>
            <MenuRow
              icon={<MdNotifications />}
              label="Notification Preferences"
              onClick={() => {
                setOpen(false);
                onNavigate("/admin/settings/notifications");
              }}
            />
          </div>
        </div>

        {/* Admin */}
        {String(user?.role || "").toLowerCase() === "admin" && (
          <div style={{ padding: "8px 4px", marginBottom: 8 }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                color: "#666",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Admin
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <MenuRow
                icon={<MdSettings />}
                label="Manage Users"
                onClick={() => {
                  setOpen(false);
                  onNavigate("/admin/users");
                }}
              />
              <MenuRow
                icon={<MdSettings />}
                label="Assign Roles & Permissions"
                onClick={() => {
                  setOpen(false);
                  onNavigate("/admin/roles");
                }}
              />
              <MenuRow
                icon={<MdSettings />}
                label="Manage Properties"
                onClick={() => {
                  setOpen(false);
                  onNavigate("/admin/properties");
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #eee",
          padding: "8px 12px",
          fontSize: 12,
          color: "#666",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            setOpen(false);
            onSignOut();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "none",
            color: "#e74c3c",
            cursor: "pointer",
          }}
        >
          <MdExitToApp /> Sign Out
        </button>
        <div style={{ fontFamily: "monospace" }}>v1.0.0</div>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 18,
            padding: 6,
          }}
        >
          {currentTheme === "dark" ? "🌙" : "☀️"}
        </button>

        <button
          ref={btnRef}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 999,
            padding: "6px 10px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          {avatar}
        </button>
      </div>

      {open && createPortal(menuContent, document.body)}

      {/* Personal Information popup (portal/modal) */}
      {showProfilePopup && (
        <PersonalInformation
          isOpen={showProfilePopup}
          onClose={() => setShowProfilePopup(false)}
          user={user}
          onSave={(updatedData) => {
            // Called when user clicks Save in the popup.
            // You should implement the API call here to persist changes.
            console.log("Profile save payload:", updatedData);

            // Example: call a parent handler or API, then close popup:
            // await api.updateProfile(updatedData);
            setShowProfilePopup(false);
          }}
          onSignOut={onSignOut} // pass the sign-out handler into the modal
        />
      )}
    </>
  );
}
