import React, { createContext, useState } from "react";
import { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { doctorUrl } from "../../../../apiLinks/apiLinks";
import DoctorProfile from "../../../components/DoctorProfile/DoctorProfile";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
export const docDetailsContext = createContext("");

function Doctor_Profile() {
  const [docDetails, SetDocDetails] = useState({});
  // const Navigate = useNavigate();

  return (
    <div>
      <Toaster />
      <docDetailsContext.Provider value={{ docDetails, SetDocDetails }}>
        <Header />
        <DoctorProfile />
        <Footer />
      </docDetailsContext.Provider>
    </div>
  );
}

export default Doctor_Profile;
