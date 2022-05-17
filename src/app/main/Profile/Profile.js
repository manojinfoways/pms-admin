import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import moment from "moment";
import { showError, showSuccess } from "app/utils/helpers";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import clsx from "clsx";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Grid from "@mui/material/Grid";
import { setUserImage } from "../../auth/store/userSlice";
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
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(moment());
  const [error, setError] = useState({});
  const [fileshow, setFileshow] = useState("");
  const [file, setFile] = useState(undefined);
  const textInput = useRef();

  useEffect(() => {
    dispatch(setToolbarHeader("Profile"));
    // console.log("-user-", user);

    if (user.data.otherInfo) {
      // console.log("000", user.data.otherInfo);
      setEmail(user.data.otherInfo.data.email);
      setFirstName(user.data.otherInfo.data.firstname);
      setLastName(user.data.otherInfo.data.lastname);
      setPhone(user.data.otherInfo.data.phone);
      setDob(user.data.otherInfo.data.dob);
      setFileshow(user.data.otherInfo.data.image);
    }
  }, []);

  const formSubmit = () => {
    setError({});

    axios
      .put("users/updateProfile", {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        dob: dob,
        // image: image,
      })
      .then((res) => {
        console.log("update profile = >", res.data);
        showSuccess(res.data.message);
      })
      .catch((err) => {
        showError(err.res.data.message);
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

    bodyFormData.append("image", selectedfile);

    axios({
      method: "put",
      url: "users/updateProfile",
      data: bodyFormData,
    })
      .then((res) => {
        console.log("Update Picture res", res.data.data.image);
        dispatch(setUserImage(res.data.data.image));
        showSuccess(res.data.message);
      })
      .catch((err) => {
        showError(err.res.data.message);
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
      <Grid
        container
        rowSpacing={2}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} sm={12} md={6} lg={6}>
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Date"
                inputFormat="mm/dd/yyyy"
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
              inputProps={{ maxLength: 10 }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              variant="outlined"
              fullWidth
              required
              error={error.phone}
            />
          </div>
        </Grid>
        {/* <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid> */}
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <div
            // className="mb-20"
            style={{
              marginLeft: "30rem",
              width: "50%",
              marginBottom: "7rem",
              borderRadius: "40%",
            }}
            //className="flex items-center justify-center absolute bottom-0 -mb-44"
          >
            <Avatar
              className={clsx(classes.avatar, "avatar w-80 h-80  box-content")}
              alt="user photo"
              src={fileshow ? fileshow : user.data.photoURL}
            />
            <div>
              <Link
                onClick={handleUploadBtnClick}
                style={{ marginLeft: "25%", textAlign: "center" }}
              >
                Edit
              </Link>

              <input
                type="file"
                id="file"
                ref={textInput}
                accept="image/png, 
               image/jpeg"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </Grid>
        <SubmitButton type="button" variant="contained" onClick={formSubmit}>
          Update Profile
        </SubmitButton>
      </Grid>
    </Box>
  );
};

export default Profile;
