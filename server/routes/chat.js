import express from "express";
import { userData, addMessage, getAllDoctors, getMessages } from "../controllers/chatController.js";
const router = express.Router();

router.post("/userData", userData)

router.get("/allusers/:id", getAllDoctors);
router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

export default router;