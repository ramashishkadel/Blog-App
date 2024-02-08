import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom";
import { blogActions } from "../../../store/store";

import Loader from "../../../lib/Loader/Loader";
import cancel from "../../../assets/cancel.png";
import Success from "../../../lib/SuccessfullMessage/Sucessfull";

import "../login/Login.css";
import "./Register.css";

const Register = () => {
  // dispatch actions to the store
  const dispatch = useDispatch();

  const history = useHistory();

  //register form useState
  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showSucMsg, setSucMsg] = useState(false);

  //usState for changing the msg on the register button
  const [btnMsg, setBtnMsg] = useState("Register");

  // if error occurs this function is responsible for displaying the appropriate msg
  const [errorMsg, setErrorMsg] = useState(false);

  //loader for async task till the time ive not recieved my data
  const [showLoader, setShowLoader] = useState(false);

  //to check wheter username already exists or not
  const usernameExists = useSelector((state) => state.usernameExists);

  // to check if the pass match or not
  const passNotEqual = useSelector((state) => state.passNotEqual);

  //save the clicks on the username input
  const registerUsernameHandler = (event) => {
    setRegisterFormData((prev) => {
      return { ...prev, username: event.target.value };
    });
  };

  //save the clicks on the password input
  const registerPasswordHandler = (event) => {
    setRegisterFormData((prev) => {
      return { ...prev, password: event.target.value };
    });
  };

  //save the clicks on the confirm password input
  const registerConfirmPasswordHandler = (event) => {
    setRegisterFormData((prev) => {
      return { ...prev, confirmPassword: event.target.value };
    });
  };

  // actions to be performed when register form is submittd
  const registerFormHandler = (e) => {
    setErrorMsg(() => false);
    dispatch(blogActions.setPassNotEqual(false));
    e.preventDefault(); // prevent it from reloading

    if (usernameExists) {
      return;
    }

    if (registerFormData.password != registerFormData.confirmPassword) {
      dispatch(blogActions.setPassNotEqual(true)); // if passwords donot match
      return;
    } else {
      (async () => {
        try {
          setBtnMsg(() => "Registering...");
          const req = await fetch(
            "https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/users/register",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(registerFormData),
            }
          );
          const res = await req.json();
          if (res.msg == "error") {
            setErrorMsg(() => true);
          } else {
            setSucMsg(() => true);
            setTimeout(() => {
              setSucMsg(() => false);
            }, 1500);
            setTimeout(() => {
              history.replace("/register/userdetails");
            }, 2000);
            dispatch(
              blogActions.setuserNameForDeatils(registerFormData.username)
            );
          }
        } catch (e) {
          setErrorMsg(() => true);
        } finally {
          setBtnMsg(() => "Register");
        }
      })(); // IIFE for saving the data to the databse
    }
  };

  useEffect(() => {
    setErrorMsg(() => false);
    dispatch(blogActions.usernameExists(false));
    dispatch(blogActions.setPassNotEqual(false));
    setShowLoader(() => true);

    //logic for checking if username exists or not
    let timer = setTimeout(async () => {
      try {
        const usernamesRes = await fetch(
          "https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/users/usernames"
        );
        const data = await usernamesRes.json();
        if (!data) setShowLoader(() => false);
        data.forEach((el) => {
          if (el.username == registerFormData.username) {
            dispatch(blogActions.usernameExists(true));
          }
        });
        setShowLoader(() => false);
      } catch (e) {}
    }, 800);

    return () => {
      clearTimeout(timer); // for debouncing
    };
  }, [registerFormData.username]);

  return (
    <section className="login_cont">
      <Link to="/" className="routerLink">
        <div className="login_cont__icon">
          <img src={cancel} alt="cancel" />
        </div>
      </Link>
      <div className="login_cont__msg">Welcome!</div>
      <form onSubmit={registerFormHandler} className="login_cont__form">
        <section>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Enter Username"
              onChange={registerUsernameHandler}
              value={registerFormData.username}
              required
            />
            {showLoader && <Loader dimension={1} className="loader_register" />}
          </div>
          {usernameExists && (
            <div className="login_cont__error">username already exists</div>
          )}
        </section>

        <section>
          <input
            type="password"
            placeholder="Enter Password"
            onChange={registerPasswordHandler}
            value={registerFormData.password}
            required
          />
        </section>
        <section>
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={registerConfirmPasswordHandler}
            value={registerFormData.confirmPassword}
            required
          />
        </section>
        {passNotEqual && (
          <div className="login_cont__error">Passwords do not match.</div>
        )}

        {errorMsg && (
          <div className="login_cont__error">Something went wrong.</div>
        )}
        <button type="submit" className="login_cont_formButton">
          {btnMsg}
        </button>
      </form>
      <div className="login_cont__otherOp">
        <Link className="routerLink" to="/login">
          Already have a account? Login instead
        </Link>
      </div>
      {showSucMsg && <Success />}
    </section>
  );
};

export default Register;
