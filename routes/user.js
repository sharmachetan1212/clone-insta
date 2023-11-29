const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");

// To get user profile
router.get("/user/:id", (req, resp) => {
  USER.findOne({ _id: req.params.id })
    .select("-password")
    .then(user => {
      POST.find({ postedBy: req.params.id })
        .populate("postedBy", "_id")
        .exec((err, post) => {
          if (err) {
            return resp.status(422).json({ error: err });
          }
          resp.status(200).json({ user, post });
        });
    })
    .catch((err) => {
      return resp.status(404).json({ error: "User not Found" });
    });
});

//  To follow User
router.put("/follow", requireLogin, (req, resp) => {
  USER.findByIdAndUpdate(req.body.followId,{
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return resp.status(422), json({ error: err });
      }
      USER.findByIdAndUpdate(req.user._id,{
          $push: { following: req.body.followId },
        },
        {
          new: true,
        })
        .then((result) => resp.json(result))
        .catch((err) => {
          return resp.status(422).json({ error: err });
        });
    }
  );
});

// To unfollow User
router.put("/unfollow", requireLogin, (req, resp) => {
  USER.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return resp.status(422), json({ error: err });
      }
      USER.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .then((result) => resp.json(result))
        .catch((err) => {
          return resp.status(422).json({ error: err });
        });
    }
  );
});

router.put("/uploadProfilePic",requireLogin,(req,resp)=>{
   USER.findByIdAndUpdate(req.user._id,{
    $set:{Photo:req.body.pic}
   },{
    new:true
   }).exec((err,result)=>{
    if(err){
      return resp.status(422).json({error:err})
    }else{
      resp.json(result)
    }
   })
})

module.exports = router;
