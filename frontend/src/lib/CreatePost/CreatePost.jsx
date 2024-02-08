import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import nodp from "../../assets/nodp.jpg";
import "./CreatePost.css";

const CreatePost = ({ width, margin }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const history = useHistory();
  const username = localStorage.getItem("username");
  const params = useParams();
  const usernamR = params.username || username;
  useEffect(() => {
    username &&
      (async () => {
        try {
          const jsonData = await fetch(
            `https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/users/getuserdetails/${usernamR}`
          );
          const res = await jsonData.json();
          if (!res.username) return;

          setImgUrl(() => res.profilepic);
        } catch (e) {
          console.log(e);
        }
      })();
  }, []);

  const createPostOpenHandler = () => {
    history.push("/createblog");
  };

  const userProfileOpenHandler = () => {
    history.push(`/userprofile/${usernamR}/allblogs`);
  };

  return (
    <section
      className="createPost"
      style={{ width: `${width}%`, marginTop: `${margin}rem` }}
    >
      <div className="createPost__img" onClick={userProfileOpenHandler}>
        <img src={imgUrl || nodp} />
      </div>
      <input
        placeholder="Create post"
        className="routerLink"
        onClick={createPostOpenHandler}
      />
    </section>
  );
};

export default CreatePost;
