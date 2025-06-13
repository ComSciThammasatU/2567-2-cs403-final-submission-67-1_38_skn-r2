import { useState } from "react";
import "./CreateProject.css";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [projectDetail, setProjectDetail] = useState("");
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    if (!projectName.trim()) {
      alert("กรุณากรอกชื่อโปรเจกต์");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, title: projectName, detail: projectDetail }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("last-project", projectName);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        navigate("/editor", { state: { projectName } });
      } else {
        alert("❌ ไม่สามารถบันทึกโปรเจกต์ได้: " + data.error);
      }
    } catch (err) {
      alert("❌ Server error");
    }
  };

  return (
    <div className="create-container">
      <div className="create-content">
        <h2>🚀สร้างโปรเจกต์</h2>
        <label>ชื่อโปรเจกต์:</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="กรอกชื่อโปรเจกต์"
          className="input-field"
        />

        <label>รายละเอียดโปรเจกต์:</label>
        <textarea
          value={projectDetail}
          onChange={(e) => setProjectDetail(e.target.value)}
          placeholder="เขียนคำอธิบายหรือเนื้อหาของโปรเจกต์"
          className="textarea-field"
        />

        <button onClick={handleSave} className="save-button">บันทึก</button>
        {saved && <p className="saved-message">✅ บันทึกเรียบร้อย!</p>}
      </div>
    </div>
  );
}

export default CreateProject;
