import React from "react";
// import { doctorUrl } from "../../../../api/apiLinks";
import DoctorBanner from "../../../components/DoctorBanner/DoctorBanner";
import DoctorDetails from "../../../components/DoctorDetails/DoctorDetails";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";

function DoctorHome() {
  const token = localStorage.getItem("doctorToken");
  // eslint-disable-next-line no-unused-vars
  const headers = { Authorization: token };

  return (
    <div>
      <Header />
      <DoctorBanner />
      <DoctorDetails />
      <Footer />
    </div>
  );
}

export default DoctorHome;
