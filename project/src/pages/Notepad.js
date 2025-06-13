import { useState } from "react";
import "./Notepad.css";

function Notepad() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const username = localStorage.getItem("username");
    if (!username) return alert("กรุณาเข้าสู่ระบบก่อน");

    try {
      const res = await fetch("http://localhost:5000/api/notepad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: text })
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("❌ ไม่สามารถบันทึกได้: " + data.error);
      }
    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="notepad-container">
      <h2>✍️ เขียนนิยายของคุณที่นี่</h2>
      <textarea
        className="notepad-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="เริ่มพิมพ์เรื่องราวของคุณ..."
      />
      <button className="notepad-button" onClick={handleSave}>
        Save
      </button>
      {saved && <p className="saved-message">✅ บันทึกเรียบร้อย!</p>}
    </div>
  );
}

export default Notepad;
