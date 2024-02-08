import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { blogActions } from "../../../store/store";

import "./Logout.css";

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.removeItem("username");
    dispatch(blogActions.setUsername("user"));
    dispatch(blogActions.setLoginState(false));
  }, []);
  return <></>;
};

export default Logout;
