// ✅ Fixed ManuscriptPanel.js: added project to fetch, fixed timeData iteration
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TimelinePanel from "./TimelinePanel";
import "./ManuscriptPanel.css";
import TutorialModal from '../components/TutorialModal';

function ManuscriptPanel({ projectName, prefillContent, prefillTitle }) {
  const [text, setText] = useState("");
  const [dictionaryTerm, setDictionaryTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [selectedSidebar, setSelectedSidebar] = useState("timeline");
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [timelines, setTimelines] = useState({});
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isTutorialOpen, setTutorialOpen] = useState(false);

  const handleLookup = async () => {
    if (!dictionaryTerm.trim()) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/lookup?word=${dictionaryTerm}`);
      const data = await res.json();
      const meaning = `🗣 คำแปล: ${data.translation}
📘 ความหมาย: ${data.definition}`;
      setDefinition(meaning);
    } catch {
      setDefinition("❌ ไม่สามารถเชื่อมต่อ API ได้");
    }
  };

  const handleSaveChapter = async () => {
    const username = localStorage.getItem("username");
    if (!chapterTitle.trim()) return alert("กรุณาตั้งชื่อบท");
    if (!username) return alert("กรุณาเข้าสู่ระบบก่อน");

    try {
      const res = await fetch("http://localhost:5000/api/manuscript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, project: projectName, title: chapterTitle, content: text })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setChapterTitle("");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("❌ " + data.error);
      }
    } catch {
      alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  const handleReset = () => {
    setDictionaryTerm("");
    setDefinition("");
    setChapterTitle("");
    setText("");
  };

  const handleCharacterClick = (char) => setSelectedCharacter(char);
  const handleBackToList = () => setSelectedCharacter(null);

  const handleCreateNewTimeline = () => {
    const pageName = prompt("กรุณาตั้งชื่อ Timeline ใหม่:");
    if (!pageName || timelines[pageName]) return;
    setTimelines({ ...timelines, [pageName]: [] });
  };

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem("username");
      const project = localStorage.getItem("last-project");
      if (prefillContent) {
        setText(prefillContent);
        setChapterTitle(prefillTitle || "");
      } else {
        try {
          const res = await fetch(`http://localhost:5000/api/manuscript?username=${username}&project=${projectName}`);
          
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setText(data[0].content);
            setChapterTitle(data[0].title);
          }
        } catch {
          console.log("ไม่สามารถโหลด manuscript");
        }
      }

      try {
        const [charRes, timeRes] = await Promise.all([
          fetch(`http://localhost:5000/api/characters?username=${username}&project=${projectName}`),
          fetch(`http://localhost:5000/api/timeline?username=${username}&project=${projectName}`)
        ]);
        const charData = await charRes.json();
        const timeData = await timeRes.json();

        console.log("📦 timeData:", timeData);

        if (Array.isArray(timeData)) {
          const grouped = {};
          for (const ev of timeData) {
            if (!grouped[ev.page]) grouped[ev.page] = [];
            grouped[ev.page].push(ev);
          }
          setTimelines(grouped);
        } else {
          console.error("❌ timeData ไม่ใช่ array:", timeData);
        }

        setCharacters(charData);
      } catch (err) {
        console.error("❌ โหลดข้อมูล tools ไม่สำเร็จ", err);
      }
    };

    fetchData();
  }, [prefillContent, prefillTitle, projectName]);

  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  const tutorialSteps = [
    "เริ่มต้นเขียนบทใหม่ เริ่มพิมพ์นิยายของคุณในกล่องข้อความขนาดใหญ่ และตั้งชื่อบททางด้านบน เช่น 'ตอนที่ 1 - จุดเริ่มต้น' เพื่อให้สามารถบันทึกได้",
    "บันทึกบท เมื่อพิมพ์เสร็จแล้ว ให้กดปุ่ม 💾 Save Chapter เพื่อบันทึกเนื้อหาลงระบบ คุณจะได้รับข้อความแจ้งเตือนเมื่อบันทึกสำเร็จ", 
    "ค้นหาคำศัพท์ พิมพ์คำในช่องพจนานุกรมแล้วกด 🔍 ค้นหา เพื่อดูคำแปลและความหมายของคำนั้น ๆ",
    "เปิด Sidebar เครื่องมือ กดปุ่ม 🧰 Tools เพื่อเปิด sidebar สำหรับดู Timeline หรือรายละเอียดตัวละคร",
    "ดูข้อมูลตัวละคร เลือกเมนู Characters เพื่อค้นหาและดูรายละเอียดตัวละครในโครงการของคุณ",
    "ดู Timeline เลือกเมนู Timeline เพื่อดูเหตุการณ์ในเรื่อง",
  ];

  return (
    <div className={`manuscript-container ${showSidebar ? 'with-sidebar' : ''}`}>
      <h2>✍️ Manuscript for: {projectName} &nbsp;
        {/* ปุ่ม Tutorial */}
        <button className="tutorial-button" onClick={() => setTutorialOpen(true)}>
          📘 Tutorial !
        </button>
        </h2>
        <TutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setTutorialOpen(false)}
          title="วิธีใช้งาน Manuscript"
          steps={tutorialSteps}
          gifUrl="\assets\tutorials\Manuscript-Tutorial.gif"
        />

      <div className="card-section">
        <div className="card-title">📘 พจนานุกรมไทย</div>
          <div className="dictionary-input-group">
            <input
              type="text"
              placeholder="พิมพ์คำเพื่อค้นหา"
              value={dictionaryTerm}
              onChange={(e) => setDictionaryTerm(e.target.value)}
            />
            <button onClick={handleLookup} className="button button-search">🔍 ค้นหา</button>
          </div>
        <p className="definition-text">{definition}</p>
      </div>

      <div className="card-section">
        <div className="card-title">📖 Chapter</div>
        <div className="chapter-input-group">
          <input
            type="text"
            className="chapter-input"
            placeholder="ชื่อบทหรือตอน..."
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
          <button onClick={handleReset} className="button button-reset">🧹 รีเฟรชข้อความ</button>
          <button onClick={() => setShowSidebar(!showSidebar)} className="button button-tools">🧰 Tools</button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="manuscript-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="เริ่มพิมพ์นิยายของคุณที่นี่..."
      />

      <div className="button-save-container">
        <button onClick={handleSaveChapter} className="button-save">
          💾 Save Chapter
        </button>
      </div>

      {showSidebar && (
        <div className="sidebar">
          <div className="sidebar-menu">
            <button
              className={selectedSidebar === "timeline" ? "active" : ""}
              onClick={() => {
                setSelectedSidebar("timeline");
                setSelectedCharacter(null);
              }}
            >
              ⏳ Timeline
            </button>
            <button
              className={selectedSidebar === "characters" ? "active" : ""}
              onClick={() => {
                setSelectedSidebar("characters");
                setSelectedCharacter(null);
              }}
            >
              🧍‍♀️ Characters
            </button>
          </div>

          {selectedSidebar === "timeline" && (
            <div className="timeline-scale">
              <TimelinePanel projectName={projectName} />
            </div>
          )}

          {selectedSidebar === "characters" && (
            <div>
              {/* ถ้ามีตัวละครถูกเลือก → แสดงรายละเอียด */}
              {selectedCharacter ? (
                <div className="character-detail">
                  <h3>รายละเอียดตัวละคร</h3>
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      marginBottom: "10px",
                    }}
                  />
                  <p><strong>ชื่อ:</strong> {selectedCharacter.name}</p>
                  <p><strong>อายุ:</strong> {selectedCharacter.age || "ไม่ระบุ"}</p>
                  <p><strong>Clan:</strong> {selectedCharacter.clan || "ไม่ระบุ"}</p>
                  <p>
                    <strong>ความสัมพันธ์:</strong><br />
                    {Array.isArray(selectedCharacter.relations) && selectedCharacter.relations.length > 0
                      ? selectedCharacter.relations.map((rel, idx) => (
                          <div key={idx}>• {rel}</div>
                        ))
                      : "ไม่มีข้อมูล"}
                  </p>
                  <p>
                    <strong>รูปลักษณ์ภายนอก:</strong><br />
                    {Array.isArray(selectedCharacter.traits) && selectedCharacter.traits.length > 0
                      ? selectedCharacter.traits.map((trait, idx) => (
                          <div key={idx}>
                            • {trait.name}{trait.description ? `: ${trait.description}` : ""}
                          </div>
                        ))
                      : "ไม่มีข้อมูล"}
                  </p>

                  <p>
                    <strong>บุคลิกภาพ:</strong><br />
                    {Array.isArray(selectedCharacter.personality) && selectedCharacter.personality.length > 0
                      ? selectedCharacter.personality.map((trait, idx) => (
                          <div key={idx}>
                            • {trait.name}{trait.description ? `: ${trait.description}` : ""}
                          </div>
                        ))
                      : "ไม่มีข้อมูล"}
                  </p>
                  <p><strong>Backstory:</strong><br />{selectedCharacter.backstory || "ไม่มีข้อมูล"}</p>

                  {/* ปุ่มย้อนกลับ */}
                  <button onClick={() => setSelectedCharacter(null)} className="button-back">
                    ← ดูตัวละครอื่นๆ
                  </button>
                </div>
              ) : (
                // ถ้ายังไม่มีตัวละครถูกเลือก → แสดงรายการตัวละคร
                <div>
                  <input
                    type="text"
                    placeholder="🔍 ค้นหาชื่อตัวละคร..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                      width: "90%",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "8px",
                      marginbottom: "16px",
                      background: "#f9f9ff",
                      fontsize: "15px",
                      transition: "border 0.2s",
                    }}
                  />
                  {characters
                    .filter((char) =>
                      char.name.toLowerCase().includes(searchText.toLowerCase())
                    )
                    .map((char, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) =>
                          e.dataTransfer.setData("application/json", JSON.stringify(char))
                        }
                        onClick={() => setSelectedCharacter(char)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "8px",
                          marginBottom: "8px",
                          padding: "6px",
                          border: "1px solid #ccc",
                          borderRadius: "12px",
                          background: "#fff",
                          cursor: "pointer",
                          color: "#000",
                        }}
                      >
                        <img
                          src={char.image}
                          alt={char.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                            objectFit: "cover",
                            border: "1px solid #ccc",
                          }}
                        />
                        <span>{char.name}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ManuscriptPanel;
