import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SideProfile from "../../lib/SideProfile/SideProfile";
import CreatePost from "../../lib/CreatePost/CreatePost";

import "./UserProfile.css";

const MyProfile = () => {
  const params = useParams();
  const username = params.username;
  const usernameR = localStorage.getItem("username");
  return (
    <>
      <SideProfile username={username} />
      <section className="blog_hdngbtn">
        <div>
          <nav>
            <NavLink
              to={`/userprofile/${username}/allblogs`}
              className="routerLink usernav"
              activeClassName="routerLink_active usernav_active"
            >
              All blogs
            </NavLink>

            <NavLink
              to={`/userprofile/${username}/upvotedblogs`}
              className="routerLink usernav"
              activeClassName="routerLink_active usernav_active"
            >
              Upvoted blogs
            </NavLink>
          </nav>
          {usernameR == username && <CreatePost width={100} margin={2} />}
        </div>
      </section>
    </>
  );
};

export default MyProfile;
