const express = require("express");
const app = express();
const PORT = process.env.port || 5000;
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path")

app.use(cors());

require("./config");
require("./models/model");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));

mongoose.connection.on("connected", () => {
  console.log("successfully connected to mongo");
});

mongoose.connection.on("error", () => {
  console.log("not connected to mongo");
});

// Serving the frontend
app.use(express.static(path.join(__dirname,"./frontend/build")))

app.get("*",(req,resp)=>{
  resp.sendFile(
    path.join(__dirname,"./frontend/build/index.html"),
    function(err){
      resp.status(500).send(err)
    }
  )
})

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
