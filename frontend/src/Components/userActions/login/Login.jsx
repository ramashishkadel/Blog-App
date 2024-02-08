import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom";
import { blogActions } from "../../../store/store";
import cancel from "../../../assets/cancel.png";

import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  //useState for handling form data
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });

  const [showErrMsg, setShowErrorMsg] = useState(false);

  //save the clicks on username input
  const loginUsernameHandler = (event) => {
    setLoginFormData((prev) => {
      return { ...prev, username: event.target.value };
    });
  };

  //save the clicks on password input
  const loginPassHandler = (event) => {
    setLoginFormData((prev) => {
      return { ...prev, password: event.target.value };
    });
  };

  //actions to be formed when login form is submitted
  const loginFormHandler = (e) => {
    setShowErrorMsg(() => false);
    e.preventDefault(); // to prevent it from reloading the page

    (async () => {
      try {
        const jsonRes = await fetch(
          "https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/users/login",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginFormData),
          }
        );
        const res = await jsonRes.json();
        console.log(res);
        if (res.msg == "no") {
          history.push("/register/userdetails");
          dispatch(blogActions.setuserNameForDeatils(loginFormData.username));
        } else if (res.msg == "error") {
          setShowErrorMsg(() => true);
        } else {
          dispatch(blogActions.setUsername(loginFormData.username));
          dispatch(blogActions.setLoginState(true));
          localStorage.setItem("username", loginFormData.username);
          history.replace("/");
          window.location.reload();
        }
      } catch (e) {
        setShowErrorMsg(() => true);
      }
    })(); // IIFE for checking if the user exist and authenticate then
  };

  return (
    <>
      <section className="login_cont">
        <Link to="/" className="routerLink">
          <div className="login_cont__icon">
            <img src={cancel} alt="cancel" />
          </div>
        </Link>
        <div className="login_cont__msg">Welcome back!</div>
        <form onSubmit={loginFormHandler} className="login_cont__form">
          <section>
            <input
              type="text"
              placeholder="Enter Username"
              onChange={loginUsernameHandler}
              value={loginFormData.username}
            />
          </section>

          <section>
            <input
              type="password"
              placeholder="Enter Password"
              onChange={loginPassHandler}
              value={loginFormData.password}
            />
          </section>
          {showErrMsg && (
            <div className="login_cont__error">Invalid creadentials</div>
          )}
          <button type="submit" className="login_cont_formButton">
            Login
          </button>
        </form>
        <div className="login_cont__otherOp">
          <Link to="/register" className="routerLink">
            No account? Create one
          </Link>
        </div>
      </section>
    </>
  );
};

export default Login;
