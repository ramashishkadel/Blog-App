import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import Loader from "../../lib/Loader/Loader";
import DOMPurify from "dompurify";
import { SvgLoader, SvgProxy } from "react-svgmt";

import uparrow from "../../assets/upA.svg";
import downarrow from "../../assets/downA.svg";
import "./BlogDetail.css";

const BlogDetail = () => {
  const [blogData, setBlogData] = useState({});
  const [userData, setUserData] = useState({});
  const [blogDate, setBlogDate] = useState();
  const [showLoaderF, setShowLoaderF] = useState(true);
  const [showLoaderU, setShowLoaderU] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const params = useParams();
  const history = useHistory();
  const sanitizedHTML = DOMPurify.sanitize(blogData?.content);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const username = useSelector((state) => state.username);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  useEffect(() => {
    if (!blogData?.author) {
      (async () => {
        try {
          const req = await fetch(
            `https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/blog/getblogdetails/${params.blogId}`
            //`http://localhost:3000/blog/getblogdetails/${params.blogId}`
          );
          const res = await req.json();
          setBlogData(() => res[0]);
          setUpvotes(() => res[0]?.upvotes);
          setDownvotes(() => res[0]?.downvotes);
          const date = new Date(res[0]?.timestamp);

          // Define an array of month names
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          // Extract the month, day, and year from the Date object
          const monthName = months[date.getMonth()];
          const day = date.getDate();
          const year = date.getFullYear();

          // Format the date in the desired format
          const formattedDate = `${monthName} ${day} '${year}`;
          setBlogDate(() => formattedDate);
          setShowLoaderF(() => false);

          if (res.msg == "error") {
            setShowErrorMsg(() => true);
            setErrorMsg(() => "something went wrong!");
            return;
          }

          if (!res.length) {
            setShowErrorMsg(() => true);
            setErrorMsg(() => "Uhoh, this blog dosen't exist)");
            return;
          }
        } catch (e) {
          setShowErrorMsg(() => true);
          setErrorMsg(() => "something went wrong");
        }
      })();
    }

    if (blogData?.author) {
      (async () => {
        try {
          const jsonData = await fetch(
            `https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/users/getuserdetails/${blogData?.author}`
          );
          const res = await jsonData.json();
          setUserData(() => res);
          setShowLoaderU(() => false);
        } catch (e) {}
      })();
    } // IIFE for geting the username data from the db
  }, [blogData]);

  const openUserProfileHandler = () => {
    history.push(`/userprofile/${blogData.author}/allblogs`);
  };

  const upvotesHandler = () => {
    if (!isLoggedIn) {
      history.push("/login");
    } else {
      (async () => {
        const req = await fetch(
          `https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/blog/upvote/${params.blogId}?username=${username}`,
          {
            method: "POST",
          }
        );
        const res = await req.json();

        setUpvotes(res[0].upvotes);
      })();
    }
  };

  // const downvotesHandler = () => {
  //   if (!isLoggedIn) {
  //     history.push("/login");
  //   }
  //   (async () => {
  //     const req = await fetch(
  //       `http://localhost:3000/blog/downvote/${params.blogId}?username=${username}`,
  //       {
  //         method: "POST",
  //       }
  //     );
  //     const res = await req.json();

  //     setDownvotes(res[0].downvotes);
  //   })();
  // };

  return (
    <section className="blogdetail_cont">
      {showErrorMsg && <div className="blogdetail_errormsg">{errorMsg}</div>}
      {showLoaderF && <Loader dimension={4} />}
      {showLoaderF || (
        <div className="blogdetail_main">
          <h1>{blogData?.title}</h1>
          {showLoaderU && <Loader dimension={1.3} />}
          {showLoaderU || (
            <div className="blogdetail_userinfo">
              <div
                className="bd_userinfo__imgcont"
                onClick={openUserProfileHandler}
              >
                <img src={userData?.profilepic} />
              </div>
              <div className="bd_userinfo__data">
                <h3>{userData?.fullname}</h3>
                <h3>{blogDate}</h3>
              </div>
            </div>
          )}
          <div className="bd_action__cont">
            <div className="bd_action__imgcont" onClick={upvotesHandler}>
              <SvgLoader path={uparrow}>
                <SvgProxy selector="#Star" />
              </SvgLoader>
              <div>{upvotes}</div>
            </div>

            {/* <div
              className="bd_action__imgcont bd_down__svg"
              onClick={downvotesHandler}
            >
              <SvgLoader path={downarrow}>
                <SvgProxy selector="#Star" />
              </SvgLoader>
              <div>{downvotes}</div>
            </div> */}
          </div>
          <div className="blogdetail_img__cont">
            <img src={blogData?.image} />
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: sanitizedHTML,
            }}
          ></p>
        </div>
      )}
    </section>
  );
};

export default BlogDetail;
