import React, { useCallback, useState, useEffect, useRef } from "react";
import CustomCharacterNode from "./CustomCharacterNode";
import './RelationshipEditor.css';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import TutorialModal from '../components/TutorialModal';

const nodeTypes = {
  customNode: CustomCharacterNode,
};

function RelationshipEditorContent() {
  const username = localStorage.getItem("username");
  const project = localStorage.getItem("last-project");
  const reactFlowWrapper = useRef(null);
  const [characters, setCharacters] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [saveName, setSaveName] = useState("Untitled");
  const [allSaves, setAllSaves] = useState([]);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedGraph, setSelectedGraph] = useState("");
  const [isTutorialOpen, setTutorialOpen] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [resChar, resGraph] = await Promise.all([
        fetch(`http://localhost:5000/api/characters?username=${username}&project=${project}`),
        fetch(`http://localhost:5000/api/relationships?username=${username}&project=${project}`),
      ]);
      const charData = await resChar.json();
      const graphData = await resGraph.json();
      setCharacters(charData);
      setAllSaves(graphData.map((g) => g.name));
    } catch (err) {
      console.error("โหลดข้อมูลล้มเหลว", err);
    }
  }, [username, project]);

  const onEdgeDoubleClick = (event, edge) => {
  const newLabel = prompt("แก้ไขชื่อความสัมพันธ์:", edge.label);
  if (newLabel !== null) {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edge.id ? { ...e, label: newLabel } : e
      )
    );
  }
};

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onConnect = useCallback((params) => {
    const label = prompt("ใส่ความสัมพันธ์ระหว่างตัวละคร:");
    if (!label) return;
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          label,
          animated: true,
          style: { stroke: "#333" },
          labelBgStyle: { fill: "#fff", color: "#333", fillOpacity: 0.7 },
        },
        eds
      )
    );
  }, [setEdges]);

  const deleteNodeById = (id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const injectDeleteCallback = (nodes) =>
    nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDelete: () => deleteNodeById(node.id),
      },
    }));

  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("application/json"));
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    const id = `${+new Date()}`;
    const newNode = {
      id,
      type: "customNode",
      position,
      data: {
        label: data.name,
        image: data.image,
        onDelete: () => deleteNodeById(id),
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleSave = async () => {
    if (!saveName.trim()) return alert("กรุณาตั้งชื่อแผนผัง");
    try {
      const res = await fetch("http://localhost:5000/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          project,
          name: saveName.trim(),
          nodes,
          edges,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        if (!allSaves.includes(saveName)) {
          setAllSaves([...allSaves, saveName]);
        }
      } else {
        alert("❌ บันทึกล้มเหลว: " + data.error);
      }
    } catch (err) {
      alert("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  };

  const loadByName = async (name) => {
    try {
      const res = await fetch(`http://localhost:5000/api/relationships?username=${username}&project=${project}`);
      const data = await res.json();
      const target = data.find((g) => g.name === name);
      if (target) {
        setNodes(injectDeleteCallback(target.nodes));
        setEdges(target.edges);
        setSaveName(name);
        setSelectedGraph(name);
        alert(`✅ โหลด "${name}" แล้ว`);
      }
    } catch (err) {
      alert("❌ โหลดล้มเหลว");
    }
    setShowLoadMenu(false);
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
  };

  const toggleEditName = () => setEditingName(true);
  const confirmEditName = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      setEditingName(false);
      setSaveName(saveName.trim() || "Untitled");
    }
  };

  const handleDeleteGraph = async () => {
    if (!selectedGraph) return alert("เลือกกราฟที่จะลบก่อน");
    const confirm = window.confirm(`คุณต้องการลบกราฟ "${selectedGraph}" หรือไม่?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/relationships/${selectedGraph}?username=${username}&project=${project}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ ลบสำเร็จ");
        setSelectedGraph("");
        setSaveName("Untitled");
        setNodes([]);
        setEdges([]);
        loadAll();
      } else {
        alert("❌ ลบไม่สำเร็จ: " + data.error);
      }
    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  const tutorialSteps = [
    "👤 เลือกตัวละครจากแถบด้านขวา แล้วลากเข้าสู่พื้นที่แผนผังเพื่อเพิ่มลงกราฟ",
    "🔗 สร้างความสัมพันธ์: คลิกจุดสีเทาบนตัวละครหนึ่ง แล้วลากไปยังอีกตัวหนึ่ง จะมีหน้าต่างให้กรอกชื่อความสัมพันธ์",
    "✂️ ลบตัวละคร: คลิกปุ่ม 🗑️ บนการ์ดตัวละครเพื่อลบออกจากแผนผัง",
    "💾 บันทึกแผนผัง: พิมพ์ชื่อที่ต้องการในช่องด้านบน แล้วคลิกปุ่ม 💾 Save",
    "📂 โหลดแผนผังเดิม: คลิกปุ่ม 📂 Load เพื่อเลือกแผนผังที่เคยบันทึกไว้",
    "🗑️ ลบแผนผัง: คลิกปุ่ม 🗑️ Delete เพื่อลบแผนผังที่กำลังเปิด",
    "🔁 Reset: คลิก 🔁 Reset เพื่อล้างทุกอย่างแล้วเริ่มใหม่",
  ];

  return (
    <div className="relationship-editor">
      <h2 className="relationship-header">👥 Relationships &nbsp;
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
          gifUrl="\assets\tutorials\Relationships-Tutorial.gif"
        />
      <div className="editor-toolbar">
        <div>
          {editingName ? (
            <input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={confirmEditName}
              onBlur={confirmEditName}
              autoFocus
            />
          ) : (
            <span style={{ fontWeight: "bold", fontSize: 16 }}>
              📄 {saveName} <button onClick={toggleEditName}>✏️</button>
            </span>
          )}
        </div>
        <button onClick={handleSave}>💾 Save</button>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowLoadMenu(!showLoadMenu)}>📂 Load</button>
          {showLoadMenu && (
            <div className="load-menu">
              {allSaves.map((name, idx) => (
                <div key={idx} onClick={() => loadByName(name)}>
                  📁 {name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="delete-button" onClick={handleDeleteGraph}>🗑️ Delete</button>
        <button onClick={handleReset}>🔁 Reset</button>
        <button onClick={() => setShowSidebar(!showSidebar)}>📋 ตัวละครที่มี</button>
      </div>

      <div
        ref={reactFlowWrapper}
        style={{ width: "100%", height: "100%" }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
          fitView
          nodeTypes={nodeTypes}
          connectionMode="loose"
        >
          <MiniMap className="fixed-minimap" pannable zoomable />
          <Controls className="fixed-controls" />
          <Background />
        </ReactFlow>
      </div>

      <div className={`character-sidebar ${showSidebar ? '' : 'hidden'}`}>
        <h4>ลากตัวละครเข้าสู่แผนผัง</h4>
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อตัวละคร..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        {characters
            .filter((char) =>
              char.name.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((char, idx) => (
              <div
                key={idx}
                className="draggable-character"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("application/json", JSON.stringify(char))
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                  marginBottom: "8px",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  background: "#fff",
                  color: "#000",
                }}
              >
              <img
                src={char.image}
                alt={char.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                }}
              />
              <span>{char.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function RelationshipEditor() {
  return (
    <ReactFlowProvider>
      <RelationshipEditorContent />
    </ReactFlowProvider>
  );
}
