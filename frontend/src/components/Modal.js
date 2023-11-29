import React from "react";
import { RiCloseLine } from "react-icons/ri";
import "./css/Modal.css";
import { useNavigate } from "react-router-dom";

export default function Modal({ setModalOpen }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    window.location.reload();
  };
  
  return (
    <div
      className="darkBg"
      onClick={() => {
        setModalOpen(false);
      }}
    >
      <div className="centered">
        <div className="modal">
          {/* Modal header */}
          <div className="modalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button
            className="closeBtn"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            <RiCloseLine></RiCloseLine>
          </button>
          {/* Modal content */}
          <div className="modalContent">Are you really want to Log Out ?</div>
          {/* MOdal actions */}
          <div className="modalActions">
            <div className="actionContainers">
              <button
                className="logOutBtn"
                onClick={() => {
                  setModalOpen(false);
                  localStorage.clear();
                  navigate("./signin");
                  {handleLogout()};
                }}
              >
                Log Out
              </button>
              <button
                className="cancleBtn"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Cancle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
