import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { adminUrl } from "../../../../api/apiLinks";
import { adminLoading } from "../../../pages/Admin/Home/Home";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddDepartment() {
  const formRef = useRef(null);
  const [department, setDepartment] = useState("");
  const [diseases, setDiseases] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const { changeLoading } = useContext(adminLoading);
  const setCustomValidity = useState("");
  const [error, setError] = useState("");
  const Navigate = useNavigate();
  const departmentData = {
    department,
    diseases,
    description,
  };

  const addDepartment = (e) => {
    e.preventDefault();
    changeLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      let imageData = reader.result;
      let token = localStorage.getItem("adminToken");
      const headers = { Authorization: token };
      axios
        .post(
          `${adminUrl}addDepartment`,
          { departmentData, imageData },
          { headers }
        )
        .then((response) => {
          response.data.status === "exist" &&
            toast.error("Department already exists");
          if (response.data.status === "success") {
            formRef.current.reset();
            toast.success("Successfully added department");
          }
          response.status != 200 &&
            toast.error("something went wrong try again");
        })
        .catch((err) => {
          err?.response?.status === 401
            ? Navigate("/admin")
            : toast.error("something went wrong");
        })
        .finally(() => changeLoading(false));
    };
  };

  return (
    <div>
      <Toaster />
      <form
        ref={formRef}
        className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
        onSubmit={addDepartment}
      >
        <div>
          <label
            htmlFor="addDepartment"
            className="block mb-2 text-sm text-gray-400"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Cardiology"
            onChange={(e) => {
              const re = /^\s*$/;
              if (re.test(e.target.value)) {
                setDepartment("");
                setCustomValidity("Full Name cannot contain only spaces");
              } else {
                setDepartment(e.target.value);
                setError("");
              }
            }}
            value={department}
            required
            className="block w-full px-5 py-3 mt-2 text-black-800 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-400 dark:bg-gray-900 dark:text-gray-800 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 "
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label
            htmlFor="Description"
            className="block mb-2 text-sm text-gray-400"
          >
            Description
          </label>
          <input
            type="text"
            name="name"
            placeholder="Cardiology"
            onChange={(e) => {
              const re = /^\s*$/;
              if (re.test(e.target.value)) {
                setDescription("");
                setCustomValidity("Full Name cannot contain only spaces");
              } else {
                setDescription(e.target.value);
                setError("");
              }
            }}
            value={description}
            required
            className="block w-full px-5 py-3 mt-2 text-black-800 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-400 dark:bg-gray-900 dark:text-gray-800 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 "
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label
            htmlFor="diseases"
            className="block mb-2 text-sm text-gray-400"
          >
            Common Diseases
          </label>
          <input
            type="text"
            name="diseases"
            placeholder="seperate with ,"
            onChange={(e) => {
              const re = /^\s*$/;
              if (re.test(e.target.value)) {
                setDiseases("");
                setCustomValidity("Full Name cannot contain only spaces");
              } else {
                setDiseases(e.target.value);
                setError("");
              }
            }}
            value={diseases}
            required
            className="block w-full px-5 py-3 mt-2 text-black-800 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-400 dark:bg-gray-900 dark:text-gray-800 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 "
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label htmlFor="photo" className="block mb-2 text-sm text-gray-400">
            Upload Photo
          </label>
          <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            placeholder="MBBS,MD, etc"
            required
            accept="image/*"
            className="block w-full px-5 py-3 mt-2  placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-400 dark:bg-gray-900 dark:text-gray-800 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
        <button className="flex mt-4 h-3/4 justify-center items-center w-1/6 px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform rounded-md sign-up focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
          <span>Add</span>
        </button>
        
      </form>
    </div>
  );
}

export default AddDepartment;
