import { useState, useEffect } from "react";
import "./TimelinePanel.css";
import TutorialModal from '../components/TutorialModal';

function TimelinePanel({ readonly, projectName }) {
  // State ต่าง ๆ สำหรับจัดการ timeline และ event
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });
  const [currentPage, setCurrentPage] = useState(null);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const username = localStorage.getItem("username");
  const [isTutorialOpen, setTutorialOpen] = useState(false);

  // โหลด timeline เมื่อ component โหลดหรือเมื่อเปลี่ยน projectName
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/timeline?username=${username}&project=${projectName}`);
        const data = await res.json();
        const grouped = {};

        for (const ev of data) {
          if (!grouped[ev.page]) grouped[ev.page] = [];
          grouped[ev.page].push(ev);
        }

        setEvents(grouped);
        const firstPage = Object.keys(grouped)[0];
        if (firstPage) setCurrentPage(firstPage);
      } catch (err) {
        console.log("❌ โหลด timeline ล้มเหลว", err);
      }
    };

    fetchTimeline();
  }, [username, projectName]);

  // ปรับขนาด textarea อัตโนมัติเมื่อเปลี่ยน events
  useEffect(() => {
    resizeAllTextareas();
  }, [events]);

  // ฟังก์ชันบันทึกข้อมูล timeline ลง MongoDB
  const saveToMongo = async (updated) => {
    try {
      await fetch("http://localhost:5000/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: projectName,
          username,
          page: currentPage,
          events: updated[currentPage],
        }),
      });
    } catch {
      alert("❌ ไม่สามารถบันทึก timeline ได้");
    }
  };

  // จัดการการเพิ่มหรือแก้ไขเหตุการณ์
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      setError("กรุณากรอกชื่อเหตุการณ์และวันที่");
      return;
    }

    const updated = { ...events };
    if (!updated[currentPage]) updated[currentPage] = [];

    if (editIndex !== null) {
      updated[currentPage][editIndex] = newEvent;
      setEditIndex(null);
    } else {
      updated[currentPage].push(newEvent);
    }

    setEvents(updated);
    setNewEvent({ title: "", date: "", description: "" });
    setError("");
    saveToMongo(updated);
  };

  // อัปเดต state เมื่อผู้ใช้กรอกข้อมูลในฟอร์ม
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // เปลี่ยนหน้า timeline ปัจจุบัน
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setNewEvent({ title: "", date: "", description: "" });
    setEditIndex(null);
    setError("");
  };

  // สร้างหน้า timeline ใหม่
  const handleCreateNewPage = () => {
    const pageName = prompt("กรุณากรอกชื่อ Timeline ที่ต้องการสร้าง:");
    if (pageName && !events[pageName]) {
      setEvents({ ...events, [pageName]: [] });
      setCurrentPage(pageName);
    } else {
      alert("ชื่อซ้ำหรือไม่ถูกต้อง");
    }
  };

  // แก้ไขเหตุการณ์ที่เลือก
  const handleEditEvent = (index) => {
    setNewEvent(events[currentPage][index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ลบเหตุการณ์ออกจากหน้า timeline
  const handleDeleteEvent = (index) => {
    if (!window.confirm("คุณต้องการลบเหตุการณ์นี้หรือไม่?")) return;

    const updated = { ...events };
    updated[currentPage].splice(index, 1);
    setEvents(updated);
    saveToMongo(updated);
  };

  // เปลี่ยนชื่อหน้า timeline และบันทึกการเปลี่ยนแปลงลง MongoDB
  const handleRenamePage = async (oldName) => {
    const newName = prompt("กรุณากรอกชื่อใหม่ของ Timeline:", oldName);
    if (!newName || newName === oldName || events[newName]) return;

    const updated = { ...events };
    updated[newName] = updated[oldName];
    delete updated[oldName];
    setEvents(updated);
    setCurrentPage(newName);

    try {
      await fetch(`http://localhost:5000/api/timeline`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, project: projectName, page: oldName }),
      });

      await fetch(`http://localhost:5000/api/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, project: projectName, page: newName, events: updated[newName] }),
      });
    } catch (err) {
      alert("❌ ไม่สามารถเปลี่ยนชื่อ timeline ได้");
      console.error(err);
    }
  };

  // ลบหน้า timeline
  const handleDeletePage = async (page) => {
    if (!window.confirm(`คุณต้องการลบ Timeline "${page}" หรือไม่? ข้อมูลทั้งหมดจะหายไป`)) return;

    const updated = { ...events };
    delete updated[page];
    setEvents(updated);

    if (currentPage === page) {
      const remaining = Object.keys(updated);
      setCurrentPage(remaining.length > 0 ? remaining[0] : null);
    }

    try {
      await fetch(`http://localhost:5000/api/timeline`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, project: projectName, page }),
      });
    } catch (err) {
      alert("❌ ไม่สามารถลบ timeline ได้");
      console.error(err);
    }
  };

  // ปรับขนาด textarea ให้พอดีกับเนื้อหา
  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const resizeAllTextareas = () => {
    setTimeout(() => {
      document.querySelectorAll("textarea").forEach((textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      });
    }, 0);
  };

  // คำแนะนำการใช้งานสำหรับ tutorial modal
  const tutorialSteps = [
    "คลิกปุ่ม `+ New` เพื่อสร้างหน้า Timeline ใหม่ เช่น 'บทที่ 1' หรือ 'ช่วงสงครามกลางเมือง'",
    "คลิกชื่อ Timeline ที่ต้องการจัดการ เพื่อเปิดหน้าดังกล่าว",
    "กรอกชื่อเหตุการณ์ เช่น 'กำเนิดราชาองค์ใหม่'",
    "กรอกวันที่ในโลกนิยาย เช่น 'วันที่ 5 เดือนมังกร' หรือ 'ปีที่ 3 หลังสงคราม'",
    "พิมพ์คำอธิบายเหตุการณ์เพิ่มเติมในช่องด้านล่าง (รองรับหลายบรรทัด)",
    "คลิกปุ่ม `+ เพิ่มเหตุการณ์` เพื่อบันทึกเหตุการณ์ใหม่ลงหน้านั้น",
    "หากต้องการแก้ไข ให้กด `แก้ไข` ที่เหตุการณ์นั้น แล้วปรับข้อมูลและกด `💾 บันทึกการแก้ไข`",
    "หากต้องการลบเหตุการณ์ กด `ลบ` ที่เหตุการณ์นั้น",
    "คุณสามารถเปลี่ยนชื่อ Timeline ได้โดยคลิก `✏️เปลี่ยนชื่อ` ที่หัวข้อ",
    "หากต้องการลบ Timeline ทั้งหน้า ให้คลิก `🗑️ลบไทม์ไลน์` และยืนยันการลบ",
  ];

  // ------------------------- RETURN -------------------------
  return (
    <div className="timeline-wrapper">
      <h1 className="item-header">
        <button className="tutorial-button" onClick={() => setTutorialOpen(true)}>
          📘 Tutorial !
        </button>
      </h1>

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setTutorialOpen(false)}
        title="วิธีใช้งาน Timeline"
        steps={tutorialSteps}
        gifUrl="\assets\tutorials\Timeline-Tutorial.gif"
      />

      <h2>🕒 Timeline</h2>

      {/* หากยังไม่มีหน้า timeline และไม่ใช่โหมดอ่านอย่างเดียว */}
      {currentPage === null && !readonly && (
        <div className="create-page-section">
          <button onClick={handleCreateNewPage}>+ New</button>
        </div>
      )}

      {currentPage !== null && (
        <div>
          <div className="timeline-pages">
            {Object.keys(events).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ))}
            {!readonly && <button onClick={handleCreateNewPage}>+ New</button>}
          </div>

          {!readonly && (
            <div className="timeline-form">
              <h3>{editIndex !== null ? "แก้ไขเหตุการณ์" : `เพิ่มเหตุการณ์ใน ${currentPage}`}</h3>
              {error && <div className="error-message">{error}</div>}

              <input
                type="text"
                name="title"
                placeholder="ชื่อเหตุการณ์"
                value={newEvent.title}
                onChange={handleChange}
              />
              <input
                type="text"
                name="date"
                placeholder="วันที่ในโลกนิยาย (เช่น: วันที่ 5 เดือน มังกร)"
                value={newEvent.date}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="รายละเอียดเพิ่มเติม..."
                value={newEvent.description}
                onChange={(e) => {
                  handleChange(e);
                  autoResize(e.target);
                }}
                ref={(el) => el && autoResize(el)}
              />
              <button onClick={handleAddEvent}>
                {editIndex !== null ? "💾 บันทึกการแก้ไข" : "+ เพิ่มเหตุการณ์"}
              </button>
            </div>
          )}

          <div className="timeline-list">
            <h3>
              เหตุการณ์ใน {currentPage}{" "}
              {!readonly && (
                <>
                  <button
                    className="timeline-header-btn"
                    onClick={() => handleRenamePage(currentPage)}
                    title="เปลี่ยนชื่อ"
                  >✏️เปลี่ยนชื่อ</button>
                  <button
                    className="timeline-header-btn"
                    onClick={() => handleDeletePage(currentPage)}
                    title="ลบไทม์ไลน์"
                  >🗑️ลบไทม์ไลน์</button>
                </>
              )}
            </h3>

            {/* รายการเหตุการณ์ */}
            {events[currentPage] &&
              events[currentPage].map((event, index) => (
                <div key={index} className="timeline-event">
                  <div className="event-content">
                    <div>
                      <div className="event-date">{event.date}</div>
                      <div className="event-title">{event.title}</div>
                      {event.description && <div className="event-description">{event.description}</div>}
                    </div>
                    {!readonly && (
                      <div className="event-actions">
                        <button onClick={() => handleEditEvent(index)}>แก้ไข</button>
                        <button onClick={() => handleDeleteEvent(index)}>ลบ</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimelinePanel;
