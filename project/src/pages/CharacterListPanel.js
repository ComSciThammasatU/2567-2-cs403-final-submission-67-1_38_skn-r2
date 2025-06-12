import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CharacterListPanel.css";

function CharacterListPanel() {
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const project = localStorage.getItem("last-project");

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!username || !project) return;

      try {
        const res = await fetch(`http://localhost:5000/api/characters?username=${username}&project=${project}`);
        const data = await res.json();
        setCharacters(data);
      } catch (err) {
        console.error("❌ โหลดตัวละครล้มเหลว:", err);
      }
    };

    fetchCharacters();
  }, [username, project]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบตัวละครนี้?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/characters/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (res.ok) {
        setCharacters((prev) => prev.filter((char) => char._id !== id));
      } else {
        alert("❌ ลบไม่สำเร็จ: " + data.error);
      }
    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const handleEdit = (char) => {
    localStorage.setItem("edit_character", JSON.stringify(char));
    navigate("/NewCharacter");
  };

  return (
    <div className="character-list-wrapper">
      <h2>📚 All Characters</h2>
      {characters.length === 0 && <p>ยังไม่มีตัวละครที่ถูกบันทึก</p>}

      <div className="character-list">
        {characters.map((char) => (
          <div key={char._id} className="character-card">
            {char.image && (
              <img
                src={char.image}
                alt={char.name}
                className="character-thumbnail"
              />
            )}
            <div className="character-info">
  <h4>{char.name}</h4>
  <div className="left-aligned">
    <p>🧬 Gender: {char.gender}</p>
    <p>🎂 Age: {char.age}</p>
    <p>🏰 Clan: {char.clan || "—"}</p>
    <p>📖 Backstory: {char.backstory || "—"}</p>
    <p>🔗 Links: {(char.links || []).join(", ") || "—"}</p>

    <p>🧠 <strong>Traits:</strong></p>
    <ul>
      {(char.traits || []).map((t, i) => (
        <li key={i}>{t.name}{t.description ? `: ${t.description}` : ""}</li>
      ))}
    </ul>

    <p>🎭 <strong>Personality:</strong></p>
    <ul>
      {(char.personality || []).map((p, i) => (
        <li key={i}>{p.name}{p.description ? `: ${p.description}` : ""}</li>
      ))}
    </ul>

    <p>👥 <strong>Relations:</strong></p>
    <ul>
      {(char.relations || []).map((r, i) => (
        <li key={i}>{r}</li>
      ))}
    </ul>
  </div>
</div>

            <div className="character-buttons">
              <button onClick={() => handleEdit(char)}>📝 Edit</button>
              <button onClick={() => handleDelete(char._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterListPanel;