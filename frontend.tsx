import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

type Document = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDocuments() {
    const res = await fetch("/api/documents");
    const data = await res.json();
    setDocuments(data);
    setLoading(false);
  }

  async function createDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setTitle("");
    fetchDocuments();
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Collab Docs</h1>

      <form onSubmit={createDocument} style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New document title"
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: 6,
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Create
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginBottom: 16, fontSize: 14 }}>{error}</p>
      )}

      {loading ? (
        <p style={{ color: "#999" }}>Loading...</p>
      ) : documents.length === 0 ? (
        <p style={{ color: "#999" }}>No documents yet. Create one above.</p>
      ) : (
        <ul style={{ listStyle: "none" }}>
          {documents.map((doc) => (
            <li
              key={doc.id}
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: 8,
                marginBottom: 8,
                border: "1px solid #eee",
              }}
            >
              <strong style={{ fontSize: 15 }}>{doc.title}</strong>
              <span style={{ color: "#999", marginLeft: 12, fontSize: 12 }}>
                {new Date(doc.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
