import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { showError, showSuccess } from "app/utils/helpers";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import clsx from "clsx";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

const SubmitButton = styled(Button)({
  width: "100%",
  marginTop: "15px",
  padding: "10px 0px",
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "12px",
});

const useStyles = makeStyles((theme) => ({
  customLabel: {
    "& label": {
      fontSize: "12px",
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState({});
  const [fileshow, setFileshow] = useState("");
  const [file, setFile] = useState(undefined);
  const textInput = useRef();

  useEffect(() => {
    dispatch(setToolbarHeader("Profile"));
    console.log(user);

    if (user.data.otherInfo) {
      setEmail(user.data.otherInfo.data.email);
      setFirstName(user.data.otherInfo.data.firstname);
      setLastName(user.data.otherInfo.data.lastname);
      setDob(user.data.otherInfo.data.dob);
      setPhone(user.data.otherInfo.data.phone);
      setCompany(user.data.otherInfo.data.company);
    }
  }, []);

  const formSubmit = () => {
    setError({});

    axios
      .post("user/updateProfile", {
        email: user.data.otherInfo.data.email,
        firstname: firstname,
        lastname: lastname,
        dob: dob,
        company: company,
        phone: phone,
      })
      .then((res) => {
        showSuccess(res.data.message);

        // let Email = response.data.result.email;
        // let FirstName = response.data.result.firstName;
        // let updatedUser = { ...user };

        // updatedUser.result.email = Email;
        // updatedUser.result.firstName = FirstName;
      })
      .catch((err) => {
        showError(err.response.data.message);
      });
  };

  const handleUploadBtnClick = () => {
    textInput.current.click();
  };

  const handleImageChange = (event) => {
    setFileshow(URL.createObjectURL(event.target.files[0]));
    setFile("file", event.target.files[0]);

    handleUpdateProfilePic(event.target.files[0]);
  };

  // apii

  const handleUpdateProfilePic = (selectedfile) => {
    var bodyFormData = new FormData();

    bodyFormData.append("profile_photo", selectedfile);

    axios({
      method: "post",
      url: "http://65.1.136.216:3005/apiv1/user/uploadProfilePic",
      data: bodyFormData,
      // headers: {
      //   Authorization: user.token,
      // },
    })
      .then((response) => {
        console.log(response);
        console.log("Update Picture Response", response.data);
      })
      .catch((response) => {
        console.log(response);
      });
  };

  return (
    <Box
      sx={{
        margin: "30px",
        width: "50%",
        display: "grid",
        gridColumnGap: "50%",
      }}
    >
      <div className="mb-20">
        <TextField
          id="Email"
          label="Email"
          classes={{ root: classes.customLabel }}
          type="name"
          name={"email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={error.email}
        />
      </div>
      <div className="mb-20">
        <TextField
          id="FirstName"
          label="FirstName"
          classes={{ root: classes.customLabel }}
          type="name"
          name={"firstname"}
          value={firstname}
          onChange={(e) => setFirstName(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={error.firstname}
        />
      </div>
      <div className="mb-20">
        <TextField
          id="LastName"
          label="LastName"
          classes={{ root: classes.customLabel }}
          type="lastname"
          name={"lastname"}
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={error.lastname}
        />
      </div>
      <div className="mb-20">
        {/* <TextField
          id="Dob"
          label="Dob"
          classes={{ root: classes.customLabel }}
          type="dob"
          name={"dob"}
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={error.dob}
        /> */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Date"
            inputFormat="MM/DD/YYYY"
            value={dob}
            onChange={(date) => setDob(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

      <div className="mb-20">
        <TextField
          id="Phone"
          label="Phone"
          classes={{ root: classes.customLabel }}
          type="number"
          name={"phone"}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={error.phone}
        />
      </div>

      <div
        style={{
          marginLeft: "49rem",
          width: "50%",
          marginBottom: "37rem",
          borderRadius: "40%",
        }}
        className="flex items-center justify-center absolute bottom-0 -mb-44"
      >
        <Avatar
          className={clsx(classes.avatar, "avatar w-72 h-72 p-8 box-content")}
          alt="user photo"
          src={fileshow ? fileshow : user.data.photoURL}
          // src={
          //   user.data.photoURL && user.data.photoURL !== ""
          //     ? user.data.photoURL
          //     : "assets/images/avatars/profile.jpg"
          // }
        />
        <div>
          <Link onClick={handleUploadBtnClick}>Change Profile Photo</Link>

          <input
            type="file"
            id="file_input_file"
            ref={textInput}
            accept="image/png, 
               image/jpeg"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <SubmitButton type="button" variant="contained" onClick={formSubmit}>
        Update Profile
      </SubmitButton>
    </Box>
  );
};

export default Profile;
