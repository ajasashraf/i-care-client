const express = require("express");
const { userData, addMessage, getAllDoctors, getMessages } = require("../controllers/chatController.js");

const router = express.Router();

router.post("/userData", userData)

router.get("/allusers/:id", getAllDoctors);
router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

export default router;