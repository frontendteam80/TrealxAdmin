 import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import "./Updates.scss";
import { FaPaperPlane, FaSmile, FaSearch } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

function formatDate(dateString) {
  if (!dateString) return "—";
  const [day, month, year] = dateString.split("-");
  return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
}

export default function PriceHistory() {
  const { projectID } = useParams();
  const navigate = useNavigate();
  const { fetchData, postData } = useApi();

  const [filteredData, setFilteredData] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [projectComments, setProjectComments] = useState([]);
  const [propertyComments, setPropertyComments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserComment, setNewUserComment] = useState("");
  const [localUserComments, setLocalUserComments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("project");
  const [filterPropertyId, setFilterPropertyId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [history, comments] = await Promise.all([
          fetchData("PriceOldHistory"),
          fetchData("UserComments"),
        ]);
        const filtered = Array.isArray(history)
          ? history.filter((item) => String(item.ProjectID) === String(projectID))
          : [];
        setFilteredData(filtered);

        if (Array.isArray(comments)) {
          setUserComments(comments);

          const projectRelated = comments.filter(
            (c) => String(c.ProjectID || c.projectId || c.project_id).trim() ===
              String(projectID).trim()
          );
          setProjectComments(projectRelated);

          const propertyRelated = comments.filter(
            (c) =>
              (c.PropertyID || c.propertyId) &&
              String(c.ProjectID || c.projectId || c.project_id).trim() ===
                String(projectID).trim()
          );
          setPropertyComments(propertyRelated);

          if (propertyRelated.length > 0) {
            setSelectedUser(propertyRelated[0].AdminName);
            setFilterPropertyId(propertyRelated[0].PropertyID || "");
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }
    loadData();
  }, [projectID, fetchData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localUserComments, userComments, selectedUser]);

  const handleSendComment = async () => {
    if (!newUserComment.trim()) return alert("Please type a comment!");
    if (!selectedUser) return alert("Select a user first!");

    const commentData = {
      RequestParamType: "AddComment",
      ProjectID: Number(projectID),
      PropertyID: filterPropertyId || null,
      Comment: newUserComment.trim(),
    };

    try {
      const response = await postData("data", commentData);

      if (response?.status === 401) {
        alert("Unauthorized! Please check your token.");
        return;
      }

      alert("✅ Comment added successfully!");

      setLocalUserComments((prev) => [
        ...prev,
        {
          AdminName: selectedUser,
          PropertyID: filterPropertyId || null,
          Comment: newUserComment.trim(),
          CreatedAt: new Date().toLocaleString(),
        },
      ]);

      setNewUserComment("");
      setShowEmojiPicker(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error sending comment:", err);
      alert("⚠️ Failed to send comment. Check console for details.");
    }
  };

  const filteredComments =
    activeTab === "project"
      ? projectComments.filter(
          (c) =>
            (!searchQuery ||
              String(c.PropertyID).includes(searchQuery) ||
              c.AdminName.toLowerCase().includes(searchQuery.toLowerCase())) &&
            String(c.ProjectID) === String(projectID)
        )
      : propertyComments.filter(
          (c) =>
            (!searchQuery ||
              c.AdminName.toLowerCase().includes(searchQuery.toLowerCase())) &&
            String(c.ProjectID) === String(projectID)
        );

  const allComments =
    selectedUser === null
      ? []
      : [
          ...userComments.filter(
            (u) =>
              u.AdminName === selectedUser &&
              String(u.ProjectID) === String(projectID) &&
              (!filterPropertyId || String(u.PropertyID) === filterPropertyId)
          ),
          ...localUserComments.filter((c) => c.AdminName === selectedUser),
        ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main
        className="main-content"
        style={{
          marginLeft: "10px",
          maxWidth: "calc(100vw - 260px)",
          overflowX: "auto",
        }}
      >
        <div className="table-section">
          <button className="action-button" onClick={() => navigate("/updates")}>
            ← Back to Updates
          </button>

          <h2 className="project-title">Project ID: {projectID}</h2>

          {/* Price History Table */}
          <table className="updates-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#eef5fc" }}>
              <tr>
                <th style={{ width: "6%", textAlign: "center", padding: "10px" }}>S.No</th>
                <th style={{ width: "27%", textAlign: "left", padding: "10px" }}>Project Name</th>
                <th style={{ width: "21%", textAlign: "left", padding: "10px" }}>Locality</th>
                <th style={{ width: "18%", textAlign: "center", padding: "10px" }}>Former Price Range</th>
                <th style={{ width: "14%", textAlign: "center", padding: "10px" }}>Updated Date</th>
                <th style={{ width: "14%", textAlign: "center", padding: "10px" }}>Updated By</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ padding: "10px", textAlign: "left" }}>{item.ProjectName}</td>
                    <td style={{ padding: "10px", textAlign: "left" }}>{item.Locality}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{item.OldPriceRange}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{formatDate(item.OldUpdateDate)}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{item.UpdatedBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "10px", textAlign: "center" }}>
                    No history found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Comment Tabs */}
          <div className="comment-tabs" style={{ marginTop: 22 }}>
            <button
              className={activeTab === "project" ? "activeTab" : "inactiveTab"}
              onClick={() => {
                setActiveTab("project");
                setSelectedUser(null);
                setSearchQuery("");
              }}
            >
              Project Comments
            </button>
            <button
              className={activeTab === "property" ? "activeTab" : "inactiveTab"}
              onClick={() => {
                setActiveTab("property");
                if (propertyComments.length > 0) {
                  setSelectedUser(propertyComments[0].AdminName);
                  setFilterPropertyId(propertyComments[0].PropertyID || "");
                }
                setSearchQuery("");
              }}
            >
              Property Comments
            </button>
          </div>

          {/* Comments Admin Table */}
          <div className="comment-section">
            <div className="comment-table">
              {filteredComments.length > 0 && (
                <table className="updates-table" style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}>
                  <thead style={{ backgroundColor: "#eef5fc" }}>
                    <tr>
                      <th style={{ width: "7%", textAlign: "center", padding: "8px" }}>S.No</th>
                      <th style={{ width: "33%", textAlign: "left", padding: "8px" }}>Admin</th>
                      <th style={{ width: "30%", textAlign: "center", padding: "8px" }}>Property ID</th>
                      <th style={{ width: "30%", textAlign: "left", padding: "8px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComments.map((user, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px", textAlign: "center" }}>{index + 1}</td>
                        <td style={{ padding: "8px", textAlign: "left" }}>👤 {user.AdminName}</td>
                        <td style={{ padding: "8px", textAlign: "center" }}>🏠 {user.PropertyID || "-"}</td>
                        <td style={{ padding: "8px", textAlign: "right" }}>
                          <button
                            className="action-button"
                            onClick={() => {
                              setSelectedUser(user.AdminName);
                              setLocalUserComments([]);
                              setFilterPropertyId(user.PropertyID || "");
                            }}
                          >
                            💬 Comments
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Comment input/chat */}
            <div className="comment-box">
              <div className="comment-filters">
                 <div
  className="input-wrapper"
  style={{
    position: "relative",
    width: "40%",
    marginBottom: "10px",
  }}
