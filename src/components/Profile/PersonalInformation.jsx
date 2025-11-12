// src/components/Profile/PersonalInformation.jsx
import React, { useEffect, useState } from "react";
import {
  MdClose,
  MdPerson,
  MdEmail,
  MdLock,
  MdWork,
  MdLocationOn,
  MdLink,
  MdBadge,
  MdSettings,
  MdExitToApp,
} from "react-icons/md";

export default function PersonalInformation({ isOpen, onClose, user = {}, onSave, onSignOut }) {
  const leftMenu = [
    { id: "profileMenu", label: "Profile", icon: <MdPerson /> },
    { id: "settingsMenu", label: "Settings", icon: <MdSettings /> },
    // { id: "personalMenu", label: "Personal Information", icon: <MdBadge /> },
  ];

  const tabsByMenu = {
    profileMenu: [
      { id: "profile", label: "Profile", icon: <MdPerson /> },
      { id: "login", label: "Login & Contact", icon: <MdEmail /> },
      { id: "security", label: "Security & Password", icon: <MdLock /> },
      { id: "role", label: "Role & Permissions", icon: <MdWork /> },
      { id: "office", label: "Office / Location", icon: <MdLocationOn /> },
      { id: "social", label: "Social Links", icon: <MdLink /> },
      { id: "other", label: "Other Info", icon: <MdBadge /> },
    ],
    settingsMenu: [
      { id: "branding", label: "Branding", icon: <MdSettings /> },
      { id: "notifications", label: "Notifications", icon: <MdSettings /> },
      { id: "localization", label: "Localization", icon: <MdSettings /> },
    ],
    // personalMenu: [
    //   { id: "basic", label: "Basic Profile", icon: <MdPerson /> },
    //   { id: "licenses", label: "Licenses & IDs", icon: <MdBadge /> },
    // ],
  };

  const [selectedLeft, setSelectedLeft] = useState("profileMenu");
  const [activeTab, setActiveTab] = useState(tabsByMenu["profileMenu"][0].id);
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "",
      office: user?.office || "",
      bio: user?.bio || "",
      social: user?.social || { linkedin: "", twitter: "" },
      licenseNumber: user?.licenseNumber || "",
      emergencyContact: user?.emergencyContact || "",
      avatarUrl: user?.avatarUrl || "",
      avatarFile: null,
      notes: user?.notes || "",
      joinedDate: user?.joinedDate || "",
    });
  }, [user, isOpen]);

  useEffect(() => {
    const first = (tabsByMenu[selectedLeft] && tabsByMenu[selectedLeft][0]?.id) || "";
    setActiveTab(first);
  }, [selectedLeft]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "contactPrefs") {
      const prefs = new Set(form.contactPrefs || []);
      if (checked) prefs.add(value); else prefs.delete(value);
      setForm(prev => ({ ...prev, contactPrefs: Array.from(prefs) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, avatarFile: file, avatarUrl: url }));
  }

  function handleSave() {
    if (!form.firstName || !form.email) {
      alert("Please provide a first name and email.");
      return;
    }
    onSave && onSave(form);
    onClose && onClose();
  }

  // Sign out wrapper: call handler then close modal
  function handleSignOut() {
    if (typeof onSignOut === "function") {
      onSignOut();
    }
    onClose && onClose();
  }

  // Styles (kept inline to drop in)
  const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
  const modal = { width: "94%", maxWidth: 1100, height: "82vh", background: "#fff", borderRadius: 10, display: "flex", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" };
  const leftStyle = { width: 260, borderRight: "1px solid #eee", padding: 18, background: "#fbfbfb", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between" };
  const rightStyle = { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 };
  const tabBar = { display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid #eee", alignItems: "center", overflowX: "auto", whiteSpace: "nowrap", background: "#fff" };
  const tabButton = (active) => ({ padding: "8px 14px", borderRadius: 8, cursor: "pointer", background: active ? "#fff" : "transparent", color: "#121212" , borderBottom: active ? "3px solid #1f3f5b" : "3px solid transparent", fontWeight: active ? 700 : 600, display: "inline-flex", gap: 8, alignItems: "center" });
  const contentArea = { padding: 18, overflowY: "auto", flex: 1 };

  return (
    <div style={overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal} role="dialog" aria-modal="true" aria-label="Personal information dialog">

        {/* LEFT: vertical menu + sign out footer */}
        <aside style={leftStyle}>
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {form.avatarUrl ? <img src={form.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MdPerson size={28} color="#888" />}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{[form.firstName,form.MiddleName, form.lastName].filter(Boolean).join(" ") || "—"}</div>
                <div style={{ fontSize: 13, color: "#666" }}>{form.email}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>{form.role?.toUpperCase() || ""}</div>
              </div>
            </div>

            <div style={{ marginTop: 6, marginBottom: 8, color: "#888", fontSize: 12, fontWeight: 700 }}>MENU</div>

            {leftMenu.map(item => {
              const active = item.id === selectedLeft;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedLeft(item.id)}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: "10px 8px",
                    borderRadius: 8,
                    marginBottom: 8,
                    cursor: "pointer",
                    background: active ? "#fff" : "transparent",
                    border: active ? "1px solid #e6e6e6" : "none"
                  }}
                >
                  <div style={{ width: 26 }}>{item.icon}</div>
                  <div style={{ fontWeight: 600 }}>{item.label}</div>
                </div>
              );
            })}
          </div>

          {/* Footer with Joined and Sign out */}
          <div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>Joined: {form.joinedDate || "—"}</div>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                onClick={handleSignOut}
                style={{ flex: 1, background: "#fff", color: "#e53e3e", border: "1px solid #f1d5d5", padding: "8px 10px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}
              >
                <MdExitToApp /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT: header, tabs, content */}
        <div style={rightStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid #f2f2f2" }}>
            <h3 style={{ margin: 0 }}>{leftMenu.find(l => l.id === selectedLeft)?.label || "Profile"}</h3>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* Small sign out in header */}
              {/* <button
                onClick={handleSignOut}
                title="Sign out"
                style={{ background: "transparent", border: "none", color: "#e53e3e", cursor: "pointer", display: "inline-flex", gap: 6, alignItems: "center" }}
              >
                <MdExitToApp />
                <span style={{ fontSize: 13 }}>Sign out</span>
              </button> */}

              <button onClick={() => onClose && onClose()} style={{ background: "transparent", border: "none", cursor: "pointer" }} aria-label="close">
                <MdClose size={22} />
              </button>
            </div>
          </div>

          <div style={tabBar}>
            {(tabsByMenu[selectedLeft] || []).map(t => (
              <div key={t.id} onClick={() => setActiveTab(t.id)} style={tabButton(t.id === activeTab)}>
                {t.icon}
                <span>{t.label}</span>
              </div>
            ))}
          </div>

          <div style={contentArea}>
            {activeTab === "profile" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>First name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} style={{ width:"80%", padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>MiddleName</label>
                  <input name="MiddleName" value={form.MiddleName} onChange={handleChange} style={{ width:"80%", padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>Last name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} style={{ width: "80%", padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: 6 }}>Bio / Description</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} style={{ width: "100%", minHeight: 110, padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>Avatar</label>
                  <input type="file" accept="image/*" onChange={handleAvatar} />
                </div>
              </div>
            )}

            {/* (other tab contents as before) */}
            {["login","security","role","office","social","other","branding","notifications","localization","basic","licenses"].includes(activeTab) && (
              <div>
                <p style={{ color: "#666" }}>Settings area for <strong>{activeTab}</strong>. Replace with fields you need.</p>
                <div style={{ maxWidth: 520 }}>
                  <label style={{ display: "block", marginBottom: 6 }}>Example field</label>
                  <input style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button onClick={() => onClose && onClose()} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "transparent" }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff" }}>Save</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
