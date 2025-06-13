import "./ResearchPanel.css";
import { useState, useEffect } from "react";
import TutorialModal from '../components/TutorialModal';

function ResearchPanel() {
  const [panels, setPanels] = useState([]);
  const username = localStorage.getItem("username");
  const project = localStorage.getItem("last-project");
  const [isTutorialOpen, setTutorialOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  if (!username || !project) return;
  const fetchPanels = async () => {
    const res = await fetch(`http://localhost:5000/api/research?username=${username}&project=${project}`);
    const data = await res.json();
    setPanels(data);
  };
  fetchPanels();
}, [username, project]);

useEffect(() => {
  resizeAllTextareas();
}, [panels]);

  const addPanel = async () => {
    const newPanel = {
      username,
       project,
      title: "",
      type: "",
      content: "",
      file: null,
      saved: false,
      description: "",
    };
    try {
      const res = await fetch("http://localhost:5000/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPanel),
      });
      if (!res.ok) throw new Error("Add panel failed");
      const data = await res.json();
      setPanels((prev) => [...prev, data]);
    } catch (err) {
      console.error("เพิ่ม panel ไม่สำเร็จ:", err);
    }
  };

  const updatePanel = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/research/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error("Update failed");
      const updatedPanel = await res.json();
      setPanels((prev) => prev.map((p) => (p._id === id ? updatedPanel : p)));
    } catch (err) {
      console.error("แก้ไข panel ไม่สำเร็จ:", err);
    }
  };

  const handleTitleChange = (id, title) => {
    setPanels((prev) => prev.map((p) => (p._id === id ? { ...p, title } : p)));
    updatePanel(id, { title });
  };

  const handleTypeChange = (id, type) => {
    setPanels((prev) => prev.map((p) => (p._id === id ? { ...p, type } : p)));
    updatePanel(id, { type });
  };

  const handleContentChange = (id, content) => {
    setPanels((prev) => prev.map((p) => (p._id === id ? { ...p, content } : p)));
    updatePanel(id, { content });
  };

  const handleFileChange = async (id, file) => {
    if (!file) return;

    const panel = panels.find((p) => p._id === id); 

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const fileType = file.type;
      // กำหนด type panel ตามไฟล์
      const newType = fileType.startsWith("image/") ? "image" : fileType === "application/pdf" ? "pdf" : "";

      setPanels((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                type: newType,
                file: {
                  name: file.name,
                  type: file.type,
                  data: base64,
                },
              }
            : p
        )
      );

      // ส่งข้อมูลไป backend
      try {
        const res = await fetch(`http://localhost:5000/api/research/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: panel.username,
            project: panel.project,  
            type: newType,
            file: {
              name: file.name,
              type: file.type,
              data: base64,
            },
          }),
        });

        if (!res.ok) throw new Error("อัปโหลดไฟล์ไม่สำเร็จ");

        console.log("✅ อัปโหลดไฟล์สำเร็จ");
      } catch (err) {
        console.error("❌ อัปโหลดไฟล์ล้มเหลว", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDescriptionChange = (id, description) => {
    setPanels((prev) => prev.map((p) => (p._id === id ? { ...p, description } : p)));
    updatePanel(id, { description });
  };

  const handleSave = (id) => {
    setPanels((prev) => prev.map((p) => (p._id === id ? { ...p, saved: true } : p)));
    updatePanel(id, { saved: true });
  };

  const handleEdit = (id) => {
    setPanels((prev) => prev.map((p) => (p._id === id ? { ...p, saved: false } : p)));
    updatePanel(id, { saved: false });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/research/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPanels((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("ลบ panel ไม่สำเร็จ:", err);
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

  const getValidatedVideoUrl = (url) => {
    if (/youtu\.be|youtube\.com/.test(url)) {
      const match = url.match(/[?&]v=([^&#]*)/) || url.match(/youtu\.be\/([^&#]*)/);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    if (/vimeo\.com/.test(url)) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match) return `https://player.vimeo.com/video/${match[1]}`;
    }
    if (/drive\.google\.com/.test(url)) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return null;
  };

  const tutorialSteps = [
    'กดปุ่ม “+Add Panel” เพื่อเริ่มสร้างหัวข้อ',
    'เลือกว่าจะอัปโหลดลิงก์ รูป วิดีโอ Text หรือ PDF',
    'พิมพ์ชื่อเรื่องและคำอธิบาย',
    'กดปุ่มบันทึกเพื่อเก็บข้อมูลลงระบบ',
    'กด "แก้ไข" เพื่อปรับข้อมูล และ "ลบ" เพื่อลบรายการ',
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

      <h2 className="research-header">🎥 Research &nbsp;
      {/* ปุ่ม Tutorial */}
      <button className="tutorial-button" onClick={() => setTutorialOpen(true)}>
        📘 Tutorial !
      </button>
      </h2>
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setTutorialOpen(false)}
        title="วิธีใช้งาน Research"
        steps={tutorialSteps}
        gifUrl="\assets\tutorials\Research-Tutorial.gif"
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
      <div className="research-grid">
        
      {filteredPanels.map((panel) => (
        <div className="panel" key={panel.id}>
            <textarea
              className={`panel-description editable-title${panel.title === "" ? " placeholder-title" : ""}`}
              value={panel.title}
              onChange={(e) => handleTitleChange(panel._id, e.target.value)}
              disabled={panel.saved}
              rows={1}
              onInput={autoResizeTextarea}
              placeholder="ไม่มีชื่อ..."
            />

            {!panel.type && !panel.saved && (
              <div className="panel-actions">
                <button onClick={() => handleTypeChange(panel._id, "text")}>🅰️ Add Text</button>
                <button onClick={() => document.getElementById(`img-${panel._id}`).click()}>🖼️ Add Image</button>
                <button onClick={() => document.getElementById(`pdf-${panel._id}`).click()}>📄 Add PDF</button>
                <button onClick={() => handleTypeChange(panel._id, "video")}>🎥 Add Video</button>
                <button onClick={() => handleTypeChange(panel._id, "link")}>🔗 Add Link</button>

                <input
                  id={`img-${panel._id}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(panel._id, e.target.files[0])}
                />
                <input
                  id={`pdf-${panel._id}`}
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(panel._id, e.target.files[0])}
                />
              </div>
            )}

            {panel.type === "text" && (!panel.saved || panel.content.trim() !== "") && (
              <textarea
                className="panel-description"
                placeholder="พิมพ์ข้อความ..."
                value={panel.content}
                onChange={(e) => handleContentChange(panel._id, e.target.value)}
                disabled={panel.saved}
                rows={1}
                onInput={autoResizeTextarea}
              />
            )}

            {panel.type === "image" && panel.file && (
              <img src={panel.file.data} alt={panel.file.name} className="preview-image" />
            )}

            {panel.type === "pdf" && panel.file && (
              <div className="file-link">
                <a href={panel.file.data} download={panel.file.name} target="_blank" rel="noopener noreferrer">
                  📄 {panel.file.name}
                </a>
              </div>
            )}

            {panel.type === "video" && !panel.saved && (
              <textarea
                className="panel-description"
                placeholder="ใส่ลิงก์วิดีโอ..."
                value={panel.content}
                onChange={(e) => handleContentChange(panel._id, e.target.value)}
                rows={1}
                onInput={autoResizeTextarea}
              />
            )}

            {panel.type === "video" && panel.saved && getValidatedVideoUrl(panel.content) && (
              <iframe
                src={getValidatedVideoUrl(panel.content)}
                className="video-embed"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="video"
              ></iframe>
            )}

            {panel.type === "link" && (
              panel.saved ? (
                <div className="file-link">
                  <a href={panel.content} target="_blank" rel="noopener noreferrer">
                    🔗 {panel.content}
                  </a>
                </div>
              ) : (
                <textarea
                  className="panel-description"
                  placeholder="ใส่ URL"
                  value={panel.content}
                  onChange={(e) => handleContentChange(panel._id, e.target.value)}
                  rows={1}
                  onInput={autoResizeTextarea}
                />
              )
            )}

            {panel.type && panel.type !== "text" && (
              !panel.saved ? (
                <textarea
                  className="panel-description"
                  placeholder="อธิบายเพิ่มเติม..."
                  value={panel.description}
                  onChange={(e) => handleDescriptionChange(panel._id, e.target.value)}
                  rows={2}
                  onInput={autoResizeTextarea}
                />
              ) : (
                panel.description.trim() !== "" && (
                  <textarea
                    className="panel-description"
                    value={panel.description}
                    disabled
                    rows={2}
                  />
                )
              )
            )}

            <div className="panel-footer">
              {!panel.type && !panel.saved && (
                <button className="delete-btn" onClick={() => handleDelete(panel._id)}>🗑️ ลบ</button>
              )}

              {panel.type && !panel.saved && (
                <button onClick={() => handleSave(panel._id)}>💾 บันทึก</button>
              )}

              {panel.saved && (
                <>
                  <button className="edit-btn" onClick={() => handleEdit(panel._id)}>✏️ แก้ไข</button>
                  <button className="delete-btn" onClick={() => handleDelete(panel._id)}>🗑️ ลบ</button>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="panel add-panel" onClick={addPanel}>
          <div className="add-panel-content">+ Add Panel</div>
        </div>
      </div>
    </div>
  );
}

export default ResearchPanel;
