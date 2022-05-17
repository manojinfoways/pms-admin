import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, CircularProgress } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { Autocomplete, Button, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { showError, showSuccess } from "app/utils/helpers";
import history from "@history";
import moment from "moment";
// import "react-datepicker/dist/react-datepicker.css";
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
  customOption: {
    fontSize: "12px !important",
  },
}));

const CreateUser = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [customer, setCustomer] = useState("");
  const [requestType, setRequestType] = useState("");
  const [error, setError] = useState({});
  const [options, setOptions] = useState([]);
  const [inputData, setInputData] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState(moment());
  // const [dob, setDob] = useState(new Date("2014-08-18T21:11:54"));
  const [doj, setDoj] = useState(moment());
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [isError, setIsError] = useState(false);
  const [center, setCenter] = useState({
    lat: parseFloat(`${process.env.REACT_APP_GOOGLE_LAT}`),
    lng: parseFloat(`${process.env.REACT_APP_GOOGLE_LONG}`),
  });
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const handleChange1 = (event) => {
    setStatus(event.target.value);
  };
  useEffect(() => {
    if (props.match.params.id) {
      dispatch(setToolbarHeader("Update User"));
    } else {
      dispatch(setToolbarHeader("Add User"));
    }
    if (props.location.state && props.location.state.survey) {
      let stateData = props.location.state.survey;
      setFirstname(stateData.firstname);
      setLastname(stateData.lastname);
      setStatus(stateData.status);
      setEmail(stateData.email);
      setPhone(stateData.phone);
      setPassword(stateData.password);
      setDob(stateData.dob);
      // setDob(stateData.dob ? moment(stateData.dob).format("YYYY-MM-DD") : "");
      setDoj(stateData.doj);
      setRole(stateData.role);
      setId(stateData._id);
      setCenter({
        lat: parseFloat(`${stateData.latitude}`),
        lng: parseFloat(`${stateData.longitude}`),
      });
    } else {
      if (props.match.params.id) {
        history.push("/admin/users/list");
      }
    }
  }, []);

  useEffect(() => {
    if (inputData && inputData.length > 2) {
      axios
        // .post(`/project/create`, {
        .post(`/properties/search`, {
          searchText: inputData,
        })
        .then((response) => setOptions(response.data.rows));
    }
  }, [inputData]);

  const formClear = () => {
    setNotes("");
    setCustomer("");
    setRequestType("");
    setInputData("");
    setOptions([]);
    setError({});

    setFirstname("");
    setLastname("");
    setEmail("");
    setPhone("");
    setPassword("");
    setDob("");
    setDoj("");
    setStatus("");
    setRole("");
  };

  const formSubmit = () => {
    if (isFormValid()) {
      setIsLoading(true);
      if (id) {
        axios
          .put(`/users/edit`, {
            firstname: firstname,
            userId: id,
            lastname: lastname,
            email: email,
            phone: phone,
            dob: dob,
            doj: doj,
            role: role,
            status: status,
          })
          .then((response) => {
            showSuccess(response.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/users/list");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error?.response?.data?.message);
          });
      } else {
        axios
          .post(
            `/users/add`,
            //    headers: {
            // Authorization: user.token,
            //  },
            {
              firstname: firstname,
              lastname: lastname,
              email: email,
              phone: phone,
              password: password,
              dob: dob,
              doj: doj,
              role: role,
              status: status,
            }
          )
          .then((response) => {
            showSuccess(response.data.message);

            formClear();
            setIsLoading(false);
            history.push("/admin/users/list");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error?.response?.data?.message);
          });
      }
    }
  };

  const isFormValid = () => {
    setError({});
    let isValid = true;
    let errors = {};
    if (firstname) setError((prev) => ({ ...prev, firstname: false }));
    else {
      setError((prev) => ({
        ...prev,
        firstname: true,
        errors: "Only letters",
        firstname_message: "Enter Survey firstname please",
      }));
      isValid = false;
    }

    if (lastname) setError((prev) => ({ ...prev, lastname: false }));
    else {
      setError((prev) => ({
        ...prev,
        lastname: true,
        lastname_message: "Enter lastname please",
      }));
      isValid = false;
    }
    if (email) setError((prev) => ({ ...prev, email: false }));
    else {
      setError((prev) => ({
        ...prev,
        email: true,
        email_message: "Enter email please",
      }));
      isValid = false;
    }
    if (password) setError((prev) => ({ ...prev, password: false }));
    else {
      setError((prev) => ({
        ...prev,
        password: true,
        password_message: "Enter password please",
      }));
      isValid = false;
    }
    if (role) setError((prev) => ({ ...prev, role: false }));
    else {
      setError((prev) => ({
        ...prev,
        role: true,
        role_message: "Enter role please",
      }));
      isValid = false;
    }

    if (status) setError((prev) => ({ ...prev, status: false }));
    else {
      setError((prev) => ({
        ...prev,
        status: true,
        status_message: "Enter status please",
      }));
      isValid = false;
    }

    if (dob) setError((prev) => ({ ...prev, dob: false }));
    else {
      setError((prev) => ({
        ...prev,
        dob: true,
        dob_message: "Enter dob please",
      }));
      isValid = false;
    }
    if (phone) setError((prev) => ({ ...prev, phone: false }));
    else {
      setError((prev) => ({
        ...prev,
        phone: true,
        errors: "Only number",
        //errors: "*Please enter your mobile no.",

        phone_message: "Enter phone please",
      }));

      if (phone !== "undefined") {
        if (phone.match(/^[0-9]{10}$/)) {
          isFormValid = false;
          errors = "*Please enter valid mobile no.";
        }
      }

      isValid = false;
    }

    if (!isValid) {
      showError("Validation Error");
    }
    console.log(name, "error==>", error);
    return isValid;
  };

  return (
    <Box style={{ padding: "20px" }}>
      <Grid
        container
        rowSpacing={2}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="firstname"
            label="First Name"
            classes={{ root: classes.customLabel }}
            type="text"
            name="Name"
            error={error.firstname}
            required
            inputProps={{ maxLength: 50 }}
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.firstname_message}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="lastname"
            label="Last Name"
            classes={{ root: classes.customLabel }}
            type="text"
            name="lastname"
            error={error.lastname}
            required
            inputProps={{ maxLength: 50 }}
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.lastname}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="email"
            label="Email"
            classes={{ root: classes.customLabel }}
            type="text"
            name="email"
            error={error.email}
            required
            inputProps={{ maxLength: 50 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.email}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="phone"
            label="Phone"
            classes={{ root: classes.customLabel }}
            type="number"
            name="phone"
            error={error.phone}
            required
            inputProps={{ maxLength: 10 }}
            value={phone}
            // onChange={(e) => setPhone(e.target.value)}
            onChange={(e) => {
              setPhone(e.target.value);
              if (e.target.value.length > 10) {
                setIsError(true);
              }
            }}
            variant="outlined"
            fullWidth
            placeholder={error.phone}
          />
        </Grid>
        {!props.match.params.id ? (
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              id="password"
              label="Password"
              classes={{ root: classes.customLabel }}
              type="text"
              name="password"
              error={error.password}
              required
              //inputProps={{ maxLength: 6 }}
              inputProps={{ minLength: 6 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              placeholder={error.password}
            />
          </Grid>
        ) : null}
        <Grid item xs={6} sm={6} md={3} lg={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              error={error.status}
              onChange={handleChange1}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>InActive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              label="Role"
              error={error.role}
              onChange={handleChange}
            >
              {/* <MenuItem value={developer}>developer</MenuItem>
              <MenuItem value={admin}>admin</MenuItem> */}
              <MenuItem value="developer">developer</MenuItem>
              <MenuItem value="admin">admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="DOB"
              inputFormat="dd/MM/yyyy"
              value={dob}
              onChange={(date) => setDob(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>{" "}
        <Grid item xs={6} sm={6} md={3} lg={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="DOJ"
              inputFormat="dd/MM/yyyy"
              value={doj}
              onChange={(date) => setDoj(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>{" "}
      </Grid>

      <Grid>
        <Grid item xs={6}></Grid>

        <Grid item xs={6}>
          {isLoading ? (
            <div className="flex justify-center mt-20">
              <CircularProgress size={30} />
            </div>
          ) : id ? (
            <SubmitButton variant="contained" onClick={formSubmit}>
              Update
            </SubmitButton>
          ) : (
            <SubmitButton variant="contained" onClick={formSubmit}>
              Submit
            </SubmitButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateUser;
