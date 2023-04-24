import React, { Suspense } from "react";
// import Banner from "../../../components/Banner/Banner";
const Banner = React.lazy(() => import("../../../components/Banner/Banner"));
import Departments from "../../../components/Departments/Departments";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
// import ServicesSection from "../../../components/Services/Services";
import Waiting from "../../../components/Loading/Waiting";

function Home() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Waiting />}>
        <Banner />
      </Suspense>
      <Departments />
      {/* <ServicesSection /> */}
      <Footer />
    </div>
  );
}

export default Home;
