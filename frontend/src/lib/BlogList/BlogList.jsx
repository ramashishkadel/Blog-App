import "./BlogList.css";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const BlogList = ({ blogId, title, textCont, imgUrl, className }) => {
  const sanitizedHTML = DOMPurify.sanitize(textCont);
  const history = useHistory();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sliceLength, setSliceLength] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    if (windowWidth < 900) {
      setSliceLength(() =>
        sanitizedHTML.length > 80
          ? sanitizedHTML.length / 15
          : sanitizedHTML.length / 2
      );
    } else {
      setSliceLength(() =>
        sanitizedHTML.length / 2 > 200
          ? sanitizedHTML.length / 5
          : sanitizedHTML.length / 2
      );
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const openBlogHandler = () => {
    history.push(`/blogdetail/${blogId}`);
  };
  return (
    <>
      <div className={className}>
        <div className="profileblog_cont" onClick={openBlogHandler}>
          <div>
            <h3>{title}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: sanitizedHTML.slice(0, sliceLength) + "...",
              }}
            ></p>
          </div>
          <div>
            <img src={imgUrl} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogList;