>
  <FaSearch
    style={{
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#888",
      fontSize: "15px",
    }}
  />
  <input
    type="text"
    placeholder="Search by ID or Name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={{
      width: "100%",
      padding: "10px 12px 10px 36px", // padding-left leaves space for icon
      border: "1px solid #ddd",
      borderRadius: "8px",
      outline: "none",
      fontSize: "14px",
      backgroundColor: "#f9f9f9",
      transition: "all 0.2s ease-in-out",
    }}
    
    onFocus={(e) => (e.target.style.backgroundColor = "#fff")}
    onBlur={(e) => (e.target.style.backgroundColor = "#f9f9f9")}
  />
</div>

              </div>
              <div className="chat-messages">
                {allComments.map((msg, i) => {
                  const isUserComment = localUserComments.some(
                    (c) =>
                      c.AdminName === selectedUser && c.Comment === msg.Comment
                  );
                  return (
                    <div
                      key={i}
                      className={`comment-message ${
                        isUserComment ? "sent" : "received"
                      }`}
                    >
                      {!isUserComment && (
                        <div className="message-header">
                          <MdPerson />
                          <strong>{msg.AdminName}</strong>{" "}
                          {msg.PropertyID && `🏠 ${msg.PropertyID}`}
                        </div>
                      )}
                      <div>{msg.Comment}</div>
                      <div className="message-time">
                        ⏱ {msg.CreatedAt} {isUserComment && "✅"}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <div className="comment-input" style={{ display: "flex", alignItems: "center" }}>
                <div className="emoji-picker-wrapper">
                  <FaSmile onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ cursor: "pointer" }} />
                  {showEmojiPicker && (
                    <div className="emoji-picker-popup">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setNewUserComment((prev) => prev + emojiData.emoji);
                          setShowEmojiPicker(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={newUserComment}
                  onChange={(e) => setNewUserComment(e.target.value)}
                  placeholder="Type your comment..."
                  style={{ padding: "7px", flex: 1, marginLeft: "6px" }}
                />
                <button onClick={handleSendComment} style={{ marginLeft: "7px" }}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
