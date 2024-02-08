import "./EditBlog.css";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { Prompt, useHistory, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import ReactQuill, { modules } from "react-quill";
import "react-quill/dist/quill.snow.css";

import Success from "../../lib/SuccessfullMessage/Sucessfull";

const EditBlog = () => {
  const history = useHistory();
  const params = useParams();
  const username = useSelector((state) => state.username);
  const [imgUp, setImgUp] = useState(false);
  // useState for saving the create blog details
  const [BlogD, setBlogD] = useState({
    blogId: params.blogId,
    title: "",
    image: null,
    content: "",
  });
  const [cbhFormState, setSBHFormState] = useState(false);
  const [showSucMsg, setShowSucMsg] = useState(false);
  const [showErrorMsg, setShowrrorMsg] = useState(false);
  const [btnMsg, setBtnMsg] = useState("UPDATE");

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(
          `https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/blog/getblogdetails/${params.blogId}`
          //`http://localhost:3000/blog/getblogdetails/${params.blogId}`
        );
        const res = await req.json();
        setBlogD(() => res[0]);

        if (res.msg == "error") {
          setShowrrorMsg(() => true);
        }
      } catch (e) {
        setShowrrorMsg(() => true);
      }
    })();
  }, []);

  // sav the clicks on every input
  const onChangeTitle = (event) => {
    setBlogD((prev) => {
      return { ...prev, title: event.target.value };
    });
  };

  const blogImageHandler = useCallback((event) => {
    setBlogD((prev) => {
      return { ...prev, image: event[0] };
    });
    setImgUp(() => true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: blogImageHandler,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    }, // Specify accepted file types (in this case, images)
  });

  // async func for taking inputs on every click on react-quill editor
  const onChangeEditorCon = async (value) => {
    let body = "";
    const value1 = await value;
    body = value1;
    setBlogD((prev) => {
      return { ...prev, content: body };
    });
  };

  //  actions to be performed when the user is finished typing
  const saveBlogDetailsBtn = async (event) => {
    setBtnMsg(() => "UPDATING...");
    event.preventDefault();

    setSBHFormState(() => false);
    if (!BlogD.image || !BlogD.content || !BlogD.title) {
      // if anyone of the field is empty prevent from submitting
      setBtnMsg(() => "UPDATE");
      setShowrrorMsg(() => true);
      return;
    }

    try {
      setShowrrorMsg(() => false);
      if (imgUp) {
        console.log("run1");
        const imageFormData = new FormData();
        imageFormData.append("file", BlogD.image);
        imageFormData.append("upload_preset", "poxoiska");
        imageFormData.append("cloud_name", "dppoh8lvz");

        const cloudinaryResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dppoh8lvz/image/upload",
          {
            method: "POST",
            body: imageFormData,
          }
        );

        if (cloudinaryResponse.ok) {
          const cloudinaryData = await cloudinaryResponse.json();
          const imageUrl = cloudinaryData.secure_url;

          const postData = {
            title: BlogD.title,
            textCont: BlogD.content,
            imageUrl: imageUrl,
            BlogId: BlogD.blogId,
          };
          (async () => {
            const jsonData = await fetch(
              //"https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/blog/updateblogdetails",
              "http://localhost:3000/blog/updateblogdetails",
              {
                method: "POST",
                body: JSON.stringify(postData),
                headers: { "Content-Type": "application/json" },
              }
            );
            const res = await jsonData.json();
            setBtnMsg(() => "UPDATE");
            if (res.msg == "okay") {
              setShowSucMsg(() => true);
              setTimeout(() => {
                setShowSucMsg(() => false);
              }, 1500);
              setTimeout(() => {
                history.replace(`/userprofile/${username}/allblogs`);
              }, 2000);
            } else {
              setShowrrorMsg(() => true);
            }
          })();
        }
      } else {
        (async () => {
          const postData = {
            title: BlogD.title,
            textCont: BlogD.content,
            imageUrl: BlogD.image,
            BlogId: BlogD.blogId,
          };
          const jsonData = await fetch(
            //"https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/blog/updateblogdetails",
            "http://localhost:3000/blog/updateblogdetails",
            {
              method: "POST",
              body: JSON.stringify(postData),
              headers: { "Content-Type": "application/json" },
            }
          );
          const res = await jsonData.json();
          setBtnMsg(() => "UPDATE");
          if (res.msg == "okay") {
            setShowSucMsg(() => true);
            setTimeout(() => {
              setShowSucMsg(() => false);
            }, 1500);
            setTimeout(() => {
              history.replace(`/userprofile/${username}/allblogs`);
            }, 2000);
          } else {
            setShowrrorMsg(() => true);
          }
        })();
      }
    } catch (e) {
      setShowrrorMsg(() => true);
      setBtnMsg(() => "UPDATE");
    }
  };

  const cbfHandler = () => {
    setSBHFormState(() => true);
  };

  return (
    <>
      <Prompt
        when={cbhFormState}
        message={() =>
          "Dou wanna navigate to other to page? \nAll your input data will be lost!"
        }
      />
      <form className="createblog_main" onFocus={cbfHandler}>
        <h2> Edit Post</h2>
        <section className="createBlog_cont">
          <h2>PUT</h2>
          <div className="createBlog_cont__inputs">
            <input
              type="text"
              onChange={onChangeTitle}
              value={BlogD.title}
              required
              placeholder="Title"
            />
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {BlogD.image?.path ? BlogD.image.path : "Browse or drop image"}
            </div>
          </div>
          <ReactQuill
            theme="snow"
            onChange={onChangeEditorCon}
            modules={modules}
            value={DOMPurify.sanitize(BlogD?.content)}
          ></ReactQuill>

          {showErrorMsg && (
            <div className="create_cont__error">
              Something went wrong,check whether all fields are filled!
            </div>
          )}
          <button className="createBlog_cont__btn" onClick={saveBlogDetailsBtn}>
            {btnMsg}
          </button>
          {showSucMsg && <Success />}
        </section>
      </form>
    </>
  );
};

export default EditBlog;
