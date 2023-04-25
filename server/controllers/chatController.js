const userModel = require("../model/userSchema.js");
const doctorModel = require("../model/doctorSchema.js");
const appointmentModel = require("../model/appointmentSchema.js");
const Messages = require("../model/messageModel.js");
const jwt = require("jsonwebtoken");

export const userData = async (req, res) => {
  if (req.body.token) {
    const response = {
      data: await userModel.findOne({
        _id: jwt.verify(req.body.token, process.env.TOKEN_SECRET).userId,
      }),
    };
    res.status(200).json(response);
  }
};
export const doctorData = async (req, res) => {
  if (req.body.token) {
    const response = {
      data: await doctorModel.findOne({
        _id: jwt.verify(req.body.token, process.env.TOKEN_SECRET).doctorId,
      }),
    };
    res.status(200).json(response);
  }
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const users = await appointmentModel
      .find({ patientId: req.params.id })
      .populate({
        path: "doctorId",
        select: ["fullName", "email", "avatarImage", "_id"],
      });

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await appointmentModel
      .find({ doctorId: req.params.id })
      .populate({
        path: "patientId",
        select: ["fullName", "email", "avatarImage", "_id"],
      });

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

// export const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await userModel
//       .find({ _id: { $ne: req.params.id } })
//       .select(["email", "fullName", "avatarImage", "_id"]);
//     return res.json(users);
//   } catch (ex) {
//     next(ex);
//   }
// };

export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    console.log(req.body,"usergettt");
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    console.log(req.body,"useraddddd");
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

export const getMessagesDoctor = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    console.log(req.body,"docotrgettt");
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

export const addMessageDoctor = async (req, res, next) => {


  
  try {
    const { from, to, message } = req.body;

    console.log(from,to,message ,'hasaaaaaaaaaaaai');
    console.log(req.body,"docotradddd");
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
