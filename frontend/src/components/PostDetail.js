import React from "react";
import "./css/PostDetail.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostDetail({ item, toggleDetails }) {
  const navigate = useNavigate();

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const removePost = (postId) => {
    if (window.confirm("Do you really want to delete this post")) {
      fetch(`/deletePost/${postId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((resp) => resp.json())
        .then((result) => {
          console.log(result);
          notifyB(result.message)
          toggleDetails();
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
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
              <div
                className="deletePost"
                onClick={() => {
                  removePost(item._id);
                }}
              >
                <span className="material-symbols-outlined">delete</span>
              </div>
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
                //   value={comment}
                type="text"
                placeholder="Add a Comment"
                //   onChange={(e) => {
                //     setComment(e.target.value);
                //   }}
              />
              <button
                className="comment"
                //   onClick={() => {
                //     makeComment(comment, item._id);
                //     toggleComment();
                //   }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
        <div
          className="close-comment"
          onClick={() => {
            toggleDetails();
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
    </div>
  );
}
