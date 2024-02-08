import "./UserDetails.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useDropzone } from "react-dropzone";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import Success from "../../../lib/SuccessfullMessage/Sucessfull";

const UserDetails = () => {
  const history = useHistory();
  const userNameForDetails = useSelector((state) => state.userNameForDetails);
  //useState for saving the form data
  const [formData, setFormData] = useState({
    name: "",
    mobileNum: "",
    emailAddress: "",
    gender: "",
    bio: "",
    profilePic: null,
    dob: "",
  });

  //usState for changing the msg on the register button
  const [btnMsg, setBtnMsg] = useState("Submit details");

  const [showSucMsg, setSucMsg] = useState(false);

  // if error occurs this function is responsible for displaying the appropriate msg
  const [errorMsg, setErrorMsg] = useState(false);

  // list of all genders
  const genderOptions = ["Male", "Female", "Non-binary", "Other"];

  // saving clicks on inputs
  const handleGenderChange = (event) => {
    setFormData((prev) => {
      return { ...prev, gender: event.target.value };
    });
  };

  const detailsNameHan = (event) => {
    setFormData((prev) => {
      return { ...prev, name: event.target.value };
    });
  };
  const detailsMobHan = (event) => {
    setFormData((prev) => {
      return { ...prev, mobileNum: event.target.value };
    });
  };
  const detailsEmailHan = (event) => {
    setFormData((prev) => {
      return { ...prev, emailAddress: event.target.value };
    });
  };
  const detailsBioHan = (event) => {
    setFormData((prev) => {
      return { ...prev, bio: event.target.value };
    });
  };
  const handleDateChange = (date) => {
    setFormData((prev) => {
      return { ...prev, dob: date };
    });
  };

  const detailsPicHan = (accept) => {
    setFormData((prev) => {
      return { ...prev, profilePic: accept[0] };
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: detailsPicHan,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    }, // Specify accepted file types (in this case, images)
  });

  // actions to be performed when the user details form is usbmitted
  const detailsFormHandler = async () => {
    setBtnMsg(() => "Submitting ...");
    setErrorMsg(() => false);
    const imageFormData = new FormData();
    imageFormData.append("file", formData.profilePic);
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
      (async () => {
        const formData1 = {
          username: userNameForDetails,
          name: formData.name,
          mobileNum: formData.mobileNum,
          emailAddress: formData.emailAddress,
          gender: formData.gender,
          bio: formData.bio,
          profilePic: imageUrl,
          dob: formData.dob,
        };
        try {
          const req = await fetch(
            "https://2y632020u3.execute-api.eu-north-1.amazonaws.com/prod/users/userdetails",
            //"http://localhost:3000/users/userdetails",
            {
              method: "POST",
              body: JSON.stringify(formData1),
              headers: { "Content-Type": "application/json" },
            }
          );
          const res = await req.json();

          if (res.msg == "error") {
            setErrorMsg(() => true);
          } else {
            setSucMsg(() => true);
            setTimeout(() => {
              setSucMsg(() => false);
            }, 1500);
            setTimeout(() => {
              history.replace("/login");
            }, 2000);
          }
        } catch (e) {
          console.log(e);
          setErrorMsg(() => true);
        }
      })();
    }
    setBtnMsg(() => "Submit details");
  };

  // perform the details functionalities when button is clicked
  const submitDetailsHan = () => {
    detailsFormHandler();
  };

  return (
    <>
      <div className="userdeatils_cont">
        <h1>Please enter your details</h1>
        <form className="userdetails_cont__form" onSubmit={detailsFormHandler}>
          <section className="userdetails_cont__pairs">
            <input
              placeholder="Enter name*"
              type="text"
              required
              onChange={detailsNameHan}
              value={formData.name}
            />

            <input
              placeholder="Enter Mobile Number*"
              type="tel"
              required
              onChange={detailsMobHan}
              value={formData.mobileNum}
            />
          </section>
          <section className="userdetails_cont__pairs">
            <input
              placeholder="Enter Email Address*"
              type="email"
              required
              value={formData.emailAddress}
              onChange={detailsEmailHan}
            />
            <input
              placeholder="Enter Bio"
              type="text"
              required
              value={formData.bio}
              onChange={detailsBioHan}
            />
          </section>

          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleGenderChange}
            required
          >
            <option value="">Select gender*</option>
            {genderOptions.map((gender, index) => (
              <option key={index} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          <DatePicker
            selected={formData.dob}
            onChange={handleDateChange}
            dateFormat="MM/dd/yyyy"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={15}
            placeholderText="Select a date of birth*"
            // isClearable // Adds a clear button
            style={{ witdh: "100%", textAlign: "center" }}
            required
          />
          <div {...getRootProps()} className="userdetails_cont_imgdrop">
            <input {...getInputProps()} required />
            {formData.profilePic
              ? formData.profilePic.path
              : "Browse or drop image"}
          </div>
        </form>
        {errorMsg && (
          <div className="userdetails_cont__error">
            Something went wrong.(check wheter you've entered all fields)
          </div>
        )}
        <button onClick={submitDetailsHan} className="userdetails_btn">
          {btnMsg}
        </button>
        {showSucMsg && <Success />}
      </div>
    </>
  );
};

export default UserDetails;
