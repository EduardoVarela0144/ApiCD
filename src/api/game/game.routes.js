const express = require("express");
const router = express.Router();
const GameController = require("./game.controller");

router.post("/", GameController.createGame);
router.put("/editGame/:gameId", GameController.editGame);
router.delete("/deleteGame/:gameId", GameController.deleteGame);
router.get("/getGame/:gameId", GameController.getGameById);

module.exports = router;