const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");

router.post("/", UserController.createUser);
router.post("/login",UserController.login);
router.get("/", UserController.getUsers);
router.put("/editUser/:userId", UserController.editUser);
router.delete("/:userId", UserController.deleteUser);
router.put("/changePassword/:userId", UserController.changePassword);
router.get("/getUser/:userId", UserController.getUserById);
router.get('/loginLinkedIn/:email', UserController.getUserByEmail);
router.get('/loginLinkedInToken', UserController.linkedinLogin);


module.exports = router;
