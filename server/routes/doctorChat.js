import express from "express";
import { doctorData, getAllUsers,getMessagesDoctor,addMessageDoctor } from "../controllers/chatController.js";
const router = express.Router();

router.post("/doctorData", doctorData);

router.get("/allusers/:id", getAllUsers);
router.post("/addmsg/", addMessageDoctor);
router.post("/getmsg/", getMessagesDoctor);

export default router;

