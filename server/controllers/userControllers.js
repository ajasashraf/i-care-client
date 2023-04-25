const userModel = require("../model/userSchema.js");
const otpGenerator = require("../otpGenerator/otpGenerator.js");
const sendMail = require("../nodeMailer/nodeMailer.js");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../jwtAuth/generateJwt.js");
const bcrypt = require("bcrypt");
const departmentModel = require("../model/departmentModel.js");
const doctorModel = require("../model/doctorSchema.js");
const appointmentModel = require("../model/appointmentSchema.js");
const { checkingSlotsAvailability } = require("./helpers/helpers.js");
const crypto = require("crypto");
const cloudinary = require("../utils/cloudinary.js");
const Razorpay = require("razorpay");
const walletModel = require("../model/walletSchema.js");
const walletTransactionModel = require("../model/walletTransactionsSchem.js");
let otpVerify;
module.exports = {
  otpVerify
};


const sendOtp = (req, res) => {
  try {
    let userData = req.body;
    let response = {};
    userModel.findOne({ email: userData.email }).then((user) => {
      if (user) {
        response.userExist = true;
        res.status(200).json(response);
      } else {
        otpGenerator().then((otp) => {
          sendMail(userData.email, otp).then((result) => {
            if (result.otpSent) {
              otpVerify = otp;
              res.status(200).json(response);
            } else {
              res.status(500);
            }
          });
        });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const verifyOtpAndSignUp = (req, res) => {
  try {
    const user = req.body.userData;
    const otp = req.body.otp;
    let response = {};
    if (otp === otpVerify) {
      bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash;
        const newUser = new userModel(user);
        newUser.save().then((newUser) => {
          let wallet = new walletModel({
            userId: newUser._id,
          });
          wallet.save().then(() => {
            response.status = true;
            res.status(200).json(response);
          });
        });
      });
    } else {
      response.status = false;
      res.status(200).json(response);
    }
  } catch (err) {
    res.status(500);
  }
};

const signIn = (req, res) => {
  try {
    let response = {};
    let { email, password } = req.body;
    userModel.findOne({ email: email }).then((user) => {
      if (user) {
        if (!user.block) {
          bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
              const token = generateToken({
                userId: user._id,
                name: user.fullName,
                type: "user",
              });
              response.token = token;
              response.logIn = true;
              res.status(200).json(response);
            } else {
              response.incPass = true;
              res.status(200).json(response);
            }
          });
        } else {
          response.block = true;
          res.status(200).json(response);
        }
      } else {
        response.noUser = true;
        res.status(200).json(response);
      }
    });
  } catch (err) {
    res.status(500);
  }
};

