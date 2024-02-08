import { NavLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";
import { blogActions } from "../../store/store";
import { SvgLoader, SvgProxy } from "react-svgmt";
import hm from "../../assets/hm.svg";
import logo from "../../assets/logo.png";
import Backdrop from "../../lib/Backdrop/Backdrop";
import "./NavBar.css";

const NavBar = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const hamburger = useSelector((state) => state.hamburger);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const username = useSelector((state) => state.username);

  const showHamburgerMenu = () => {
    dispatch(blogActions.hamburgerOptions(true));
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    if (windowWidth < 480) {
      dispatch(blogActions.hamburgerOptions(false));
    }

    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      dispatch(blogActions.setLoginState(true));
      dispatch(blogActions.setUsername(savedUsername));
    } else {
      dispatch(blogActions.setLoginState(false));
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const reloadprofilePageHandler = () => {
    if (params.username != localStorage.getItem("username")) {
      dispatch(blogActions.profileClicked(true));
    }
  };

  return (
    <>
      <div>
        {hamburger && (
          <>
            <HamburgerMenu /> <Backdrop />
          </>
        )}
      </div>
      <nav className="nav">
        <div className="nav_logo__cont">
          <div className="nav_hm__icon" onClick={showHamburgerMenu}>
            <SvgLoader path={hm}>
              <SvgProxy selector="#Star" />
            </SvgLoader>
          </div>
          <NavLink
            className="routerLink"
            activeClassName="routerLink_active"
            to="/"
          >
            <img src={logo} style={{ width: "6rem" }} />
          </NavLink>
        </div>
        <ul className="nav_link__cont">
          <li>
            <NavLink
              className="routerLink"
              to="/createblog"
              activeClassName="routerLink_active"
            >
              Create blog
            </NavLink>
          </li>
          <li onClick={reloadprofilePageHandler}>
            <NavLink
              className="routerLink"
              to={`/userprofile/${username}/allblogs`}
              activeClassName="routerLink_active"
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              className="routerLink routerLink_alt"
              to={isLoggedIn ? "/logout" : "/login"}
              activeClassName="routerLink_active routerLink_active__alt"
            >
              {isLoggedIn ? "Sign out" : "Sign in"}
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
