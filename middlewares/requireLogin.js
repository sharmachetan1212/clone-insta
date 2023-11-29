const jwt = require("jsonwebtoken");
const { JWT_secret } = require("../config");
const mongoose = require("mongoose");
const USER = mongoose.model("USER");

module.exports = (req, resp, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return resp.status(401).json({ error: "You must have logged in 1" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_secret, (err, payload) => {
    if (err) {
      return resp.status(401).json({ error: "You must have logged in 2" });
    }
    const { _id } = payload;
    // Returning details of user
    USER.findById(_id).then((userData) => {
      // console.log(userdata)
      req.user = userData;
      next();
    });
  });
};