const userCheck = (req, res) => {
  let token = req.headers.authorization;
  try {
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
        if (err) {
          res.status(401).json({ authorization: false });
        } else {
          userModel.findOne({ _id: result.userId }).then((user) => {
            if (user) {
              if (!user.block) {
                res.status(200).json({ authorization: true });
              } else {
                res.status(401).json({ authorization: false });
              }
            } else {
              res.status(401).json({ authorization: false });
            }
          });
        }
      });
    } else {
      res.status(401).json({ authorization: false });
    }
  } catch (err) {
    res.status(401).json({ authorization: false });
  }
};

 const resendOtp = (req, res) => {
  try {
    let email = req.body.email;
    let response = {};
    otpGenerator().then((otp) => {
      otpVerify = otp;
      sendMail(email, otp).then((result) => {
        if (result.otpSent) {
          response.status = true;
          res.status(200).json(response);
        } else {
          response.status = false;
          res.status(200).json(response);
        }
      });
    });
  } catch (err) {
    res.status(500);
  }
};

 const forgotPassOtp = (req, res) => {
  try {
    let email = req.body.email;
    let response = {};
    userModel.findOne({ email: email }).then((user) => {
      if (user) {
        otpGenerator().then((otp) => {
          otpVerify = otp;
          sendMail(email, otp).then((result) => {
            if (result.otpSent) {
              response.otpSent = true;
              res.status(200).json(response);
            } else {
              res.status(200).json(response);
            }
          });
        });
      } else {
        response.userErr = true;
        res.status(200).json(response);
      }
    });
  } catch (err) {
    res.status(500);
  }
};

 const resetPass = (req, res) => {
  try {
    const { otp, email, password } = req.body;
    if (otp === otpVerify) {
      bcrypt.hash(password, 10).then((hash) => {
        userModel
          .findOneAndUpdate({ email: email }, { $set: { password: hash } })
          .then((result) => {
            res.status(200).json({ reset: true });
          });
      });
    } else {
      res.status(200).json({ reset: false });
    }
  } catch (err) {
    res.status(500);
  }
};

 const saveGoogleUser = (req, res) => {
  try {
    let response = {};
    let details = req.body;
    userModel.findOne({ email: details.email }).then((user) => {
      if (user) {
        if (!user.block) {
          const token = generateToken({
            userId: user._id,
            name: user.fullName,
            type: "user",
          });
          response.logIn = true;
          response.token = token;
          res.status(200).json(response);
        } else {
          response.block = true;
          res.status(200).json(response);
        }
      } else {
        let newUser = new userModel({
          fullName: details.displayName,
          email: details.email,
          phone: details.phoneNumber  ,
          profilePic: details.photoUrl,
        });
        newUser.save().then((newUser) => {
          const token = generateToken({
            userId: newUser._id,
            name: newUser.fullName,
            type: "user",
          });
          response.logIn = true;
          response.token = token;
          res.status(200).json(response);
        });
      }
    });
  } catch (err) {
    res.status(500);
  }
};

 const getDepartment = async (req, res) => {
  try {
    let pageNo = req.query.pageNo;
    let searchQuery = req.query.search  ;
    let query = {
      list: true,
    };
    searchQuery &&
      (query.name = { $regex: new RegExp(`${searchQuery}.*`, "i") });

    let count = await departmentModel.countDocuments(query);
    departmentModel
      .find(query)
      .limit(pageNo * 4)
      .then((departments) => {
        console.log(count);
        res.status(200).json({ departments, count });
      });
  } catch (err) {
    res.status(500);
  }
};

 const getDoctors = (req, res) => {
  try {
    let departmentId = req.query.department ;
    let pageNo = req.query.page;
    let search = req.query.search ;
    let sort = req.query.sort ;
    let filter = req.query.filter ;
    let query = {
      block: false,
      verification: "success",
    };
    let sortBy = {};
    sort && sort === "price-high-low" && (sortBy.priceOffline = -1);
    sort && sort === "price-low-high" && (sortBy.priceOffline = 1);
    sort && sort === "exp-high-low" && (sortBy.experience = -1);
    departmentId && (query.department = departmentId);
    filter && filter === "exp-gt-10" && (query.experience = { $gte: 10 });
    filter &&
      filter === "price-lt-1000" &&
      (query.priceOffline = { $lte: 1000 });
    filter && filter === "price-lt-700" && (query.priceOffline = { $lte: 700 });
    search && (query.fullName = { $regex: new RegExp(`${search}.*`, "i") });
    let pageSkip = (pageNo - 1) * 4;
    doctorModel.countDocuments(query).then((count) => {
      doctorModel
        .find(query, { password: 0 })
        .skip(pageSkip)
        .limit(4)
        .populate("department")
        .sort(sortBy)
        .then((doctors) => {
          res.status(200).json({ doctors, count });
        });
    });
  } catch (err) {
    res.status(500);
  }
};

 const bookAppoinment = (req, res) => {
  try {
    let { date, time, doctorId } = req.body.appointment;
    let newDate = new Date(date); // create a new Date object
    newDate.setHours(newDate.getHours() + 5); // add 5 hours
    newDate.setMinutes(newDate.getMinutes() + 30); // add 30 minutes
    checkingSlotsAvailability({ newDate, doctorId, time }).then(
      ({ available, amount }) => {
        if (available) {
          appointmentModel
            .findOne({
              patientId: req.userLogged,
              doctorId: doctorId,
              date: newDate,
              slot: time,
              paymentStatus: true,
              status: "booked",
            })
            .then((appointment) => {
              if (appointment) {
                res.status(200).json({ available: "exist" });
              } else {
                let newAppointment = new appointmentModel({
                  doctorId: doctorId,
                  patientId: req.userLogged,
                  date: newDate,
                  slot: time,
                  price: amount,
                });
                newAppointment.save().then((appointment) => {
                  res.status(200).json({
                    available: "available",
                    appointmentId: appointment._id,
                    price: amount,
                  });
                });
              }
            });
        } else {
          res.status(200).json({ available: "notAvailable" });
        }
      }
    );
  } catch (err) {
    res.status(500);
  }
};

 const initializePayment = (req, res) => {
  try {
    const orderId = req.query.orderId;
    appointmentModel.findOne({ _id: orderId }).then((order) => {
      if (order) {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_SECRET,
        });
        var options = {
          amount: order.price * 100,
          currency: "INR",
        };
        instance.orders.create(options, function (err, order) {
          if (err) {
            res.status(500);
          }
          res.status(200).json({ order: order });
        });
      }
    });
  } catch (err) {
    res.status(500);
  }
};

 const verifyPayment = (req, res) => {
  try {
    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === req.body.razorpay_signature) {
      appointmentModel
        .updateOne(
          { _id: req.query.orderId },
          {
            $set: {
              paymentStatus: true,
              paymentId: req.body.razorpay_payment_id,
              paymentMode: "online",
            },
          }
        )
        .then(() => {
          res.status(200).json({ signatureIsValid: true });
        });
    } else {
      appointmentModel.findOneAndRemove({ _id: req.query.orderId }).then(() => {
        res.status(200).json({ signatureIsValid: false });
      });
    }
  } catch (err) {
    res.status(500);
  }
};

 const getUserDetails = (req, res) => {
  try {
    userModel.findOne({ _id: req.userLogged }, { password: 0 }).then((user) => {
      user ? res.status(200).json(user) : res.status(500);
    });
  } catch (err) {
    res.status(500);
  }
};

 const editProfile = (req, res) => {
  try {
    const data = req.body;
    userModel.updateOne({ _id: req.userLogged }, data).then((update) => {
      update.acknowledged
        ? res.status(200).json({ update: true })
        : res.status(500);
    });
  } catch (err) {
    res.status(500);
  }
};

 const editProfilePic = (req, res) => {
  try {
    const image = req.body.imageData;
    cloudinary.uploader.upload(image).then((imageData) => {
      userModel
        .updateOne(
          { _id: req.userLogged },
          { $set: { profilePic: imageData.secure_url } }
        )
        .then((result) => {
          result.acknowledged
            ? res.status(200).json({ result: true })
            : res.status(500);
        });
    });
  } catch (err) {
    res.status(500);
  }
};

 const getAppointmentsUser = (req, res) => {
  try {
    appointmentModel
      .find({ patientId: req.userLogged, status: "booked" })
      .populate("doctorId", "_id fullName priceOffline")
      .then((appointments) => {
        res.status(200).json(appointments);
      });
  } catch (err) {
    res.status(500);
  }
};

 const getAppointmentHistory = (req, res) => {
  try {
    appointmentModel
      .find({ patientId: req.userLogged, status: { $ne: "booked" } })
      .populate("doctorId", "_id fullName priceOffline")
      .sort({ createdAt: 1 })
      .then((history) => {
        res.status(200).json(history);
      });
  } catch (err) {
    res.status(500);
  }
};

 const getWallet = (req, res) => {
  try {
    walletModel
      .findOne({ userId: req.userLogged })
      .populate("transactions")
      .then((response) => {
        res.status(200).json(response);
      });
  } catch (err) {
    res.status(500);
  }
};
 const payWithWallet = (req, res) => {
  try {
    const appointmentId = req.query.appointmentId;
    appointmentModel.findOne({ _id: appointmentId }).then((appointment) => {
      walletModel.findOne({ userId: req.userLogged }).then((wallet) => {
        if (wallet.balance < appointment.price) {
          res.status(200).json({ payment: "noBalance" });
        } else {
          let newTransaction = new walletTransactionModel({
            amount: appointment.price,
            transactionType: "debit",
          });
          newTransaction.save().then((transaction) => {
            walletModel
              .updateOne(
                { userId: req.userLogged },
                {
                  $push: {
                    transactions: transaction._id,
                  },
                  $inc: {
                    balance: -transaction.amount,
                  },
                }
              )
              .then(() => {
                appointmentModel
                  .updateOne(
                    { _id: appointmentId },
                    {
                      $set: {
                        paymentStatus: true,
                        paymentId: transaction._id,
                      },
                    }
                  )
                  .then((update) => {
                    update.acknowledged
                      ? res.status(200).json({ payment: "success" })
                      : res.status(500);
                  });
              });
          });
        }
      });
    });
  } catch (err) {
    res.status(500);
  }
};

 const cancelAppointment = (req, res) => {
  try {
    const appointmentId = req.query.appointmentId;
    console.log(appointmentId);
    appointmentModel.findOne({ _id: appointmentId }).then((appointment) => {
      let transaction = new walletTransactionModel({
        amount: appointment.price,
        transactionType: "credit",
      });
      console.log("hellll",appointment.price )
      transaction.save().then((transaction) => {
  
        walletModel
          .updateOne(
            { userId: req.userLogged },
            {
              $inc: {
                balance: appointment.price,
              },
              $push: {
                transactions: transaction._id,
              },
            },
            {upsert:true}
           
          )
          .then(() => {
            
            appointmentModel
              .updateOne(
                { _id: appointmentId },
                {
                  $set: {
                    status: "cancelled",
                  },
                }
              )
              .then((update) => {
                update.acknowledged
                  ? res.status(200).json({ cancel: true })
                  : res.status(200);
              });
          });
         
      });
    });
  } catch (err) {
    res.status(500);
  }
};


module.exports = [
  sendOtp,
  verifyOtpAndSignUp,
  signIn,
  userCheck,
  resendOtp,
  forgotPassOtp,
  resetPass,
  saveGoogleUser,
  getDepartment,
  getDoctors,
  bookAppoinment,
  initializePayment,
  verifyPayment,
  getUserDetails,
  editProfile,
  editProfilePic,
  getAppointmentsUser,
  getAppointmentHistory,
  getWallet,
  payWithWallet,
  cancelAppointment
]