const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");
const helper = require("./test_helper");
const api = supertest(app);

describe('intial notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
  })

  test("notes are returned as json", async () => {
    console.log("entered test");
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are a few notes", async () => {
    const response = await api.get("/api/notes");
    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test("the first note", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((e) => e.content);
    assert(contents.includes("HTML is easy"));
  });
})


describe('viewing a specific note', () => {
  test("view note with specific id", async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(resultNote.body, noteToView);
  });

  test('fails with status 404 note does not exists', async () => {
    const noteNotExist = await helper.nonExistingId()

    await api
      .get(`/api/notes/${noteNotExist}`)
      .expect(404)
  })

  test('fails with status 400 id is invalid', async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of new note', () => {
  test("a valid note can be added ", async () => {
    const newNote = {
      content: "async/await simplifies making async calls",
      important: true,
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

    const contents = notesAtEnd.map((n) => n.content);

    assert(contents.includes("async/await simplifies making async calls"));
  });

  test("note without content is not added", async () => {
    const newNote = {
      important: true,
    };

    await api.post("/api/notes").send(newNote).expect(400);

    const notesAtEnd = await helper.notesInDb();
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length+1);
  });
})

describe('delete a note', () => {
  test("a note can be deleted", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await helper.notesInDb();

    const contents = notesAtEnd.map((r) => r.content);
    assert(!contents.includes(noteToDelete.content));

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
  });
})

after(async () => {
  await mongoose.connection.close();
});
