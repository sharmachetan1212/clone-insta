import React, { useEffect, useState } from "react";
import "../components/css/Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function MyFollowingPost() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

    // Toast functions
    const notifyB = (msg) => toast.success(msg);

  useEffect(()=>{
    const token = localStorage.getItem("jwt");
    if(!token){
      navigate("./signup");
    }
// Fetching all posts
    fetch("/myfollowingpost",{
      headers:{
        Authorization:"Bearer "+ token,
      }
    }).then(resp=>resp.json())
    .then((result)=>{
      console.log(result);
      setData(result)
    })
    .catch(err => console.log(err))
  },[])

  // To show and hide comments
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  };

  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((resp) => resp.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  const unlikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((resp) => resp.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  const makeComment = (text, id) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((resp) => resp.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("Comment Posted");
        console.log(result);
      });
  };

  return (
    <div className="home">
      {/* Card */}
      {data.map((posts) => {
        const imageSource = posts.postedBy.Photo ? posts.postedBy.Photo : picLink;
        return (
          <div className="card" key={posts._id}>
            {/* Card Header */}
            <div className="card-header">
              <div className="card-pic">
                <img
                  src={imageSource}
                  alt=""
                />
              </div>
              <Link to={`/profile/${posts.postedBy._id}`}>
                <h5>{posts.postedBy.fullName}</h5>
              </Link>
            </div>
            {/* Card img */}
            <div className="card-image">
              <img src={posts.photo} alt=""></img>
            </div>
            {/* Card Content */}
            <div className="card-content">
              {
                // when we take object we user parse
                posts.likes.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                ) ? (
                  <span
                    className="material-symbols-outlined
              material-symbols-outlined-red"
                    onClick={() => {
                      unlikePost(posts._id);
                    }}
                  >
                    favorite
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      likePost(posts._id);
                    }}
                  >
                    favorite
                  </span>
                )
              }

              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all Comments
              </p>
            </div>

            {/* add Comment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                type="text"
                name=""
                id=""
                placeholder="Add a Comment"
              />
              <button
                className="comment"
                onClick={() => {
                  makeComment(comment, posts._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}

      {/* Show Comment */}
      {/* Conditional Rendering */}
      {show && (
        <div className="showcomment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
            </div>
            <div className="details">
              {/* Card Header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                    src="https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?auto=format&fit=crop&q=80&w=1030&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                </div>
                <h5>{item.postedBy.fullName}</h5>
              </div>

              {/* Comment Section */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {comment.postedBy.fullName}{" "}
                      </span>

                      <span className="commentText">{comment.comment}</span>
                    </p>
                  );
                })}
              </div>

              {/* Card Content */}
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  value={comment}
                  type="text"
                  placeholder="Add a Comment"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <span
              className="material-symbols-outlined
        material-symbols-outlined-comment"
            >
              close
            </span>
          </div>
        </div>
      )}

      {data.length === 0 && <p>No posts available</p>}
    </div>
  );
}
