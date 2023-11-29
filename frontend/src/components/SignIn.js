import React, { useContext,useState } from "react";
import "./css/SignIn.css"; // Import your CSS file
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../context/loginContext";

const Signin = () => {
  const {setUserLogin} = useContext(loginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    // Toast functions
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);
  
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () => { 
    if (!emailRegex.test(email)) {
      notifyA("Invalid email or Username or Name");
      return
    }
    // Sendiing data to server
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        email: email,
        password: password
      })
    }).then(resp => resp.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Signed in Successfully");
          console.log(data);
          localStorage.setItem("jwt",data.token)
          localStorage.setItem("user",JSON.stringify(data.user))
          setUserLogin(true)
          navigate("/");
        }
        console.log(data);
      }).catch(error => {
        console.log(error);
      })
  };
  // Login Form
  return (
    <div className="signin-container">
      <div className="signin-form">
        <h1>Instagram</h1>
        <form>
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
          <button type="button" id="login-btn" value="Sign In" 
          onClick={() => {
            postData()}}
            >Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
