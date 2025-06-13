import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetail, setEditDetail] = useState("");

  useEffect(() => {
    if (!username) return;
    fetch(`http://localhost:5000/api/projects?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        const initialStatusMap = {};
        data.forEach((p) => {
          initialStatusMap[p._id] = p.status || "ทำต่อ";
        });
        setStatusMap(initialStatusMap);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("❌ โหลดโปรเจกต์ไม่สำเร็จ");
      });
  }, [username]);

  const handleSelect = (project) => {
    navigate("/editor", { state: { projectName: project.title } });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("คุณต้องการลบโปรเจกต์นี้หรือไม่?");
    if (!confirmed) return;
    try {
      await fetch(`http://localhost:5000/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("❌ ลบไม่สำเร็จ");
    }
  };

  const handleSaveAll = async (id) => {
    const status = statusMap[id];

    // หา project ตัวปัจจุบันจาก state
    const currentProject = projects.find((p) => p._id === id);

    // กำหนด title กับ detail ถ้า editTitle, editDetail ไม่มีค่าให้ใช้ของเดิม
    const titleToSend = editTitle || currentProject.title;
    const detailToSend = editDetail || currentProject.detail;

    try {
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          title: titleToSend,
          detail: detailToSend,
        }),
      });

      setProjects((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                status,
                title: titleToSend,
                detail: detailToSend,
                updatedAt: new Date(),
              }
            : p
        )
      );
      handleCancelEdit();
    } catch {
      alert("❌ บันทึกไม่สำเร็จ");
    }
  };

  const formatThaiDate = (isoString) => {
    return new Date(isoString).toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditClick = (proj) => {
    setEditingId(proj._id);
    setEditTitle(proj.title);
    setEditDetail(proj.detail);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDetail("");
  };

  const autoResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`; 
  };

  const resizeAllTextareas = () => {
    document.querySelectorAll("textarea").forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  };

  useEffect(() => {
    resizeAllTextareas();
  }, [editingId]);

  if (!username) return <p>กรุณาเข้าสู่ระบบก่อน</p>;
  if (loading) return <p>กำลังโหลดโปรเจกต์...</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 
        style={{
                fontSize: "2rem",
                marginBottom: "30px",
                color: "#fff",
                textShadow: `
                  0 0 15px #b184ff,     /* ม่วง */
                  0 0 10px #ffddee,    /* ชมพูอมขาว */
                  0 0 15px #a0ffe6     /* มิ้นท์ */
                `
              }}
      >
        📁 โปรเจกต์ของคุณ
      </h2>

      {projects.length === 0 ? (
        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            color: "white",
            fontSize: "18px",
            fontWeight: "500",
            padding: "40px",
            background: "rgba(255, 255, 255, 0.32)",
            border: "3px dashed rgb(255, 255, 255)",
            borderRadius: "12px",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            userSelect: "none",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(7.5px)",
            WebkitBackdropFilter: "blur(7.5px)",
          }}
        >
          <p>😕 ยังไม่มีโปรเจกต์ของคุณ</p>
          <p style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
            สร้างโปรเจกต์ใหม่ หรือกลับไปที่หน้าแรกเพื่อเริ่มต้นได้เลย
              <button
                style={{
                marginTop: "20px",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "6px",
                border: "none",
                backgroundImage: "linear-gradient(45deg, #6a11cb, #2575fc)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                color: "white",
                cursor: "pointer",
                marginRight: "12px",
              }}
                onClick={() => navigate("/Create")} 
              >
                🚀 สร้างโปรเจกต์ใหม่
              </button>

              <button
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "rgba(191, 209, 255, 0.7)",
                  color: "whitesmoke",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")} 
              >
                🏠 กลับหน้าแรก
              </button>
          </p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projects.map((proj) => (
            <li
              key={proj._id}
              style={{
                marginBottom: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                backgroundColor: "#fff",
                position: "relative",
                transition: "box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              <div onClick={() => editingId ? null : handleSelect(proj)} style={{ cursor: editingId === proj._id ? "default" : "pointer" }}>
                {editingId === proj._id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ width: "100%", marginBottom: "8px", marginTop: "30px", padding: "8px", borderRadius: "8px", border: "1px solid grey", fontSize: "16px" }}
                    />
                    <textarea
                      value={editDetail}
                      onChange={(e) => setEditDetail(e.target.value)}
                      onInput={autoResizeTextarea}
                      rows={3}
                      style={{ width: "100%", marginBottom: "8px", borderRadius: "8px", border: "1px solid grey", padding: "6px", overflow: "hidden", resize: "none", fontSize: "16px" }}
                    />
                  </>
                ) : (
                  <>
                    <h4 style={{ marginBottom: "4px", fontSize: "18px", fontWeight: "600" }}>
                      {proj.title}
                    </h4>
                    <p style={{ color: "#666", marginBottom: "8px", whiteSpace: "pre-line" }}>{proj.detail}</p>
                  </>
                )}
                <p style={{ fontSize: 13, color: "#999" }}>
                  🕒 อัปเดตล่าสุด: {formatThaiDate(proj.updatedAt || proj.createdAt)}
                </p>
              </div>

              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: "10px" }}>
                <label>📌 สถานะ: </label>
                <select
                  value={statusMap[proj._id] || "ทำต่อ"}
                  onChange={(e) =>
                    setStatusMap((prev) => ({
                      ...prev,
                      [proj._id]: e.target.value,
                    }))
                  }
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="ไม่ทำต่อแล้ว">ไม่ทำต่อแล้ว</option>
                  <option value="ทำต่อ">ทำต่อ</option>
                  <option value="จบแล้ว">จบแล้ว</option>
                </select>

                <button
                  style={{
                    padding: "6px 12px",
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                  onClick={() => handleSaveAll(proj._id)}
                >
                  💾 บันทึก
                </button>

                {editingId === proj._id && (
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#9E9E9E",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    ❌ ยกเลิก
                  </button>
                )}
              </div>

              <button
                onClick={() => handleDelete(proj._id)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                🗑 ลบ
              </button>
              {editingId === proj._id ? (
                <></>
              ) : (
                <button
                  onClick={() => handleEditClick(proj)}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 70,
                    backgroundColor: "#ff9800",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: 14,
                    marginRight: 8,
                  }}
                >
                  🖋 แก้ไข
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProjectList;
