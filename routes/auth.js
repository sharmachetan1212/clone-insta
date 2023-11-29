const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {JWT_secret} = require('../config')
// const requireLogin = require("../middlewares/requirelogin")

router.post("/signup", (req, resp) => {
  const { fullName, userName, email, password } = req.body;
  if (!fullName ||  !userName || !email || !password) {
    // if any one of the field is missing
    return resp.status(422).json({ error: "Please add all the fields" });
  }
  // If user or his/her email id exists, it sends message
  USER.findOne({ $or: [ { userName: userName },{ email: email }] }).then((savedUser) => {
      if (savedUser) {
        return resp.status(422).json({ error: "User already exist of that email or Username" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new USER({
          fullName,
          email,
          userName,
          password: hashedPassword
        })
        user.save()
          .then(user => {resp.json({ message: "Registered successfully" })})
          .catch(err => {console.log(err)})
      });
    });
});

router.post("/signin", (req, resp) => {
  const {email,password} = req.body;

  if(!email || !password){
    return resp.status(422).json({error:"Please add email and password"})
  }
  USER.findOne({$or:[{ email: email },{ password: password }]}).then((savedUser) => {
    if(!savedUser){
      return resp.status(422).json({error:"Invalid Email"});
    }
    bcrypt.compare(password,savedUser.password).then((match)=>{
      if(match){
        // resp.status(200).json({message:"Signed in Successfully"})
        const token = jwt.sign({_id:savedUser.id},JWT_secret)
        // resp.send is HTML format and resp.json is JSON format for sending data to server
        const {_id,fullName,email,userName}=savedUser
        resp.json({token,user:{_id,fullName,email,userName}})
        console.log({token,user:{_id,fullName,email,userName}})
      }
      else{
        return resp.status(422).json({error:"Wrong Password"})
      }
    })
    .catch(err => console.log(err))
  })
});

module.exports = router;
