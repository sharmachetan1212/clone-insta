import React, { useContext } from "react";
import logo5 from "../components/Images/logo5.png";
import "./css/Navbar.css";
import { Link } from "react-router-dom";
import { loginContext } from "../context/loginContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(loginContext);
  const navigate = useNavigate();

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link to="/createPost">
            <li>Create Post</li>
          </Link>
          <Link to="/myfollowingpost">
            <li>My Following Post</li>
          </Link>
          <Link to={" "}>
            <button
              className="primaryBtn"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Logout
            </button>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/signup">
            <li>SignUp</li>
          </Link>
          <Link to="/signin">
            <li>SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  return (
    <>
      <div className="navbar">
        <img
        style={{cursor:"pointer"}}
          src={logo5}
          onClick={() => {
            navigate("/")
          }}
          alt="Instagram Logo"
        />
        <ul className="nav-menu">{loginStatus()}</ul>
      </div>
    </>
  );
}
