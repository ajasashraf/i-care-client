import React, { useContext } from "react";
import "./SideBar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { sideBarContext } from "../../../pages/Admin/Home/Home";

function SideBar() {
  const { changePath } = useContext(sideBarContext);

  return (
    <div className="sidebar">
      <div className="top">
        <span className="admin-logo">admin panel</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="sidebar-title">Main</p>
          <li>
            <button onClick={() => changePath("dashboard")}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </button>
          </li>
          <p className="sidebar-title">Lists</p>
          <li>
            <button onClick={() => changePath("users")}>
              <PersonIcon className="icon" />
              <span>Users</span>
            </button>
          </li>
          <li>
            <button onClick={() => changePath("doctors")}>
              <PersonIcon className="icon" />
              <span>Doctors</span>
            </button>
          </li>
          <li>
            <button onClick={() => changePath("newDoctors")}>
              <PersonAddIcon className="icon" />
              <span>New Doctors</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOptions light_sec"></div>
        <div className="colorOptions dark_sec"></div>
      </div>
    </div>
  );
}

export default SideBar;
