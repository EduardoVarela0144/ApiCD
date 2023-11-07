const express = require("express");
const router = express.Router();
const DayGameNotesController = require("./dayGameNotes.controller");

router.post("/", DayGameNotesController.createNote);
router.get("/getAll/", DayGameNotesController.getAllNotes);
router.get("/getById/:noteId", DayGameNotesController.getNoteById);
router.put("/edit/:noteId", DayGameNotesController.editNoteById);
router.delete("/delete/:noteId", DayGameNotesController.deleteNoteById);


module.exports = router;