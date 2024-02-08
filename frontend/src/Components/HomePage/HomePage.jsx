import { useState, useEffect, useCallback } from "react";
import Loader from "../../lib/Loader/Loader";
import CreatePost from "../../lib/CreatePost/CreatePost";
import HomePageList from "../../lib/HomePageList/HomePageList";

import "./HomePage.css";

const HomePage = () => {
  // saving the blog details after it is fetched from the db
  const [blogData, setBlogData] = useState([]);

  //for showing loader till the time the async func runs
  const [showLoader, setShowLoader] = useState(true);

  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dim, setDim] = useState(50);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/blog/getallblogs`
        );
        const jsonData = await res.json();

        if (jsonData.length != 1) {
          const array = jsonData; // Get a reference to the original array
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements in the original array
          }
          setBlogData(() => [...array]);
        } else {
          setBlogData(() => jsonData);
        }

        setShowLoader(false);
        if (jsonData.msg == "error") {
          setShowErrorMsg(() => true);
          setErrorMsg(() => "something went wrong!");
          setBlogData(() => []);
          return;
        }
        if (!jsonData[0]) {
          setShowErrorMsg(() => true);
          setErrorMsg(
            () =>
              "Uhoh,looks like this site dosent have any blog, WHAT , go create one??:)"
          );
        }
      } catch (e) {
        setShowErrorMsg(() => true);
        setErrorMsg(() => "something went wrong");
      }
    })(); //IIFE for getting all the blog details
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    if (windowWidth < 1000) {
      setDim(() => 80);
    } else {
      setDim(() => 50);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return (
    <>
      <div className="homepage_cont">
        <CreatePost width={dim} />
        {showErrorMsg && <div className="homepage_errormsg">{errorMsg}</div>}
        {showLoader && <Loader dimension={4} />}
        {showLoader ||
          blogData?.map((el, index) => {
            return (
              <div key={index}>
                <HomePageList
                  title={el.title}
                  textCont={el.content}
                  img={el.image}
                  upvotes={el.upvotes}
                  downvotes={el.downvotes}
                  blogId={el.blogId}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default HomePage;
