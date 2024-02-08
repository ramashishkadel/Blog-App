import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BlogList from "../../lib/BlogList/BlogList";
import Loader from "../../lib/Loader/Loader";

const AllBlogs = () => {
  //saving the blog data after it is fetched from db
  const [blogData, setBlogData] = useState([]);
  const reload = useSelector((state) => state.reload);
  //for showing loader till the time the async func runs
  const [showLoader, setShowLoader] = useState(true);

  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const params = useParams();
  const username = localStorage.getItem("username");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/blog/getuserallblogsdetails/${params.username}`
        );
        const jsonData = await res.json();
        setBlogData(() => jsonData);
        setShowLoader(() => false);
        if (jsonData.msg == "error") {
          setShowErrorMsg(() => true);
          setErrorMsg(() => "something went wrong!");
          return;
        }
        if (!jsonData[0]) {
          setShowErrorMsg(() => true);
          setErrorMsg(
            () =>
              `Uhoh, ${
                username == params.username ? "you" : params.username
              } haven't posted anything :)`
          );
        }
      } catch (e) {
        setShowErrorMsg(() => true);
        setErrorMsg(() => "something went wrong");
      }
    })();
  }, [reload, blogData]);

  return (
    <>
      {showErrorMsg && <div className="myprofile_errormsg">{errorMsg}</div>}
      {showLoader && <Loader dimension={3} />}
      {showLoader ||
        (Array.isArray(blogData) &&
          blogData?.map((el, index) => {
            return (
              <div key={index}>
                <BlogList
                  imgUrl={el.image}
                  title={el.title}
                  textCont={el.content}
                  blogId={el.blogId}
                  className="bloglist"
                />
                {username == params.username && (
                  <div className="allblog_link">
                    <Link to={`/editblog/${el.blogId}`}>
                      <button>{`Edit ${el.title}`}</button>
                    </Link>
                  </div>
                )}
              </div>
            );
          }))}
    </>
  );
};

export default AllBlogs;
