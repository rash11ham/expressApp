const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
//Get home
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

//get all notes

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

//get by Id
app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((n) => n.id === id);
  if (!note) {
    res.status(404).end("No such note found!");
  } else {
    res.json(note);
  }
});

//POST

function generateId() {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
}

app.post("/api/notes", (req, res) => {
  const body = req.body;

  const checkNote = notes.find((n) => body.content === n.content);
  if (checkNote) {
    return res.status(409).json({
      error: "Content already exists",
    });
  }
  if (!body.content) {
    return res.status(400).json({
      error: "Content cannot be empty",
    });
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: Boolean(body.important) || false,
  };

  notes = notes.concat(note);
  res.json(note);
});

//Delete
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((n) => n.id !== id);

  res.status(204).send("deleted successfuly");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
