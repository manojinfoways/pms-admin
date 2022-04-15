import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useFormContext, Controller } from "react-hook-form";

import { Box, CircularProgress } from "@material-ui/core";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Stack from "@mui/material/Stack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";

import Grid from "@mui/material/Grid";
import { Autocomplete, Button, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { showError, showSuccess } from "app/utils/helpers";
import history from "@history";
import moment from "moment";
import DragMarker from "./DragMarker";

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

const CreateSurvey = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [customer, setCustomer] = useState("");
  const [requestType, setRequestType] = useState("");
  const [error, setError] = useState({});
  const [options, setOptions] = useState([]);
  const [inputData, setInputData] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState(true);
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
      dispatch(setToolbarHeader("Add Intake"));
    }
    if (props.location.state) {
      let stateData = props.location.state.survey;
      setSurveyName(stateData.name);
      setDescription(stateData.description);
      setStartDate(stateData.startDate);
      setEndDate(stateData.endDate);
      setStatus(stateData.status);
      setId(stateData.id);
      setCenter({
        lat: parseFloat(`${stateData.latitude}`),
        lng: parseFloat(`${stateData.longitude}`),
      });
    } else {
      if (props.match.params.id) {
        history.push("/admin/intake/list");
      }
    }
  }, []);

  useEffect(() => {
    if (inputData && inputData.length > 2) {
      axios
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
    setSurveyName("");

    setOptions([]);
    setError({});
  };

  const formSubmit = () => {
    if (isFormValid()) {
      setIsLoading(true);
      if (id) {
        axios
          .put(`survey/update/${id}`, {
            name: surveyName,
            description: description,
            latitude: center.lat,
            longitude: center.lng,
            startDate: startDate,
            endDate: endDate,
            status: status,
          })
          .then((res) => {
            showSuccess(res.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/intake/list");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error?.response?.data?.message);
          });
      } else {
        axios
          .post(`survey/create`, {
            name: surveyName,
            description: description,
            latitude: center.lat,
            longitude: center.lng,
            startDate: startDate,
            endDate: endDate,
            status: status,
          })
          .then((res) => {
            showSuccess(res.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/intake/list");
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
    if (surveyName) setError((prev) => ({ ...prev, surveyName: false }));
    else {
      setError((prev) => ({
        ...prev,
        surveyName: true,
        surveyName_message: "Enter Survey name please",
      }));
      isValid = false;
    }

    if (description) setError((prev) => ({ ...prev, description: false }));
    else {
      setError((prev) => ({ ...prev, description: true }));
      isValid = false;
    }

    if (startDate) setError((prev) => ({ ...prev, startDate: false }));
    else {
      setError((prev) => ({ ...prev, startDate: true }));
      isValid = false;
    }

    if (endDate) setError((prev) => ({ ...prev, endDate: false }));
    else {
      setError((prev) => ({ ...prev, endDate: true }));
      isValid = false;
    }

    // if (inputData) setError((prev) => ({ ...prev, option: false }));
    // else {
    //   setError((prev) => ({ ...prev, options: true }));
    //   isValid = false;
    // }
    // if (requestType) setError((prev) => ({ ...prev, requestType: false }));
    // else {
    //   setError((prev) => ({ ...prev, requestType: true }));
    //   isValid = false;
    // }
    // if (customer) setError((prev) => ({ ...prev, customer: false }));
    // else {
    //   setError((prev) => ({ ...prev, customer: true }));
    //   isValid = false;
    // }
    if (!isValid) {
      showError("Please check survey form validation");
    }
    console.log(surveyName, "error==>", error);
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
            id="surveyName"
            label="Name"
            classes={{ root: classes.customLabel }}
            type="text"
            name="surveyName"
            error={error.surveyName}
            required
            inputProps={{ maxLength: 50 }}
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.surveyName_message}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="Start Date*"
                inputFormat="MM/dd/yyyy"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e);
                  setEndDate(e);
                }}
                required
                error={error.startDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>

        <Grid item xs={6} sm={6} md={3} lg={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                label="End Date*"
                inputFormat="MM/dd/yyyy"
                value={endDate}
                minDate={new Date(startDate)}
                maxDate={new Date("2023-06-01")}
                onChange={(e) => {
                  setEndDate(e);
                }}
                required
                error={error.endDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} lg={12}>
          <TextField
            id="description"
            label="Short Description "
            classes={{ root: classes.customLabel }}
            type="text"
            name="description"
            error={error.description}
            required
            multiline
            rows={5}
            inputProps={{ maxLength: 25 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          {JSON.stringify(center)}
          {center != undefined ? (
            <DragMarker
              handleUpdatCenter={handleUpdatCenter}
              render={true}
              center={center}
            />
          ) : null}
        </Grid>
        {/* <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="outlined-number"
            label="Minimum Age"
            type="number"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid> */}
        {/* <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="outlined-number"
            label="Maximum Age"
            type="number"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid> */}

        {/* <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            id="outlined-number"
            label="Max first User to Enroll"
            type="number"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid> */}
      </Grid>
      <Grid
        container
        rowSpacing={1}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="start"
                className="ml-0"
                control={
                  <Switch
                    color="primary"
                    checked={status}
                    onChange={(e) => {
                      setStatus(e.target.checked);
                    }}
                  />
                }
                label="Is Actove"
                labelPlacement="start"
              />
            </FormGroup>
          </FormControl>
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

export default CreateSurvey;
