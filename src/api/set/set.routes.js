const express = require("express");
const router = express.Router();
const PlayerController = require("./set.controller");

router.post("/", PlayerController.createSet);
router.put("/editSet/:id", PlayerController.editSetById);
router.get("/getAllSets", PlayerController.listSets);
router.get("/getAllRequest", PlayerController.listRequest);
router.get("/getSet/:setId", PlayerController.getSetById);
router.delete('/deleteSet/:setId', PlayerController.deleteSetById);
router.get('/sets/search/:filter', PlayerController.searchSets);
router.get('/sets/inactiveSearch/:filter', PlayerController.searchSetsInactive);
router.put('/changeSetStatus', PlayerController.changeSetStatus);

module.exports = router;