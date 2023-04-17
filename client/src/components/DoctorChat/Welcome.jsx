import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { doctorChatUrl } from "../../../api/apiLinks";
// import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = { token: localStorage.getItem("doctorToken") };
    axios.post(`${doctorChatUrl}doctorData`, token).then((response) => {
      // console.log(response.data.data);
      setUserName(response.data.data.firstName);
      // setCurrentUserImage(response.data.data.avatarImage);
    });
  }, []);

  return (
    <Container>
      {/* <img src={Robot} alt="" /> */}
      <h1>
        Welcome <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-weight:bold;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: black;
  }
`;
