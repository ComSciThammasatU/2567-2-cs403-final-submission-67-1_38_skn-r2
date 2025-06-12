// ✅ Finalized NewCharacter.js with PUT support for editing
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NewCharacter.css";
import TutorialModal from '../components/TutorialModal';

function NewCharacter() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [backstory, setBackstory] = useState("");
  const [relations, setRelations] = useState([]);
  const [relationInput, setRelationInput] = useState("");
  const [traits, setTraits] = useState([]);
  const [personality, setPersonality] = useState([]);
  const [clan, setClan] = useState("");
  const [clanOptions, setClanOptions] = useState([]);
  const [characterOptions, setCharacterOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const [relationLabel, setRelationLabel] = useState("");
  const username = localStorage.getItem("username");
  const project = localStorage.getItem("last-project");
  const [links, setLinks] = useState([]);
  const [linkInput, setLinkInput] = useState("");
  const [isTutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!username || !project) return;

      try {
        const [resClans, resChars] = await Promise.all([
          fetch(`http://localhost:5000/api/groups?username=${username}&project=${project}`),
          fetch(`http://localhost:5000/api/characters?username=${username}&project=${project}`),
        ]);
        const clanData = await resClans.json();
        const charData = await resChars.json();
        setClanOptions(clanData.map((g) => g.clanName));
        setCharacterOptions(charData);
      } catch (err) {
        console.error("❌ โหลดข้อมูล clan/characters ล้มเหลว", err);
      }
    };

    fetchInitialData();

    const editData = JSON.parse(localStorage.getItem("edit_character"));
    if (editData) {
      setEditingId(editData._id);
      setImage(editData.image || null);
      setName(editData.name || "");
      setGender(editData.gender || "");
      setAge(editData.age || "");
      setBackstory(editData.backstory || "");
      setRelations(editData.relations || []);
      setTraits(editData.traits || []);
      setPersonality(editData.personality || []);
      setLinks(editData.links || []);
      setClan(editData.clan || "");
      localStorage.removeItem("edit_character");
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const addRelation = () => {
    if (relationLabel && relationInput) {
      const relation = `${relationLabel}ของ${relationInput}`;
      setRelations([...relations, relation]);
      setRelationLabel("");
      setRelationInput("");
    } else {
      alert("กรอกความสัมพันธ์ และเลือกตัวละคร");
    }
  };


  const addTrait = () => {
    setTraits([...traits, { name: "", description: "" }]);
  };

  const addPersonality = () => {
    setPersonality([...personality, { name: "", description: "" }]);
  };

  const resetForm = () => {
    setEditingId(null);
    setImage(null);
    setName("");
    setGender("");
    setAge("");
    setBackstory("");
    setRelations([]);
    setRelationInput("");
    setTraits([]);
    setPersonality([]);
    setLinks([]);
    setClan("");
  };

  const handleSaveCharacter = async () => {
    if (!username || !name || !project) {
      alert("กรุณากรอกชื่อ และเข้าสู่ระบบ");
      return;
    }

    const newCharacter = {
      username,
      project,
      name,
      gender,
      age,
      backstory,
      relations,
      traits,
      personality,
      links,
      image,
      clan,
    };

    const url = editingId
      ? `http://localhost:5000/api/characters/${editingId}`
      : "http://localhost:5000/api/characters";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCharacter),
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ ตัวละครถูกบันทึกลง MongoDB แล้ว!");
        resetForm();
        navigate("/editor", { state: { selectedSection: "CharacterListPanel" } });
      } else {
        alert("❌ บันทึกไม่สำเร็จ: " + data.error);
      }
    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  const autoResizeTextarea = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };


  const addLink = () => {
    if (linkInput.trim() !== "") {
      setLinks([...links, linkInput.trim()]);
      setLinkInput(""); 
    }
  };

  const tutorialSteps = [
    "อัปโหลดภาพตัวละคร (คลิกปุ่มเลือกรูป)",
    "พิมพ์ชื่อ เพศ อายุ และเลือก Clan ให้ตัวละคร",
    "เขียนเรื่องราวของตัวละครในช่อง Backstory",
    "เพิ่มความสัมพันธ์กับตัวละครอื่น โดยใส่ความสัมพันธ์และเลือกชื่อ",
    "เพิ่มลักษณะภายนอก เช่น สีผม ส่วนสูง ฯลฯ",
    "ใส่บุคลิกภาพ เช่น ใจดี ขี้อาย ฯลฯ",
    "เพิ่มลิงก์อ้างอิง เช่นคลิป YouTube หรือ Google Drive",
    "กดปุ่ม 💾 Save Character เพื่อบันทึกลงระบบ",
  ];

  return (
    <div className="new-char-wrapper">
      <h2 className="research-header">➕ New character &nbsp;
            {/* ปุ่ม Tutorial */}
            <button className="tutorial-button" onClick={() => setTutorialOpen(true)}>
              📘 Tutorial !
            </button>
            </h2>
            <TutorialModal
              isOpen={isTutorialOpen}
              onClose={() => setTutorialOpen(false)}
              title="วิธีใช้งาน New Character"
              steps={tutorialSteps}
              gifUrl="\assets\tutorials\New-character-tutorial.gif"
            />
      <div className="grid">
        <div className="character-panel image-panel">
          <h4>Image</h4>
          {image ? <img src={image} alt="Character" className="preview" /> : <div className="image-placeholder">No Image</div>}
          <input type="file" onChange={handleImageChange} />
        </div>

        <div className="character-panel basic-info">
          <h4>Basic Info</h4>
          <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-field">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
          <select value={clan} onChange={(e) => setClan(e.target.value)} className="input-field">
            <option value="">เลือก Clan</option>
            {clanOptions.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="character-panel backstory">
          <h4>Backstory</h4>
          <textarea
            value={backstory}
            onChange={(e) => setBackstory(e.target.value)}
            onInput={autoResizeTextarea}
            placeholder="พิมพ์เรื่องราว..."
            rows={1}
          />
        </div>

        <div className="character-panel relations">
          <h4>Relations</h4>
          <ul>
            {relations.map((rel, idx) => (
              <li key={idx}>👥 {rel}</li>
            ))}
          </ul>

          {/* กล่องกรอก + select อยู่แนวเดียวกัน */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              value={relationLabel}
              onChange={(e) => setRelationLabel(e.target.value)}
              placeholder="ใส่ความสัมพันธ์ เช่น แม่, เพื่อน"
              className="input-field"
              style={{ flex: 2 }}
            />

            <select
              value={relationInput}
              onChange={(e) => setRelationInput(e.target.value)}
              className="input-field"
              style={{ flex: 1 }}
            >
              <option value="">เลือกตัวละคร</option>
              {characterOptions.map((char) => (
                <option key={char._id} value={char.name}>
                  {char.name}
                </option>
              ))}
            </select>
            <button
              onClick={addRelation}
              style={{ flex: 1 }}
            >
              + Add Relation
            </button>
          </div>

        </div>

        <div className="character-panel traits">
          <h4>Physical Traits</h4>
          {traits.map((item, idx) => (
            <input
              key={idx}
              placeholder={`Trait ${idx + 1}`}
              value={item.name}
              onChange={(e) => {
                const updatedTraits = [...traits];
                updatedTraits[idx].name = e.target.value;
                setTraits(updatedTraits);
              }}
            />
          ))}
          <button onClick={addTrait}>+ Add Trait</button>
        </div>

        <div className="character-panel personality">
          <h4>Personality</h4>
          {personality.map((item, idx) => (
            <input
              key={idx}
              placeholder={`Personality ${idx + 1}`}
              value={item.name}
              onChange={(e) => {
                const updated = [...personality];
                updated[idx].name = e.target.value;
                setPersonality(updated);
              }}
            />
          ))}
          <button onClick={addPersonality}>+ Add Trait</button>
        </div>

        <div className="character-panel links">
          <h4>Links</h4>

          {/* แสดงรายการลิงก์ */}
          <ul>
            {links.map((link, idx) => (
              <li key={idx}>
                🔗 <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
              </li>
            ))}
          </ul>

          {/* ช่องกรอก + ปุ่มเพิ่ม */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="ใส่ลิงก์ เช่น https://..."
              className="input-field"
              style={{ flex: 3 }}
            />
            <button style={{ flex: 1 }} onClick={addLink}>+ Add Link</button>
          </div>
        </div>
      </div>

      <div className="button-save-container">
        <button onClick={handleSaveCharacter} className="button-save">💾 Save Character</button>
      </div>
    </div>
  );
}

export default NewCharacter;
