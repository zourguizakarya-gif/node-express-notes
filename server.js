// ====================================
// server.js — API ONLY (Postman)
// ====================================

const http = require("http");
const url  = require("url");
const fs   = require("fs");
const express = require("express");

const db   = require("./db");

const app  = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// ====================================
// GET /api/notes
// ====================================
app.get("/api/notes", async (req, res) => {
  const { search } = req.query;

  const [rows] = search
    ? await db.query("SELECT * FROM notes WHERE title LIKE ? ORDER BY id DESC", [`%${search}%`])
    : await db.query("SELECT * FROM notes ORDER BY id DESC");

  res.json({ success: true, data: rows });
});

// ====================================
// GET /api/notes/:id
// ====================================
app.get("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM notes WHERE id = ?", [id]);

  if (!rows.length)
    return res.status(404).json({ success: false, message: "Not found" });

  res.json({ success: true, data: rows[0] });
});

// ====================================
// POST /api/notes
// ====================================
app.post("/api/notes", async (req, res) => {
  const { title, content, color = "#ffffff" } = req.body;

  if (!title)
    return res.status(400).json({ success: false, message: "Title is required" });

  const [result] = await db.query(
    "INSERT INTO notes (title, content, color) VALUES (?, ?, ?)",
    [title, content, color]
  );

  const newNote = { id: result.insertId, title, content, color };

  fs.appendFile("notes.log", `[ADD] ${title}\n`, () => {});

  res.status(201).json({ success: true, data: newNote });
});

// ====================================
// PUT /api/notes/:id
// ====================================
app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, color } = req.body;

  const [rows] = await db.query("SELECT * FROM notes WHERE id = ?", [id]);
  if (!rows.length)
    return res.status(404).json({ success: false, message: "Not found" });

  const updated = {
    title: title ?? rows[0].title,
    content: content ?? rows[0].content,
    color: color ?? rows[0].color,
  };

  await db.query(
    "UPDATE notes SET title=?, content=?, color=? WHERE id=?",
    [updated.title, updated.content, updated.color, id]
  );

  res.json({ success: true, data: { id: parseInt(id), ...updated } });
});

// ====================================
// DELETE /api/notes/:id
// ====================================
app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM notes WHERE id = ?", [id]);
  if (!rows.length)
    return res.status(404).json({ success: false, message: "Not found" });

  await db.query("DELETE FROM notes WHERE id = ?", [id]);

  res.json({ success: true, deleted_id: parseInt(id) });
});

// ====================================
// OPTIONAL: raw http test
// ====================================
http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ path: parsed.pathname, query: parsed.query }));
}).listen(3001);

// Start server
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));