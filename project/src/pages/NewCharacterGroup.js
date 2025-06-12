import { useState, useRef, useEffect } from "react";
import "./NewCharacterGroup.css";
import TutorialModal from '../components/TutorialModal';

function NewCharacterGroup() {
  const [clanName, setClanName] = useState("Clan Name(ตั้งชื่อแคลนได้ที่นี่)");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [textBlocks, setTextBlocks] = useState([]);
  const [link, setLink] = useState("");
  const [links, setLinks] = useState([]);
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [videos, setVideos] = useState([]);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const textareaRef = useRef(null);
  const username = localStorage.getItem("username");
  const project = localStorage.getItem("last-project");
  const [isTutorialOpen, setTutorialOpen] = useState(false);

  const handleAddText = () => {
    setTextBlocks([...textBlocks, ""]);
  };

  const handleTextChange = (index, value) => {
    const updated = [...textBlocks];
    updated[index] = value;
    setTextBlocks(updated);
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result; // ได้ Base64 แล้ว
      setImage({ url: base64, name: file.name });
    };
    reader.readAsDataURL(file);
  }
};


  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfs([...pdfs, file.name]);
    }
  };

  const handleAddVideo = () => {
    const url = prompt("วางลิงก์วิดีโอ (YouTube หรือ Vimeo)");
    if (url) setVideos([...videos, url]);
  };

  const handleAddLink = () => {
    if (link) {
      setLinks([...links, link]);
      setLink("");
    }
  };

  const handleSaveGroup = async () => {
  if (!clanName || !username || !project) {
    alert("กรุณาใส่ชื่อ Clan และเข้าสู่ระบบก่อน");
    return;
  }

  // รวมภาพหลักเข้ากับ images[]
  const combinedImages = image ? [{ url: image, name: "cover" }, ...images] : images;

  try {
    const res = await fetch("http://localhost:5000/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        project,
        clanName,
        description: note,
        textBlocks,
        links,
        images: combinedImages,
        pdfs,
        videos,
      }),
    });

    const data = await res.json();
      if (res.ok) {
        alert("✅ Clan ถูกบันทึกแล้ว");
        setClanName("");
        setNote("");
        setImage(null);
        setTextBlocks([]);
        setLink("");
        setLinks([]);
        setImages([]);
        setPdfs([]);
        setVideos([]);
      } else {
        alert("❌ ไม่สามารถบันทึกได้: " + data.error);
      }
    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [note]);

  const autoResizeTextarea = (el) => {
    if (!el) return;
    el.style.height = 'auto'; 
    el.style.height = el.scrollHeight + 'px';
  };

  const tutorialSteps = [
    'ตั้งชื่อ Clan',
    'พิมพ์คำอธิบาย',
    'เพิ่มรูป / PDF / วิดีโอ / ข้อความ (ถ้ามี)',
    'เพิ่มลิงก์อ้างอิง (ถ้ามี)',
    'กดบันทึก',
  ];

  return (
    <div className="group-wrapper">
      <h2 className="research-header">👥 New character group &nbsp;
        {/* ปุ่ม Tutorial */}
        <button className="tutorial-button" onClick={() => setTutorialOpen(true)}>
          📘 Tutorial !
        </button>
        </h2>
        <TutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setTutorialOpen(false)}
          title="วิธีใช้งาน New character group"
          steps={tutorialSteps}
          gifUrl="\assets\tutorials\New-clan-tutorial.gif"
        />
      <div className="group-top">
        <div className="group-image">
          {image ? (
            <img src={image} alt="Clan" className="preview" />
          ) : (
            <div className="image-placeholder">Image</div>
          )}
          <input type="file" onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setImage(reader.result);
            };
            if (file) reader.readAsDataURL(file);
          }} />
        </div>
        <div className="group-info">
          <input
            className="clan-title"
            value={clanName}
            onChange={(e) => setClanName(e.target.value)}
          />
          <textarea
            placeholder="ประวัติของแคลน"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onInput={(e) => autoResizeTextarea(e.target)}
            ref={textareaRef}
          />
        </div>
      </div>

      <div className="group-grid">
        <div className="panel ref-panel">
          <h4>📎 Add Ref</h4>
          <div className="panel-actions">
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imageInputRef}
              onChange={handleImageUpload}
            />
            <input
              type="file"
              accept="application/pdf"
              hidden
              ref={pdfInputRef}
              onChange={handlePdfUpload}
            />
            <button onClick={() => imageInputRef.current.click()}>🖼️ Add Image</button>
            <button onClick={() => pdfInputRef.current.click()}>📄 Add PDF</button>
            <button onClick={handleAddText}>🅰️ Add Text</button>
            <button onClick={handleAddVideo}>🎥 Add VDO</button>
          </div>

          {textBlocks.map((text, idx) => (
            <textarea
              key={idx}
              className="text-block"
              value={text}
              onChange={(e) => handleTextChange(idx, e.target.value)}
              placeholder={`เนื้อหาที่ ${idx + 1}`}
            />
          ))}

          <div className="preview-section">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} className="preview-image" />
            ))}

            {pdfs.map((pdf, idx) => (
              <div key={idx} className="pdf-file">📄 {pdf}</div>
            ))}

            {videos.map((vid, idx) => (
              <iframe
                key={idx}
                src={vid}
                title={`video-${idx}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-embed"
              ></iframe>
            ))}
          </div>
        </div>

        <div className="panel notes-panel">
          <h4>📝 Notes</h4>
          <textarea
            value={note}
            readOnly
            ref={textareaRef}
            className="notes-textarea"
          />
        </div>

        <div className="panel link-panel">
          <h4>🌐 Link</h4>

          <div className="link-input-group">
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="+ Add Link"
            />
            <button onClick={handleAddLink}>+ Add</button>
          </div>

          <ul className="link-list">
            {links.map((l, idx) => (
              <li key={idx}>
                <a href={l} target="_blank" rel="noreferrer">🔗 {l}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="button-save-container">
        <button onClick={handleSaveGroup} className="button-save">💾 Save Group</button>
      </div>
    </div>
  );
}

export default NewCharacterGroup;
