import React, { useState, useEffect } from "react";
import "./ClanSubfiction.css";

function ClanSubfiction() {
  const [clans, setClans] = useState({});
  const [clanInfos, setClanInfos] = useState({});
  const [selectedClan, setSelectedClan] = useState(null);
  const username = localStorage.getItem("username");
  const project = localStorage.getItem("last-project");

  useEffect(() => {
    loadClans();
  }, []);

  const loadClans = async () => {
    try {
      const [charRes, groupRes] = await Promise.all([
        fetch(`http://localhost:5000/api/characters?username=${username}&project=${project}`),
        fetch(`http://localhost:5000/api/groups?username=${username}&project=${project}`)
      ]);

      const characters = await charRes.json();
      const groups = await groupRes.json();

      const grouped = {};
      const meta = {};

      (groups || []).forEach((group) => {
        const clan = group.clanName?.trim() || "Unassigned";
        grouped[clan] = [];
        meta[clan] = {
          image: group.images?.[0]?.url || null,
          note: group.note || "",
          links: group.links || [],
          history: typeof group.description === "object"
            ? `${group.description.name}: ${group.description.description}`
            : group.description || "",
        };
      });

      if (Array.isArray(characters)) {
        characters.forEach((char) => {
          const clan = char.clan?.trim() || "Unassigned";
          if (!grouped[clan]) grouped[clan] = [];
          grouped[clan].push(char);
        });
      }

      setClans(grouped);
      setClanInfos(meta);
    } catch (err) {
      console.error("❌ โหลด clan/group ล้มเหลว:", err);
    }
  };

  const handleDeleteClan = async (e, clanName) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(`ต้องการลบ Clan "${clanName}" หรือไม่?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/groups/${encodeURIComponent(clanName)}?username=${username}&project=${project}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ล้มเหลว");

      alert("✅ ลบ Clan สำเร็จ");
      setSelectedClan(null);
      loadClans();
    } catch (err) {
      alert("❌ ระบบลบ Clan ล้มเหลว: " + err.message);
    }
  };

  return (
    <div className="clan-wrapper">
      <h2>🏰 Clan Directory</h2>
      <div className="clan-layout">
        <div className="clan-list-panel">
          <h3>All Clans</h3>
          <ul className="clan-list">
            {Object.entries(clans).map(([clanName, members]) => (
              <li
                key={clanName}
                className={selectedClan === clanName ? "active" : ""}
                onClick={() => setSelectedClan(clanName)}
              >
                {clanName} ({members.length})
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteClan(e, clanName)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="clan-member-panel">
          {selectedClan ? (
            <>
              <h3>{selectedClan}</h3>

              {clanInfos[selectedClan]?.image && (
                <img
                  src={clanInfos[selectedClan].image}
                  alt="clan"
                  className="clan-cover"
                />
              )}

              {clanInfos[selectedClan]?.note && (
                <p style={{ fontStyle: "italic", marginTop: 10 }}>
                  📝 {clanInfos[selectedClan].note}
                </p>
              )}

              {clanInfos[selectedClan]?.history && (
                <div style={{ marginTop: 10 }}>
                  <h4>📜 ประวัติ Clan</h4>
                  <p>{clanInfos[selectedClan].history}</p>
                </div>
              )}

              {clanInfos[selectedClan]?.links?.length > 0 && (
                <ul className="clan-links">
                  {clanInfos[selectedClan].links.map((link, i) => (
                    <li key={i}>
                      🔗 <a href={link} target="_blank" rel="noreferrer">{link}</a>
                    </li>
                  ))}
                </ul>
              )}

              {clans[selectedClan].length > 0 ? (
                <ul className="member-list">
                  {clans[selectedClan].map((char) => (
                    <li key={char._id} className="character-card">
                      {char.image && (
                        <img
                          src={char.image}
                          alt={char.name}
                          className="character-avatar"
                        />
                      )}
                      <div className="character-info">
                        <h4>{char.name}</h4>
                        <p>Gender: {char.gender}</p>
                        <p>Age: {char.age}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="placeholder">ยังไม่มีสมาชิกใน Clan นี้</p>
              )}
            </>
          ) : (
            <p className="placeholder">เลือก Clan ทางซ้ายเพื่อดูสมาชิก</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClanSubfiction;
