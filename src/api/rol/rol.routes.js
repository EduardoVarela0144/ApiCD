const express = require("express");
const router = express.Router();
const RolController = require("./rol.controller");

router.post("/", RolController.createRol);
router.put("/editRol/:rolId", RolController.editRol);
router.delete("/deleteRol/:rolId", RolController.deleteRol);
router.get("/getRol/:rolId", RolController.getRolById);
router.get("/getAllRoles", RolController.listRoles);
router.get('/getRolByName/:name', RolController.getRolByName)

module.exports = router;