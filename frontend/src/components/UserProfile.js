import React, { useEffect, useState } from "react";
import "./css/Profile.css";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

  // To follow user
  const followUser = (userId) => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then(resp => resp.json())
      .then(data=> {console.log(data)
        setIsFollow(true)
      });
  };
  // To Unfollow user
  const unfollowUser = (userId) => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((resp) => {resp.json();})
      .then((data) => {console.log(data)
        setIsFollow(false)
      });
  };

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((resp) => resp.json())
      .then((result) => {
        setUser(result.user);
        setPosts(result.post);
        if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
          setIsFollow(true)
        }
      });
  }, [isFollow]);

  return (
    <div className="profile">
      {/* Profile Frame */}
      <div className="profile-frame">
        <div className="profile-pic">
          <img
          src={user.Photo? user.Photo : picLink}
          alt="profile-pic"
          />
        </div>
        {/* Profile data */}
        <div className="profile-data">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>{user.fullName}</h1>
            <button
              className="followBtn"
              onClick={() => {
                if(isFollow){
                  unfollowUser(user._id)
                }else{
                  followUser(user._id)
                }
              }}
            >
              {isFollow ? "Unfollow":"Follow"}
            </button>
          </div>
          <div className="profile-info">
            <p>{posts.length} post</p>
            <p>{user.followers?user.followers.length:"0"} followers</p>
            <p>{user.following?user.following.length:"0"} following</p>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "90%",
          margin: "auto",
          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        {posts.map((pics) => {
          return (
            <img
              style={{ cursor: "pointer" }}
              key={pics._id}
              src={pics.photo}
              //   onClick={()=>{
              //     toggleDetails(pics)
              //   }}
              className="item"
            ></img>
          );
        })}
      </div>
      {/* {show &&
      <PostDetail item={posts}
       toggleDetails={toggleDetails} 
       />
      } */}
    </div>
  );
}
