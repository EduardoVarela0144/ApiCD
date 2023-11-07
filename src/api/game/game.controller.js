const Game = require("../game/Game");
const User = require("../user/User");
const Set = require("../set/Set");
const GameDayNotes = require("../dayGameNotes/DayGameNotes");

// Controlador para crear un nuevo juego
exports.createGame = async (req, res) => {
  try {
    const {
      owner,
      name,
      title,
      date,
      status,
      questions,
      guest,
      participants,
      notes,
    } = req.body;

    const ownerExists = await User.findById(owner);
    if (!ownerExists) {
      return res.status(400).json({ message: "El propietario no existe" });
    }

    const guestsExist = await User.find({ _id: { $in: guest } });
    if (guestsExist.length !== guest.length) {
      return res
        .status(400)
        .json({ message: "Uno o más usuarios invitados no existen" });
    }

    const participantsExist = await User.find({ _id: { $in: participants } });
    if (participantsExist.length !== participants.length) {
      return res
        .status(400)
        .json({ message: "Uno o más participantes no existen" });
    }

    const notesExist = await GameDayNotes.find({ _id: { $in: notes } });
    if (notesExist.length !== notes.length) {
      return res.status(400).json({ message: "Una o más notas no existen" });
    }

    const newGame = new Game({
      owner,
      name,
      title,
      date,
      status,
      questions,
      guest,
      participants,
      notes,
    });

    await newGame.save();

    res.status(201).json({ game: newGame });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.editGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { name, title, date, status, questions, guest, participants, notes } =
      req.body;

    const gameExists = await Game.findById(gameId);
    if (!gameExists) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    const guestsExist = await User.find({ _id: { $in: guest } });
    if (guestsExist.length !== guest.length) {
      return res
        .status(400)
        .json({ message: "Uno o más usuarios invitados no existen" });
    }

    const participantsExist = await User.find({ _id: { $in: participants } });
    if (participantsExist.length !== participants.length) {
      return res
        .status(400)
        .json({ message: "Uno o más participantes no existen" });
    }

    const notesExist = await GameDayNotes.find({ _id: { $in: notes } });
    if (notesExist.length !== notes.length) {
      return res.status(400).json({ message: "Una o más notas no existen" });
    }

    const updatedGame = await Game.findByIdAndUpdate(
      gameId,
      { name, title, date, status, questions, guest, participants, notes },
      { new: true }
    );

    res.status(200).json({ game: updatedGame });
  } catch (error) {
    console.error("Error editing game:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const deletedGame = await Game.findByIdAndRemove(gameId);

    if (!deletedGame) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    res.status(200).json({ message: "Juego eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    res.status(200).json({ game });
  } catch (error) {
    console.error("Error getting game by ID:", error);
    res.status(500).json({ message: "Ingresa un pin de juego válido" });
  }
};

exports.listGames = async (req, res) => {
  try {
    const games = await Game.find();

    res.status(200).json({ games });
  } catch (error) {
    console.error("Error listing games:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
