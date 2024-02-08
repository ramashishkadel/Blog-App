import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Prompt, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactQuill, { modules } from "react-quill";
import "react-quill/dist/quill.snow.css";

import Success from "../../lib/SuccessfullMessage/Sucessfull";

import "./CreateBlog.css";

const CreateBlog = () => {
  // useState for saving the create blog details
  const [BlogD, setBlogD] = useState({ title: "", img: null, textCont: "" });
  const [cbhFormState, setSBHFormState] = useState(false);
  const [showSucMsg, setShowSucMsg] = useState(false);
  const [showErrorMsg, setShowrrorMsg] = useState(false);
  const [btnMsg, setBtnMsg] = useState("POST");

  const history = useHistory();
  const username = useSelector((state) => state.username);
  // save the clicks on every input
  const onChangeTitle = (event) => {
    setBlogD((prev) => {
      return { ...prev, title: event.target.value };
    });
  };

  const blogImageHandler = useCallback((event) => {
    setBlogD((prev) => {
      return { ...prev, img: event[0] };
    });
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
      return { ...prev, textCont: body };
    });
  };

  //  actions to be performed when the user is finished typing
  const saveBlogDetailsBtn = async (event) => {
    setBtnMsg(() => "POSTING...");
    event.preventDefault();
    setSBHFormState(() => false);
    if (!BlogD.img || !BlogD.textCont || !BlogD.title) {
      // if anyone of the field is empty prevent from submitting
      setBtnMsg(() => "POST");
      setShowrrorMsg(() => true);
      return;
    }

    // const formData = new FormData();
    // formData.append("author", username);
    // formData.append("title", BlogD.title);
    // formData.append("img", BlogD.img);
    // formData.append("textCont", BlogD.textCont);

    try {
      setShowrrorMsg(() => false);
      const imageFormData = new FormData();
      imageFormData.append("file", BlogD.img);
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
          author: username,
          title: BlogD.title,
          textCont: BlogD.textCont,
          imageUrl: imageUrl,
        };
        (async () => {
          const jsonData = await fetch(
            "https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/blog/blogdetails",
            //"http://localhost:3000/blog/blogdetails",
            {
              method: "POST",
              body: JSON.stringify(postData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const res = await jsonData.json();
          console.log(res);
          setBtnMsg(() => "POST");
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
      setBtnMsg(() => "POST");
    } finally {
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
        <h2> Create a post</h2>
        <section className="createBlog_cont">
          <h2>POST</h2>
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
              {BlogD.img ? BlogD.img.path : "Browse or drop image"}
            </div>
          </div>
          <ReactQuill
            theme="snow"
            onChange={onChangeEditorCon}
            modules={modules}
            placeholder="Start Writing Anything you want..."
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

export default CreateBlog;
