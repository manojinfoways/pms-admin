import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { showError, showSuccess } from "app/utils/helpers";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";

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

const ChangePassword = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});

  useEffect(() => {
    dispatch(setToolbarHeader("Change Password"));
  }, []);

  const formClear = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const formSubmit = () => {
    setError({});

    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        axios
          .post("user/changePassword", {
            EmailId: user.data.email,
            currentPassword: currentPassword,
            newPassword: newPassword,
          })
          .then((res) => {
            showSuccess(res.data.message);
          })
          .catch((err) => {
            showError(err.response.data.message);
            // showError(err.message)
          });
        // axios.post('/auth/changepassword', {
        //         "EmailId": user.data.email,
        //         "oldPassword": oldPassword,
        //         "newPassword": newPassword
        // }).then(res => {
        //     if (res.data.message) {
        //         showSuccess(res.data.message)
        //         // formClear();
        //     } else {
        //         // showError(res.data.message)
        //     }

        // }).catch(err => {
        //     // showError(err.message)
        // })
      } else {
        showError("New Password & Confirm Password should be same");
      }
    } else {
      if (!currentPassword)
        setError((prev) => ({ ...prev, currentPassword: true }));
      if (!newPassword) setError((prev) => ({ ...prev, newPassword: true }));
      if (!confirmPassword)
        setError((prev) => ({ ...prev, confirmPassword: true }));
    }
  };

  return (
    <Box
      sx={{
        margin: "30px",
        width: "50%",
      }}
    >
      <div className="mb-20">
        <TextField
          id="Current Password"
          label="Current Password"
          classes={{ root: classes.customLabel }}
          type="password"
          name={"currentPassword"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={error.currentPassword}
        />
      </div>
      <div className="mb-20">
        <TextField
          id="New Password"
          label="New Password"
          classes={{ root: classes.customLabel }}
          type="password"
          name={"Password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={error.newPassword}
        />
      </div>
      <div className="mb-20">
        <TextField
          id="Confirm Password"
          label="Confirm Password"
          classes={{ root: classes.customLabel }}
          type="password"
          name={"confirm password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={error.confirmPassword}
        />
      </div>
      <SubmitButton type="button" variant="contained" onClick={formSubmit}>
        Change Password
      </SubmitButton>
    </Box>
  );
};

export default ChangePassword;
