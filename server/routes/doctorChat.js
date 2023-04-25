const express = require("express");
const { doctorData, getAllUsers, getMessagesDoctor, addMessageDoctor } = require("../controllers/chatController.js");
const router = express.Router();

router.post("/doctorData", doctorData);

router.get("/allusers/:id", getAllUsers);
router.post("/addmsg/", addMessageDoctor);
router.post("/getmsg/", getMessagesDoctor);

export default router;

