import "./EditorLayout.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ResearchPanel from "./ResearchPanel";

import CharacterListPanel from "./CharacterListPanel";
import ManuscriptPanel from "./ManuscriptPanel";
import NewCharacter from "./NewCharacter";
import NewCharacterGroup from "./NewCharacterGroup";
import RelationshipEditor from "./RelationshipEditor";
import ClanSubfiction from "./ClanSubfiction";
import WorldPanel from "./WorldPanel";
import SystemHierarchyEditor from "./SystemHierarchyEditor";
import ItemsPanel from "./ItemsPanel";
import TimelinePanel from "./TimelinePanel";
import Chapter from "./Chapter";

const sidebarItems = [
  { icon: "🎥", label: "Research" },
  {
    label: "Characters",
    icon: "👤",
    submenu: [
      { key: "NewCharacter", label: "➕ New character" },
      { key: "NewCharacterGroup", label: "👥 New character group" },
      { key: "CharacterListPanel", label: "📋 All characters" },
      { key: "Clans", label: "🏰 Clans" },
    ],
  },
  {
    label: "Manuscript",
    icon: "✍️",
    submenu: [
      { key: "Manuscript", label: "✍️ Manuscript Panel" },
      { key: "Chapter", label: "📚 Chapter Directory" },
    ],
  },
  { icon: "👥", label: "Relationships" },
  {
    label: "World",
    icon: "🌍",
  },
  { icon: "⚙️", label: "Systems" },
  { icon: "🎒", label: "Items" },
  { icon: "⏳", label: "Timeline" },
];

function EditorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("");
  const [text, setText] = useState("");
  const [showCharacterSubmenu, setShowCharacterSubmenu] = useState(false);
  const [showManuscriptSubmenu, setShowManuscriptSubmenu] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [initialPrefill, setInitialPrefill] = useState(null);
  const [projectName, setProjectName] = useState("Taledge");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const nameFromState =
      location.state?.projectName || localStorage.getItem("last-project") || "Taledge";
    setProjectName(nameFromState);
    if (location.state?.projectName) {
      localStorage.setItem("last-project", location.state.projectName);
    }
  }, [location]);

  useEffect(() => {
    if (location.state?.prefill) {
      setInitialPrefill({
        content: location.state.prefill,
        title: location.state.prefillTitle || "",
      });
      setSelectedSection("Manuscript");
    }
  }, [location.state?.prefill]);

  useEffect(() => {
    if (location.state?.section) {
      setSelectedSection(location.state.section);
    }
  }, [location.state?.section]);

  return (
    <div className="editor-wrapper">
      {!sidebarVisible && (
        <button onClick={() => setSidebarVisible(true)} className="show-sidebar-button">
          &gt;&gt;
        </button>
      )}

      {sidebarVisible && (
        <aside className="editor-sidebar">
          <div className="sidebar-header">
            <h3
              className="project-name-heading"
              onClick={() => navigate("/projects")}
              title="คลิกเพื่อกลับไปหน้าโปรเจกต์"
            >
              📝 {projectName}
            </h3>
            <div className="menu-panel">
              <button className="menu-button" onClick={() => setSidebarVisible(false)}>
                &lt;&lt;
              </button>
            </div>
          </div>

          <ul className="sidebar-list">
            {sidebarItems.map((item, idx) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isOpen = 
                (item.label === "Characters" && showCharacterSubmenu) || 
                (item.label === "Manuscript" && showManuscriptSubmenu);

              const isSelected = (() => {
                if (item.submenu) {
                  return item.submenu.some((sub) => sub.key === selectedSection);
                }
                return selectedSection === item.label;
              })();

              return (
                <li key={idx} className="sidebar-item">
                  <button
                    className={`sidebar-button ${isOpen || isSelected ? 'active' : ''}`}
                    onClick={() => {
                      if (item.label === "Characters") {
                        setShowCharacterSubmenu(!showCharacterSubmenu);
                      } else if (item.label === "Manuscript") {
                        setShowManuscriptSubmenu(!showManuscriptSubmenu);
                      } else {
                        setSelectedSection(item.label);
                      }
                    }}
                  >
                    <span className="icon">{item.icon}</span>
                    <span className="label">{item.label}</span>
                    {hasSubmenu && <i className={`fa fa-caret-${isOpen ? 'up' : 'down'}`}></i>}
                  </button>
                  {hasSubmenu && (
                    <div className={`submenu ${isOpen ? 'show' : 'hide'}`}>
                      {item.submenu.map((sub, i) => (
                        <a
                          key={i}
                          href="#"
                          className={`submenu-item ${selectedSection === sub.key ? 'active' : ''}`}
                          onClick={() => setSelectedSection(sub.key)}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>
      )}

      <main className="editor-main" style={{ position: "relative" }}>
        {/* ✅ Logout ใน main (ไม่ทับ sidebar ด้านขวา) */}
        <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
          <button
            style={{
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundImage: "linear-gradient(135deg, #ff416c, #ff4b2b)",
              fontWeight: "bold",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
              transition: "transform 0.2s, box-shadow 0.2s",
              whiteSpace: "nowrap",            // ไม่ตัดขึ้นบรรทัดใหม่
              maxWidth: "250px",               // ป้องกันปุ่มกว้างเกินไป
              overflow: "hidden",              // ถ้าเกินจะตัด
              textOverflow: "ellipsis",        // แสดง ...
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.35)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.25)";
            }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              navigate("/");
            }}
          >
            👤 {localStorage.getItem("username")} | 🚪 Logout
          </button>
        </div>

        {selectedSection === "Research" && <ResearchPanel />}
        {selectedSection === "CharacterListPanel" && <CharacterListPanel />}
        {selectedSection === "NewCharacter" && <NewCharacter />}
        {selectedSection === "NewCharacterGroup" && <NewCharacterGroup />}
        {selectedSection === "Clans" && <ClanSubfiction />}
        {selectedSection === "Manuscript" && (
          <ManuscriptPanel
            projectName={projectName}
            prefillContent={initialPrefill?.content}
            prefillTitle={initialPrefill?.title}
          />
        )}
        {selectedSection === "Relationships" && <RelationshipEditor />}
        {selectedSection === "World" && <WorldPanel />}
        {selectedSection === "Systems" && <SystemHierarchyEditor />}
        {selectedSection === "Items" && <ItemsPanel />}
        {selectedSection === "Timeline" && <TimelinePanel projectName={projectName} />}
        {selectedSection === "Chapter" && <Chapter />}

        {!selectedSection && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
            color: "#ccc"
          }}>
            <img
              src="/logo.png"
              alt="Taledge Logo"
              style={{
                width: "500px",       
                maxWidth: "90%",        
                height: "auto", 
                marginBottom: "5px",
                opacity: 0.8
              }}
            />
            <h1 style={{ fontSize: "25px", color: "white" }}>...ยินดีต้อนรับสู่ TALEDGE...</h1>
            <p style={{ fontSize: "18px", color: "white" }}>...เลือกเมนูด้านซ้ายเพื่อเริ่มต้นโปรเจกต์ของคุณ...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default EditorLayout;
