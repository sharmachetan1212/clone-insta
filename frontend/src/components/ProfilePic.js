import React, { useEffect, useState, useRef } from "react";

export default function ProfilePic({ changeprofile }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  // Posting Image to cloudinary
  const postDetails = () => {
    console.log(image);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Insta-clone");
    data.append("cloud_name", "dycxumtd9");

    fetch("https://api.cloudinary.com/v1_1/dycxumtd9/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => setUrl(data.url))
      .catch((err) => console.log(err));
  };

  const postPic = () => {
    // saving post to mongo DB
    fetch("/uploadProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        changeprofile();
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (image) {
      postDetails();
    }
  }, [image]);

  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url]);

  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            onClick={handleClick}
            className="upload-btn"
            style={{ color: "#1ea1f7" }}
          >
            Upload Photo
          </button>
          <input
            ref={hiddenFileInput}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button 
          onClick={()=>{
            setUrl(null)
            postPic()
          }}
          className="upload-btn" style={{ color: "#ed4956" }}>
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            onClick={changeprofile}
            style={{
              color: "#1ea1f7",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Cancle
          </button>
        </div>
      </div>
    </div>
  );
}
