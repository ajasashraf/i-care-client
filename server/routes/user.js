const express = require("express");
const router = express.Router();
const {
  bookAppoinment,
  cancelAppointment,
  editProfile,
  editProfilePic,
  forgotPassOtp,
  getAppointmentHistory,
  getAppointmentsUser,
  getDepartment,
  getDoctors,
  getUserDetails,
  getWallet,
  initializePayment,
  payWithWallet,
  resendOtp,
  resetPass,
  saveGoogleUser,
  sendOtp,
  signIn,
  userCheck,
  verifyOtpAndSignUp,
  verifyPayment,
} = require("../controllers/userControllers.js");
const { userAuthentication } = require("../middlewares/Authentications.js");

router.post("/getOtp", sendOtp);
router.post("/signUp", verifyOtpAndSignUp);
router.post("/signIn", signIn);
router.get("/authenticate", userCheck);
router.post("/resendOtp", resendOtp);
router.post("/forgotPass", forgotPassOtp);
router.post("/resetPass", resetPass);
router.post("/googleUserDetails", saveGoogleUser);
router.get("/getDepartments/", getDepartment);
router.get("/getDoctors", getDoctors);
router.get("/getUserDetails", userAuthentication, getUserDetails);
router.post("/bookAppoinment", userAuthentication, bookAppoinment);
router.get("/initializePayment", userAuthentication, initializePayment);
router.post("/verifyPayment", userAuthentication, verifyPayment);
router.post("/editProfile", userAuthentication, editProfile);
router.post("/editProfilePic", userAuthentication, editProfilePic);
router.get("/getAppointments", userAuthentication, getAppointmentsUser);
router.get("/getAppointmentHistory", userAuthentication, getAppointmentHistory);
router.get("/getWallet", userAuthentication, getWallet);
router.get("/payWithWallet", userAuthentication, payWithWallet);
router.get("/cancelAppointment", userAuthentication, cancelAppointment);

module.exports = router ;
