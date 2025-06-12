import { Handle } from "reactflow";

function CustomCharacterNode({ data }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: 10,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        width: 100,
        position: "relative"
      }}
    >
      {/* ปุ่มลบ */}
      <button
        onClick={data.onDelete}
        style={{
          position: "absolute",
          top: -8,
          right: -8,
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 20,
          height: 20,
          fontSize: 12,
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        ×
      </button>

      {/* TOP */}
      <Handle type="target" position="top" id="top" style={{ left: "50%", transform: "translateX(-50%)", background: "#555" }} />
      <Handle type="source" position="top" id="top" style={{ left: "50%", transform: "translateX(-50%)", background: "#555" }} />

      {/* BOTTOM */}
      <Handle type="target" position="bottom" id="bottom" style={{ left: "50%", transform: "translateX(-50%)", background: "#555" }} />
      <Handle type="source" position="bottom" id="bottom" style={{ left: "50%", transform: "translateX(-50%)", background: "#555" }} />

      {/* LEFT */}
      <Handle type="target" position="left" id="left" style={{ top: "50%", transform: "translateY(-50%)", background: "#555" }} />
      <Handle type="source" position="left" id="left" style={{ top: "50%", transform: "translateY(-50%)", background: "#555" }} />

      {/* RIGHT */}
      <Handle type="target" position="right" id="right" style={{ top: "50%", transform: "translateY(-50%)", background: "#555" }} />
      <Handle type="source" position="right" id="right" style={{ top: "50%", transform: "translateY(-50%)", background: "#555" }} />

      {/* รูปตัวละคร */}  
      <img
        src={data.image}
        alt={data.label}
        style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
      />

      {/* ชื่อตัวละคร */}
      <div style={{ fontSize: 14, marginTop: 6, color: "black" }}>{data.label}</div>
    </div>
  );
}

export default CustomCharacterNode;
