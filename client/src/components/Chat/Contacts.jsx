import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import Logo from "../assets/logo.svg";
import axios from "axios";
import { chatUrl } from "../../../api/apiLinks";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = { token: localStorage.getItem("userToken") };
    // console.log(token);
    axios.post(`${chatUrl}userData`, token).then((response) => {
      // console.log(response.data.data);
      setCurrentUserName(response.data.data.firstName);
      setCurrentUserImage(response.data.data.avatarImage);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loader = () => {
        setLoading(false);
      };
      loader();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {currentUserImage && currentUserImage && (
            <Container>
              <div className="brand">{/* <img src={Logo} alt="logo" /> */}</div>
              <div className="contacts">
                {contacts.map((contact, index) => {
                  return (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                    <div
                      key={contact._id}
                      className={`contact ${
                        index === currentSelected ? "selected" : ""
                      }`}
                      onClick={() => changeCurrentChat(index, contact)}
                    >
                      <div className="avatar">
                        <img
                          src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                          alt=""
                        />
                      </div>
                      <div className="firstName">
                        
                        <h3>{contact.doctorId.fullName}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <div className="current-user">
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${currentUserImage}`}
                    alt="avatar"
                  />
                </div>
                <div className="firstName">
                  <h2>{currentUserName}</h2>
                </div>
              </div> */}
            </Container>
          )}
        </>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: white;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #a0aec0;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .firstName {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: rgb(22 78 99);
    }
  }

  .current-user {
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .firstName {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .firstName {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
