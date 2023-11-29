const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/users");

module.exports = {
  mongoose: mongoose.connect("mongodb://127.0.0.1:27017/users"),
  JWT_secret: "qiwansfbiewugfbdk",
};
