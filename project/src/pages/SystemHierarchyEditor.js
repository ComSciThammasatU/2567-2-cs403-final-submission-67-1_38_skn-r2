import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import "./SystemHierarchyEditor.css";
import TutorialModal from '../components/TutorialModal';

const nodeDefaults = {
  style: {
    border: "1px solid #888",
    padding: 10,
    borderRadius: 8,
    background: "#fff",
    width: 180,
  },
};

function SystemHierarchyEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [charList, setCharList] = useState([]);
  const [username, setUsername] = useState("");
  const [project, setProject] = useState("");
  const [saveName, setSaveName] = useState("Untitled");
  const [allSaves, setAllSaves] = useState([]);
  const [selectedSave, setSelectedSave] = useState("");
  const [isTutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    const fetchCharactersAndSystems = async () => {
      const user = localStorage.getItem("username");
      const proj = localStorage.getItem("last-project");
      if (!user || !proj) return;

      setUsername(user);
      setProject(proj);

      try {
        const [charRes, systemRes] = await Promise.all([
          fetch(`http://localhost:5000/api/characters?username=${user}&project=${proj}`),
          fetch(`http://localhost:5000/api/system?username=${user}&project=${proj}`),
        ]);
        const charData = await charRes.json();
        const systemData = await systemRes.json();
        setCharList(charData || []);
        setAllSaves(systemData.map((s) => s.name));
      } catch (err) {
        console.error("โหลดตัวละครหรือระบบล้มเหลว", err);
      }
    };
    fetchCharactersAndSystems();
  }, []);

  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const EditableTitleNode = ({
    nodeId,
    title = "Title",
    character,
    characters = [],
    onAddCharacter,
    onCreateChild,
    onTitleChange,
    initialCharacter,
  }) => {
    const [nodeTitle, setNodeTitle] = useState(title);
    const [selectedChar, setSelectedChar] = useState(initialCharacter?.name || "");
    const [showAddChild, setShowAddChild] = useState(false);
    const [childCharacter, setChildCharacter] = useState("");

    useEffect(() => {
      setNodeTitle(title || "");
    }, [title]);

    useEffect(() => {
      if (initialCharacter && !character) {
        onAddCharacter(nodeId, initialCharacter.name);
      }
    }, [initialCharacter]);

    const handleTitleChange = (e) => {
      const value = e.target.value;
      setNodeTitle(value);
      onTitleChange?.(nodeId, value);
    };

    const handleSelect = (e) => {
      const value = e.target.value;
      setSelectedChar(value);
      onAddCharacter(nodeId, value);
    };

    const handleShowAdd = () => setShowAddChild(true);

    const handleCreateChild = () => {
      const char = characters.find((c) => c.name === childCharacter);
      if (char) {
        onCreateChild(nodeId, char);
        setShowAddChild(false);
        setChildCharacter("");
      }
    };

    return (
      <div className="system-node-wrapper">
        <button onClick={() => handleDeleteNode(nodeId)} style={{ position: "absolute", top: -8, right: -8, background: "red", color: "white", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 12, cursor: "pointer", zIndex: 1 }}>×</button>
        <input value={nodeTitle} onChange={handleTitleChange} className="system-node-title" />
        <select value={selectedChar} onChange={handleSelect}>
          <option value="">ใส่ชื่อตัวละคร</option>
          {(characters || []).map((c, idx) => (
            <option key={idx} value={c.name}>{c.name}</option>
          ))}
        </select>
        {character && (
          <>
            <img src={character.image} alt={character.name} className="system-node-image" />
            <div className="system-node-character-name">{character.name}</div>
          </>
        )}
        <button className="system-node-button" onClick={handleShowAdd}>+ Add</button>
        {showAddChild && (
          <div style={{ marginTop: 8 }}>
            <select value={childCharacter} onChange={(e) => setChildCharacter(e.target.value)}>
              <option value="">เลือกตัวละครลูก</option>
              {(characters || []).map((c, idx) => (
                <option key={idx} value={c.name}>{c.name}</option>
              ))}
            </select>
            <button onClick={handleCreateChild} className="system-node-button">✅ Confirm</button>
          </div>
        )}
      </div>
    );
  };

  const sanitizeNodes = (nodes) => {
    return nodes.map((node) => {
      const props = node?.data?.label?.props || {};
      return {
        id: node.id,
        position: node.position,
        data: {
          title: props.title || "",
          character: props.character || null,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!saveName.trim()) return alert("กรุณาตั้งชื่อระบบ");
    try {
      const cleanedNodes = sanitizeNodes(nodes);
      const res = await fetch("http://localhost:5000/api/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, project, name: saveName, nodes: cleanedNodes, edges }),
      });
      if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึก");
      if (!allSaves.includes(saveName)) setAllSaves([...allSaves, saveName]);
      alert("✅ บันทึกสำเร็จ");
    } catch (err) {
      alert("❌ บันทึกล้มเหลว: " + err.message);
    }
  };

  const handleLoad = async (name) => {
    try {
      const res = await fetch(`http://localhost:5000/api/system?username=${username}&project=${project}`);
      const data = await res.json();
      const target = data.find((s) => s.name === name);
      if (target) {
        const loadedNodes = target.nodes.map((n) => ({
          id: n.id,
          position: n.position,
          data: {
            label: (
              <EditableTitleNode
                nodeId={n.id}
                title={n.data?.title || ""}
                character={n.data?.character || null}
                onAddCharacter={handleAttachCharacter}
                onCreateChild={handleAddNode}
                onTitleChange={handleTitleChange}
                characters={Array.isArray(charList) ? charList : []}
              />
            ),
          },
          ...nodeDefaults,
        }));

        const styledEdges = (target.edges || []).map((edge) => ({
          ...edge,
          animated: true,
          style: { stroke: "#fff", strokeWidth: 3 },
        }));

        setNodes(loadedNodes);
        setEdges(styledEdges);
        setSaveName(name);
      }
    } catch {
      alert("❌ โหลดล้มเหลว");
    }
  };

  const handleDeleteSystem = async (name) => {
    if (!name) return;
    const confirmed = window.confirm(`คุณต้องการลบระบบ "${name}" หรือไม่?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/system/${username}/${project}/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");

      alert("✅ ลบระบบสำเร็จ");
      setAllSaves((prev) => prev.filter((n) => n !== name));
      setSelectedSave("");
      setNodes([]);
      setEdges([]);
      setSaveName("Untitled");
    } catch (err) {
      alert("❌ ล้มเหลว: " + err.message);
    }
  };

  const handleTitleChange = (nodeId, newTitle) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                label: (
                  <EditableTitleNode
                    nodeId={nodeId}
                    title={newTitle}
                    character={n.data.label?.props?.character || null}
                    onAddCharacter={handleAttachCharacter}
                    onCreateChild={handleAddNode}
                    onTitleChange={handleTitleChange}
                    characters={Array.isArray(charList) ? charList : []}
                  />
                ),
              },
            }
          : n
      )
    );
  };

  const handleAddNode = (parentId = null, character = null) => {
    const newId = `${Date.now()}`;
    const newNode = {
      id: newId,
      data: {
        label: (
          <EditableTitleNode
            nodeId={newId}
            onAddCharacter={handleAttachCharacter}
            onCreateChild={handleAddNode}
            onTitleChange={handleTitleChange}
            characters={Array.isArray(charList) ? charList : []}
            initialCharacter={character}
            title=""
          />
        ),
      },
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      ...nodeDefaults,
    };
    setNodes((nds) => [...nds, newNode]);

    if (parentId) {
      setEdges((eds) =>
        addEdge({ source: parentId, target: newId, animated: true, style: { stroke: "#fff", strokeWidth: 3 } }, eds)
      );
    }
  };

  const handleAttachCharacter = (nodeId, charName) => {
    const found = charList.find((c) => c.name.toLowerCase() === charName.toLowerCase());
    if (!found) return alert("ไม่พบบุคคลนี้ในระบบตัวละคร");

    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                label: (
                  <EditableTitleNode
                    nodeId={nodeId}
                    onAddCharacter={handleAttachCharacter}
                    onCreateChild={handleAddNode}
                    onTitleChange={handleTitleChange}
                    characters={Array.isArray(charList) ? charList : []}
                    title={node.data.label?.props?.title}
                    character={found}
                  />
                ),
              },
            }
          : node
      )
    );
  };

  return (
    <div className="system-hierarchy-editor" style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      <h2 className="system-header">
        ⚙️ Systems
        <button className="tutorial-button" onClick={() => setTutorialOpen(true)}>📘 Tutorial !</button>
      </h2>
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setTutorialOpen(false)}
        title="วิธีใช้งาน Systems"
        steps={["กดปุ่ม + Root Node เพื่อเพิ่มโหนดใหม่", "เลือกตัวละคร", "เพิ่มลูกโหนด"]}
        gifUrl="/assets/tutorials/Systems-Tutorial.gif"
      />
      <div style={{ padding: 10, display: "flex", gap: 10 }}>
        <input type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="ชื่อระบบ" />
        <button onClick={handleSave}>💾 Save</button>
        <select value={selectedSave} onChange={(e) => { setSelectedSave(e.target.value); handleLoad(e.target.value); }}>
          <option value="">📂 Load</option>
          {allSaves.map((s, i) => (<option key={i} value={s}>{s}</option>))}
        </select>
        <button onClick={() => handleDeleteSystem(selectedSave)} disabled={!selectedSave}>🗑 Delete</button>
        <button onClick={() => handleAddNode(null)}>+ Root Node</button>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) =>
            setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#fff", strokeWidth: 3 } }, eds))
          }
          fitView
        >
          <MiniMap className="fixed-minimap" pannable zoomable />
          <Controls className="fixed-controls" />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default SystemHierarchyEditor;
