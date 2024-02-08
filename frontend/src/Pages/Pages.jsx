import { Switch, Route, Redirect } from "react-router-dom";
import NavBar from "../Components/NavBar/NavBar";
import Login from "../Components/userActions/login/Login";
import Register from "../Components/userActions/register/Register";
import UserDetails from "../Components/userActions/userDetails/UserDetails";
import Logout from "../Components/userActions/logout/Logout";
import HomePage from "../Components/HomePage/HomePage";
import CreateBlog from "../Components/CreateBlog/CreateBlog";
import UserProfile from "../Components/UserProfile/UserProfile";
import UpvotedBlogs from "../Components/UpvotedBlogs/UpvotedBlog";
import Backdrop from "../lib/Backdrop/Backdrop";
import NotFound from "../Components/NotFound/NotFound";
import BlogDetail from "../Components/BlogDetail/BlogDetail";
import AllBlogs from "../Components/AllBlogs/AllBlogs";
import EditBlog from "../Components/EditBlog/EditBlog";
import { useSelector } from "react-redux";

const Pages = () => {
  const isLogedIn = localStorage.getItem("username");

  const username = useSelector((state) => state.username);
  return (
    <>
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/login" exact>
          <Backdrop />
          <Login />
        </Route>
        <Route path="/register" exact>
          <Register />
          <Backdrop />
        </Route>
        <Route path="/register/userdetails" exact>
          <UserDetails />
          <Backdrop />
        </Route>
        <Route path="/logout" exact>
          <Logout />
          <Redirect to="/" />
        </Route>
        <Route path="/createblog" exact>
          {!isLogedIn ? <Redirect to="/login" /> : <CreateBlog />}
        </Route>
        <Route path={`/userprofile/:username/allblogs`} exact>
          {!isLogedIn ? (
            <Redirect to="/login" />
          ) : (
            <>
              <UserProfile />
              <AllBlogs />
            </>
          )}
        </Route>
        <Route path={`/userprofile/:username/upvotedblogs`} exact>
          {!isLogedIn ? (
            <Redirect to="/login" />
          ) : (
            <>
              <UserProfile />
              <UpvotedBlogs />
            </>
          )}
        </Route>
        <Route path="/blogdetail/:blogId">
          <BlogDetail />
        </Route>
        <Route path="/editblog/:blogId">
          {!isLogedIn ? <Redirect to="/login" /> : <EditBlog />}
        </Route>
        <Route path="/errorpage">
          <NotFound />
        </Route>
        <Route path="*" exact>
          <Redirect to="/errorpage" />
        </Route>
      </Switch>
    </>
  );
};

export default Pages;
