import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../../../../api//doctorChatRoutes";
import ChatContainer from "../../../components/DoctorChat/ChatContainer";
import Contacts from "../../../components/DoctorChat/Contacts";
import Welcome from "../../../components/DoctorChat/Welcome";
import { doctorChatUrl } from "../../../../api/apiLinks";

export default function DoctorChat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [currentUser, setCurrentUser] = useState();

  console.log(currentChat,'current chat');
  useEffect(() => {
    const token = { token: localStorage.getItem("doctorToken") };
    if (!localStorage.getItem("doctorToken")) {
      navigate("/login");
    } else {
      axios.post(`${doctorChatUrl}doctorData`, token).then((response) => {
        setCurrentUser(response.data.data);
        // console.log(response.data.data._id, 'server datttaa');
        // setTimeout(() => {
        //   console.log(currentUser._id, 'currentUserrrrrrrrrrrrrr');
        // }, 2000);
      });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      // console.log(currentUser._id);
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        axios.get(`${allUsersRoute}/${currentUser._id}`).then((response) => {
          // console.log(response.data);
          setContacts(response.data);
        });
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    console.log(chat, "chatttttttttttttttt");
    setCurrentChat(chat);
  };
  
  return (
    <>
      
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: rgb(22 78 99);;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: white;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
