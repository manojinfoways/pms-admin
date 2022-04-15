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

const CreateStages = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [customer, setCustomer] = useState("");
  const [requestType, setRequestType] = useState("");
  const [error, setError] = useState({});
  const [options, setOptions] = useState([]);
  const [inputData, setInputData] = useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [position, setPosition] = useState("");
  const [budgetShare, setBudgetShare] = useState("");

  const [id, setId] = useState("");

  const [center, setCenter] = useState({
    lat: parseFloat(`${process.env.REACT_APP_GOOGLE_LAT}`),
    lng: parseFloat(`${process.env.REACT_APP_GOOGLE_LONG}`),
  });
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const handleUpdatCenter = (center) => {
    setCenter({ lat: center.lat, lng: center.lng });
  };
  useEffect(() => {
    if (props.match.params.id) {
      dispatch(setToolbarHeader("Edit Intake"));
    } else {
      dispatch(setToolbarHeader("Update Intake"));
    }
    if (props.location.state && props.location.state.survey) {
      let stateData = props.location.state.survey;
      setName(stateData.name);
      setDuration(stateData.duration);
      setStatus(stateData.status);
      setPosition(stateData.position);
      setBudgetShare(stateData.budgetShare);
      setId(stateData.id);
      setCenter({
        lat: parseFloat(`${stateData.latitude}`),
        lng: parseFloat(`${stateData.longitude}`),
      });
    } else {
      if (props.match.params.id) {
        history.push("/admin/stages/list");
      }
    }
  }, []);

  useEffect(() => {
    if (inputData && inputData.length > 2) {
      axios
        // .post(`/stages/create`, {
        .post(`/properties/search`, {
          searchText: inputData,
        })
        .then((res) => setOptions(res.data.rows));
    }
  }, [inputData]);

  const formClear = () => {
    setNotes("");
    setCustomer("");
    setRequestType("");
    setInputData("");
    setName("");
    setStatus("");
    setDuration("");
    setPosition("");
    setBudgetShare("");

    setOptions([]);
    setError({});
  };

  const formSubmit = () => {
    if (isFormValid()) {
      setIsLoading(true);
      if (id) {
        axios
          .put(`stages/update/${id}`, {
            name: name,
            duration: duration,
            status: status,
            position: position,
            budgetShare: budgetShare,
          })
          .then((res) => {
            showSuccess(res.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/stages/list");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error?.response?.data?.message);
          });
      } else {
        axios
          .post(`stage/create`, {
            name: name,
            duration: duration,
            status: status,
            position: position,
            budgetShare: budgetShare,
          })
          .then((res) => {
            showSuccess(res.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/stages/list");
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
    if (name) setError((prev) => ({ ...prev, name: false }));
    else {
      setError((prev) => ({
        ...prev,
        name: true,
        name_message: "Enter Survey name please",
      }));
      isValid = false;
    }

    if (duration) setError((prev) => ({ ...prev, duration: false }));
    else {
      setError((prev) => ({
        ...prev,
        duration: true,
        duration_message: "Enter duration please",
      }));
      isValid = false;
    }
    if (position) setError((prev) => ({ ...prev, position: false }));
    else {
      setError((prev) => ({
        ...prev,
        position: true,
        position_message: "Enter position please",
      }));
      isValid = false;
    }

    if (budgetShare) setError((prev) => ({ ...prev, budgetShare: false }));
    else {
      setError((prev) => ({
        ...prev,
        budgetShare: true,
        budgetShare_message: "Enter budgetShare please",
      }));
      isValid = false;
    }
    if (!isValid) {
      showError("Please check survey form validation");
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
            id="name"
            label="Name"
            classes={{ root: classes.customLabel }}
            type="text"
            name="Name"
            error={error.name}
            required
            inputProps={{ maxLength: 50 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.name_message}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="Duration"
            label="Duration"
            classes={{ root: classes.customLabel }}
            type="number"
            name="Duration"
            error={error.Duration}
            required
            inputProps={{ maxLength: 50 }}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.Duration}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="status"
              error={error.status}
              onChange={handleChange}
            >
              <MenuItem value={"To do"}>To do</MenuItem>
              <MenuItem value={"In Progress"}>In Progress</MenuItem>
              <MenuItem value={"Done"}>Done</MenuItem>
              <MenuItem value={"Blocked"}>Blocked</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="Position"
            label="Position"
            classes={{ root: classes.customLabel }}
            type="number"
            name="Position"
            error={error.Position}
            required
            inputProps={{ maxLength: 50 }}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.Position}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="BudgetShare"
            label="BudgetShare"
            classes={{ root: classes.customLabel }}
            type="number"
            name="BudgetShare"
            error={error.BudgetShare}
            required
            inputProps={{ maxLength: 50 }}
            value={budgetShare}
            onChange={(e) => setBudgetShare(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.BudgetShare}
          />
        </Grid>
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

export default CreateStages;
