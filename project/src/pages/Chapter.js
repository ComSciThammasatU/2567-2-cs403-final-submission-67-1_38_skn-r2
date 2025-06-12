import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Chapter.css";

function Chapter() {
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const project = localStorage.getItem("last-project");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/manuscript?username=${username}&project=${project}`
        );
        const data = await res.json();
        setChapters(data);
      } catch (err) {
        console.error("❌ โหลด chapters ล้มเหลว", err);
      }
    };
    if (username && project) fetchChapters();
  }, [username, project]);

  const goToEditor = (chapter) => {
    navigate("/editor", {
      state: {
        projectName: chapter.project,
        prefill: chapter.content,
        prefillTitle: chapter.title,
      },
    });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    if (result.destination.droppableId === "trash") {
      const chapterToRemove = chapters[result.source.index];

      const confirmDelete = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${chapterToRemove.title}"?`);
      if (!confirmDelete) return;

      try {
        const res = await fetch(`http://localhost:5000/api/manuscript/${chapterToRemove._id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "ลบไม่สำเร็จ");
        }

        console.log("✅ ลบบทสำเร็จ");
      } catch (err) {
        console.error("❌ ลบจากบทไม่สำเร็จ", err);
      }

      const updated = [...chapters];
      updated.splice(result.source.index, 1);
      setChapters(updated);
      return;
    }

    // ถ้าแค่ reorder
    const reordered = Array.from(chapters);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setChapters(reordered);
  };

  return (
    <div className="chapter-container">
      <h2 className="chapter-header">📚 Chapter Directory</h2>
      {chapters.length === 0 ? (
        <p>ยังไม่มีบทที่ถูกบันทึกจาก Manuscript</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="chapter-list">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="chapter-list"
              >
                {chapters.map((chap, idx) => (
                  <Draggable
                    key={`chapter-${chap._id || chap.title}-${idx}`}
                    draggableId={`chapter-${chap._id || chap.title}-${idx}`}
                    index={idx}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={provided.draggableProps.style}
                      >
                        <div className="chapter-item">
                          <div
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            title="ลากเพื่อเรียงลำดับ"
                          >
                            ☰
                          </div>

                          <div className="chapter-content">
                            <div
                              className="chapter-title"
                              onClick={() => goToEditor(chap)}
                            >
                              {chap.title}
                            </div>
                            <p className="chapter-excerpt">
                              {chap.content?.slice(0, 200)}...
                            </p>
                            <button
                              className="open-button"
                              onClick={() => goToEditor(chap)}
                            >
                              ✍️ เปิดใน Manuscript
                            </button>
                          </div>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>

          <Droppable droppableId="trash">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`trash-dropzone ${
                  snapshot.isDraggingOver ? "drag-over" : ""
                }`}
              >
                🗑️ ลากบทมาทิ้งที่นี่เพื่อลบ
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

export default Chapter;
