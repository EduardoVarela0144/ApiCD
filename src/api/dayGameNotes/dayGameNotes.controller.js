const DayGameNotes = require("./DayGameNotes");
const mongoose = require("mongoose");

exports.createNote = async (req, res) => {
  try {
    const { notes } = req.body;

    const newNote = new DayGameNotes({
      notes: notes, 
    });

    await newNote.save();

    res.status(201).json({ note: newNote });
  } catch (error) {
    console.error("Error creando nota:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


exports.getAllNotes = async (req, res) => {
  try {
    const notes = await DayGameNotes.find();

    res.status(200).json({ notes });
  } catch (error) {
    console.error("Error obteniendo notas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await DayGameNotes.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error("Error obteniendo nota por ID:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.editNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "ID de nota no válido" });
    }

    const updatedNote = await DayGameNotes.findByIdAndUpdate(
      noteId,
      { $set: { "notes": notes } },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.status(200).json({ note: updatedNote });
  } catch (error) {
    console.error("Error editando nota por ID:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


exports.deleteNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await DayGameNotes.findByIdAndRemove(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.status(200).json({ message: "Nota eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando nota por ID:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
