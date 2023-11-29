const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST");

// API's
// Route
router.get("/allposts", requireLogin, (req, resp) => {
  POST.find()
    .populate("postedBy", "_id fullName Photo")
    .populate("comments.postedBy", "_id fullName")
    .sort("-createdAt")
    .then((posts) => resp.json(posts))
    .catch((err) => console.log(err));
});

router.post("/createPost", requireLogin, (req, resp) => {
  const { body, pic } = req.body;
  if (!body || !pic) {
    return resp.status(422).json({ error: "Please add all the fields" });
  }
  console.log(req.user);
  const post = new POST({
    // title
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      return resp.json({ post: result });
    })
    .catch((err) => console.log(err));
});

router.get("/myposts", requireLogin, (req, resp) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id fullName")
    .populate("comments.postedBy", "_id fullName")
    .sort("-createdAt")
    .then((myposts) => {
      resp.json(myposts);
    });
});

router.put("/like", requireLogin, (req, resp) => {
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id fullName Photo")
    .exec((err, result) => {
      if (err) {
        resp.status(422).json({ error: err });
      } else {
        resp.json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, resp) => {
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id fullName Photo")
    .exec((err, result) => {
      if (err) {
        resp.status(422).json({ error: err });
      } else {
        resp.json(result);
      }
    });
});

router.put("/comment", requireLogin, (req, resp) => {
  const comment = {
    comment: req.body.text,
    postedBy: req.user._id,
  };
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id fullName")
    .populate("postedBy", "_id fullName")
    .exec((err, result) => {
      if (err) {
        resp.status(422).json({ error: err });
      } else {
        resp.json(result);
      }
    });
});

// API of delete Post
router.delete("/deletePost/:postId", requireLogin, (req, resp) => {
  POST.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return resp.status(422).json({ error: err });
      }
      // console.log(post.postedBy._id.toString(),req.user._id.toString())
      else if (post.postedBy._id.toString() == req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            return resp.json({ message: "Successfully deleted" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

//  To show following post
router.get("/myfollowingpost", requireLogin, (req, resp) => {
  POST.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id fullName Photo")
    .populate("comments.postedBy", "_id fullName")
    .then((posts) => {
      resp.json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
