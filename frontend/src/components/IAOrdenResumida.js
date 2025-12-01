import React, { useState, useRef, useEffect } from "react";

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: "0 auto",
  },
  chatBox: {
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    height: 500,
    overflow: "hidden",
  },
  header: {
    padding: "14px 18px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  messagesArea: {
    flex: 1,
    padding: "12px 16px",
    background: "#f9fafb",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  inputArea: {
    borderTop: "1px solid #e5e7eb",
    padding: "10px 12px",
    background: "#f9fafb",
    display: "flex",
    gap: 8,
  },
  textarea: {
    flex: 1,
    padding: 10,
    borderRadius: 999,
    border: "1px solid #d1d5db",
    fontSize: 14,
    resize: "none",
    outline: "none",
    background: "#ffffff",
  },
  sendBtn: {
    padding: "0 18px",
    borderRadius: 999,
    border: "none",
    background: "#16a34a",
    color: "#ffffff",
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  rowUser: {
    display: "flex",
    justifyContent: "flex-end",
  },
  rowIA: {
    display: "flex",
    justifyContent: "flex-start",
  },
  bubbleUser: {
    background: "#4f46e5",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "18px 18px 4px 18px",
    maxWidth: "75%",
    fontSize: 14,
    whiteSpace: "pre-wrap",
  },
  bubbleIA: {
    background: "#ffffff",
    color: "#111827",
    padding: "8px 12px",
    borderRadius: "18px 18px 18px 4px",
    maxWidth: "75%",
    fontSize: 14,
    border: "1px solid #e5e7eb",
    whiteSpace: "pre-wrap",
  },
  label: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 2,
  },
};

export default function IAOrdenResumida() {
  const [descripcion, setDescripcion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const enviar = async () => {
    if (!descripcion.trim() || loading) return;
    const texto = descripcion.trim();
    setDescripcion("");
    setLoading(true);

    setChat(prev => [...prev, { from: "user", text: texto }]);

    try {
      const res = await fetch("/api/ia/orden-trabajo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion: texto }),
      });

      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      const data = await res.json();
      setChat(prev => [
        ...prev,
        {
          from: "ia",
          text: data.respuesta_ia || "No se recibió respuesta de la IA",
        },
      ]);
    } catch (err) {
      setChat(prev => [
        ...prev,
        { from: "ia", text: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          <div style={styles.title}>GEMPROTEC IA</div>
          <div style={styles.subtitle}>
            Envía la descripción de una orden de trabajo y la IA te dará un análisis breve.
          </div>
        </div>

        <div style={styles.messagesArea}>
          {chat.length === 0 && (
            <div style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginTop: 20 }}>
              Aún no hay mensajes. Escribe una descripción abajo para comenzar.
            </div>
          )}

          {chat.map((msg, idx) => (
            <div
              key={idx}
              style={msg.from === "user" ? styles.rowUser : styles.rowIA}
            >
              <div style={msg.from === "user" ? styles.bubbleUser : styles.bubbleIA}>
                <div style={styles.label}>
                  {msg.from === "user" ? "Tú" : "IA GEMPROTEC"}
                </div>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div style={styles.inputArea}>
          <textarea
            rows={1}
            style={styles.textarea}
            placeholder="Escribe la descripción de la orden y presiona Enter o Enviar..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.sendBtn} onClick={enviar} disabled={loading}>
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
