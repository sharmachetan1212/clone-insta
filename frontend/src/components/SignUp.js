import React, { useState } from "react";
import Mockup from "./Images/Mockup.webp";
import "./css/SignUp.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setfullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg, { autoClose: 5000 });

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const postData = () => {
    if (emailRegex && passRegex) {
      notifyB();
      navigate("/signin");
    } else if (!emailRegex.test(email)) {
      notifyA("Invalid email or Username or Name");
      return;
    } else if (!passRegex.test(password)) {
      notifyA(
        "It contains at least 8 characters and at most 20 characters.It contains at least one lower case alphabet.It contains at least one special character which includes !@#$%&*()-+=^."
      );
      return;
    }

    // Sendiing data to server
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullName,
        userName: userName,
        email: email,
        password: password,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.message);
          navigate("/signin");
        }
        console.log(data);
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up to Instagram</h2>
        <form>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setfullName(e.target.value);
            }}
            required
            autoComplete="off"
          />
          <input
            type="text"
            name="userName"
            id="userName"
            placeholder="Username"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            required
            autoComplete="off"
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <button
            type="submit"
            id="submit-btn"
            value="Sign Up"
            onClick={() => {
              postData();
            }}
          >
            Sign Up
          </button>
        </form>
        <p>By signing up, you agree to our Terms and Privacy Policy.</p>
      </div>
      <div className="signup-image">
        <img src={Mockup} alt="Instagram Logo" />
      </div>
    </div>
  );
};

export default Signup;
