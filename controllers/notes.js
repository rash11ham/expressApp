const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({})
  response.json(notes); 
});

notesRouter.get("/:id", async (request, response, next) => {

  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }    
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);


  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id,
  });

  const noteToBeSaved = await note.save()
  user.notes = user.notes.concat(noteToBeSaved._id);
  await user.save();
  response.status(201).json(noteToBeSaved);
  
    
});

notesRouter.delete("/:id", async (request, response, next) => {
  
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end();
      
});

notesRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  const noteToBeUpdated = await Note.findByIdAndUpdate(
    request.params.id,
    note,
    { new: true }
  )
  response.json(noteToBeUpdated);
    
});

module.exports = notesRouter;
