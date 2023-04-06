import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className=" bg-cyan-800 shadow w-full ">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            i-care
          </span>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0 dark:text-black">
            <li className="mr-4 hover:underline md:mr-6">About</li>
            <li className="mr-4 hover:underline md:mr-6">Privacy Policy</li>
            <li className="mr-4 hover:underline md:mr-6">Licensing</li>
            <li className="mr-4 hover:underline md:mr-6">Contact</li>
          </ul>
        </div>
        <div className="text-white">
          Contact Us
          <br></br> Phone: 7554477888
          <br></br>Email: ecare0001@gmail.com
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-black lg:my-8" />
        <span className="block text-sm text-white sm:text-center dark:text-black">
          © 2023 i-care™ All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
