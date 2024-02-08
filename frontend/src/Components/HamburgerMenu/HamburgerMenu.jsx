import { NavLink } from "react-router-dom";
import cancel from "../../assets/cancel.png";
import { useDispatch, useSelector } from "react-redux";
import { blogActions } from "../../store/store";

import "./HamburgerMenu.css";

const HamburgerMenu = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.username);
  const closeHamburgerHandler = () => {
    dispatch(blogActions.hamburgerOptions(false));
  };

  return (
    <div className="hm_cont">
      <div className="hp_cont__icon" onClick={closeHamburgerHandler}>
        <img src={cancel} alt="cancel" />
      </div>
      <ul className="hm_cont__list">
        <li onClick={closeHamburgerHandler}>
          <NavLink
            to="/"
            className="routerLink"
            activeClassName="routerLink_active"
          >
            Homepage
          </NavLink>
        </li>
        <li onClick={closeHamburgerHandler}>
          <NavLink
            to="/createblog"
            className="routerLink"
            activeClassName="routerLink_active"
          >
            Create blog
          </NavLink>
        </li>
        <li onClick={closeHamburgerHandler}>
          <NavLink
            to={`/userprofile/${username}/allblogs`}
            className="routerLink"
            activeClassName="routerLink_active"
          >
            My profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default HamburgerMenu;
