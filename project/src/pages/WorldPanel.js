import "./ItemsPanel.css";
import { useState, useEffect } from "react";
import TutorialModal from '../components/TutorialModal';

function WorldPanel() {
  const [panels, setPanels] = useState([]);
  const [addingLinkId, setAddingLinkId] = useState(null);
  const [newLink, setNewLink] = useState("");
  const username = localStorage.getItem("username");
  const project = localStorage.getItem("last-project");
  const [isTutorialOpen, setTutorialOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
  const loadWorldData = async () => {
    if (!username || !project) return;
    try {
      const res = await fetch(`http://localhost:5000/api/world?username=${username}&project=${project}`);
      const data = await res.json();
      const mapped = data.map((item) => ({
        id: item._id, // ใช้ _id จาก MongoDB เป็น id
        title: item.title || "",
        description: item.note || "",
        image: item.images?.[0] || null,
        pdf: item.pdfs?.[0] || null,
        links: item.links || [],
        saved: true,
      }));
      setPanels(mapped);
      resizeAllTextareas();
    } catch (err) {
      console.error("❌ โหลดข้อมูลโลกไม่สำเร็จ:", err);
    }
  };
  loadWorldData();
}, [username, project]);

  const addPanel = () => {
    setPanels([
      ...panels,
      {
        id: Date.now(),
        title: "",
        description: "",
        image: null,
        pdf: null,
        links: [],
        saved: false,
      },
    ]);
  };

  const handleFileChange = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result; // ได้ base64 มาแล้ว

      const fileType = file.type;
      setPanels((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                image: fileType.startsWith("image/")
                  ? { url: base64, name: file.name }
                  : p.image,
                pdf: fileType === "application/pdf"
                  ? { url: base64, name: file.name }
                  : p.pdf,
              }
            : p
        )
      );
    };
    if (file) reader.readAsDataURL(file); // แปลงไฟล์เป็น base64
  };

  const handleTitleChange = (id, title) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)));
  };

  const handleDescriptionChange = (id, desc) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, description: desc } : p)));
  };

  const handleAddLink = (id, link) => {
    if (!link.trim()) return;
    setPanels((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, links: [...(p.links || []), link.trim()] } : p
      )
    );
    setAddingLinkId(null);
    setNewLink("");
  };

  const handleSave = async (id) => {
    const panel = panels.find((p) => p.id === id);
    if (!username || !project) return alert("กรุณาเข้าสู่ระบบก่อน");

    const payload = {
      username,
      project,
      title: panel.title,
      note: panel.description,
      links: panel.links,
      images: panel.image ? [panel.image] : [],
      pdfs: panel.pdf ? [panel.pdf] : [],
    };

    try {
      const res = await fetch("http://localhost:5000/api/world", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ บันทึกข้อมูลโลกเรียบร้อยแล้ว");
        setPanels((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, saved: true, mongoId: data.id } : p
          )
        );
      } else {
        alert("❌ ไม่สามารถบันทึกได้: " + data.error);
      }
    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  const handleEdit = (id) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, saved: false } : p)));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("ต้องการลบ Panel นี้หรือไม่?");
    if (!confirm) return;

    try {
      // ลบจาก backend
      const res = await fetch(`http://localhost:5000/api/world/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ลบไม่สำเร็จ");

      // ลบจาก state
      setPanels((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("❌ ลบไม่สำเร็จ: " + err.message);
    }
  };

  const autoResizeTextarea = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const resizeAllTextareas = () => {
    setTimeout(() => {
      document.querySelectorAll("textarea").forEach((textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      });
    }, 0);
  };

  const tutorialSteps = [
    "คลิกปุ่ม `+ Add Panel` เพื่อเพิ่มข้อมูลโลกใหม่",
    "พิมพ์ชื่อโลกในช่อง '...ไม่มีชื่อ...'",
    "อัปโหลดภาพประกอบของโลก โดยคลิกปุ่มเลือกรูป",
    "พิมพ์คำอธิบายรายละเอียดเกี่ยวกับโลกในช่องด้านขวา",
    "(ไม่บังคับ) เพิ่ม PDF โดยคลิก `Add PDF` และเลือกไฟล์เอกสาร",
    "(ไม่บังคับ) เพิ่มลิงก์อ้างอิง เช่นเว็บ YouTube, Google Drive โดยคลิก `Add Link`",
    "เมื่อตรวจสอบข้อมูลเรียบร้อยแล้ว คลิก `💾 บันทึก` เพื่อบันทึกข้อมูลลงระบบ",
    "หากต้องการแก้ไขข้อมูลในภายหลัง คลิก `✏️ แก้ไข`, หากไม่ต้องการแล้วให้คลิก `🗑️ ลบ`",
  ];

  const filteredPanels = panels.filter((panel) => {
    const keyword = searchTerm.toLowerCase();
    return (
      panel.title.toLowerCase().includes(keyword) ||
      panel.description.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="research-wrapper">
      <h2 className="item-header">🌍 World &nbsp;
        {/* ปุ่ม Tutorial */}
        <button className="tutorial-button" onClick={() => setTutorialOpen(true)}>
          📘 Tutorial !
        </button>
        </h2>
        <TutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setTutorialOpen(false)}
          title="วิธีใช้งาน World"
          steps={tutorialSteps}
          gifUrl="\assets\tutorials\World-Tutorial.gif"
        />
      <input
        type="text"
        className="search-bar"
        placeholder="🔍 ค้นหา..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          margin: "10px 0",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      {filteredPanels.map((panel) => (
        <div className="panel item-panel" key={panel.id}>
          <div className="item-title-wrapper">
            <textarea
              className="item-title"
              placeholder="...ไม่มีชื่อ..."
              value={panel.title}
              onChange={(e) => handleTitleChange(panel.id, e.target.value)}
              disabled={panel.saved}
              rows={1}
              onInput={autoResizeTextarea}
            />
          </div>

          <div className="item-content">
            <div className="item-image">
              {panel.image ? (
                <img src={panel.image.url} alt="World" />
              ) : (
                <div className="item-image-placeholder">No Image</div>
              )}

              {!panel.saved && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(panel.id, e.target.files[0])}
                />
              )}
            </div>

            <textarea
              className="panel-description"
              value={panel.description}
              onChange={(e) =>
                handleDescriptionChange(panel.id, e.target.value)
              }
              disabled={panel.saved}
              placeholder="ยังไม่มีคำอธิบาย..."
              rows={3}
              onInput={autoResizeTextarea}
            />
          </div>

          {(!panel.saved || panel.pdf || panel.links.length > 0) && (
            <div className="item-links-wrapper">
              {!panel.saved && (
                <>
                  {!addingLinkId || addingLinkId !== panel.id ? (
                    <div className="add-buttons">
                      <button onClick={() => setAddingLinkId(panel.id)}>
                        Add Link
                      </button>
                      <button
                        onClick={() =>
                          document.getElementById(`pdf-${panel.id}`).click()
                        }
                      >
                        Add PDF
                      </button>
                      <input
                        id={`pdf-${panel.id}`}
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          handleFileChange(panel.id, e.target.files[0])
                        }
                      />
                    </div>
                  ) : (
                    <div className="add-link-input">
                      <input
                        type="text"
                        placeholder="ใส่ลิงก์"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          handleAddLink(panel.id, newLink);
                        }}
                      >
                        บันทึก
                      </button>
                      <button
                        onClick={() => {
                          setAddingLinkId(null);
                          setNewLink("");
                        }}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  )}
                </>
              )}

              {panel.pdf && (
                <div className="file-link">
                  <a href={panel.pdf.url} target="_blank" rel="noopener noreferrer">
                    📄 {panel.pdf.name}
                  </a>
                </div>
              )}

              {panel.links.length > 0 && (
                <div className="file-link">
                  {panel.links.map((link, i) => (
                    <div key={i}>
                      🔗 <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="panel-footer">
            {!panel.saved && (
              <>
                <button className="delete-btn" onClick={() => handleDelete(panel.id)}>🗑️ ลบ</button>
                <button onClick={() => handleSave(panel.id)}>💾 บันทึก</button>
              </>
            )}

            {panel.saved && (
              <>
                <button className="edit-btn" onClick={() => handleEdit(panel.id)}>✏️ แก้ไข</button>
                <button className="delete-btn" onClick={() => handleDelete(panel.id)}>🗑️ ลบ</button>
              </>
            )}
          </div>
        </div>
      ))}
      <div className="panel add-panel" onClick={addPanel}>
        <div className="add-panel-content">+ Add Panel</div>
      </div>
    </div>
  );
}

export default WorldPanel;
