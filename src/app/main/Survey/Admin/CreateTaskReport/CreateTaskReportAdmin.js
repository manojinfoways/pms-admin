import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, CircularProgress } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { Button, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { showError, showSuccess } from "app/utils/helpers";
import history from "@history";
// import moment from "moment";
import moment from "moment";
// import "react-datepicker/dist/react-datepicker.css";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextareaAutosize } from "@mui/material";

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

const CreateTaskReportAdmin = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [customer, setCustomer] = useState("");
  const [requestType, setRequestType] = useState("");
  const [error, setError] = useState({});
  const [options, setOptions] = useState([]);
  const [inputData, setInputData] = useState("");
  const [id, setId] = useState("");
  const [project_id, setProject_id] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minutes, setMinutes] = useState("");
  const [hours, setHours] = useState("");
  const [minutess, setMinutess] = useState("");
  const [date, setDate] = useState(moment().format("DD/MM/yyyy"));
  const [createdat, setCreatedat] = useState(moment());
  const [updatedat, setUpdatedat] = useState(moment());
  const [project, setProject] = useState([]);

  useEffect(() => {
    getProject();
  }, []);
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setProject_id(event.target.value);
  };

  useEffect(() => {
    if (props.match.params.id) {
      dispatch(setToolbarHeader("Update Intake"));
    } else {
      dispatch(setToolbarHeader("Add Task Report"));
    }
    if (props.location.state && props.location.state.survey) {
      let stateData = props.location.state.survey;
      setProject_id(stateData.project_id);
      setTitle(stateData.title);
      // setStatus(stateData.status);
      setDescription(stateData.description);
      let hr = Math.floor(stateData.minutes / 60);
      setHours(hr);
      let mn = stateData.minutes - hr * 60;
      setMinutes(mn);
      setDate(moment(stateData.date).format("DD/MM/YYYY"));
      setCreatedat(stateData.createdat);
      setUpdatedat(stateData.updatedat);
      // setRole(stateData.role);
      setId(stateData._id);
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
        .then((res) => setOptions(res.data.rows));
    }
  }, [inputData]);

  const formClear = () => {
    setNotes("");
    setCustomer("");
    setRequestType("");
    setInputData("");
    setOptions([]);
    setError({});
    setHours("");
    setProject_id("");
    setTitle("");
    Dsetdescription("");
    setMinutes("");
    setDate("");
    setCreatedat("");
    setupdatedat("");
    // setStatus("");
    // setRole("");
  };

  const formSubmit = () => {
    if (isFormValid()) {
      setIsLoading(true);
      if (id) {
        axios
          .put(`/taskreport/edit`, {
            // project_id: project_id,
            // userId: id,
            // title: title,
            // description: description,
            // minutes: minutes,
            // date: date,
            // createdat: createdat,
            // updatedat: updatedat,

            taskreportId: id,
            title: title,
            description: description,
            minutes: minutes + hours * 60,
            date: date,
            createdat: createdat,
            updatedat: updatedat,
          })
          .then((response) => {
            showSuccess(response.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/taskreport/list");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error?.response?.data?.message);
          });
      } else {
        axios
          .post(
            `/taskreport/add`,
            //    headers: {
            // Authorization: user.token,
            //  },
            {
              project_id: project_id,
              title: title,
              description: description,
              minutes: minutes + hours * 60,
              date: moment(date, "DD/MM/YYYY").format("YYYY-MM-DD"),
              createdat: createdat,
              updatedat: updatedat,
              // status: status,
            }
          )
          .then((response) => {
            showSuccess(response.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/taskreport/create");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error?.response?.data?.message);
            console.log(error);
          });
      }
    }
  };

  const isFormValid = () => {
    setError({});
    let isValid = true;
    let errors = {};

    if (title) setError((prev) => ({ ...prev, title: false }));
    else {
      setError((prev) => ({
        ...prev,
        title: true,
        title_message: "Enter title please",
      }));
      isValid = false;
    }
    if (description) setError((prev) => ({ ...prev, description: false }));
    else {
      setError((prev) => ({
        ...prev,
        description: true,
        description_message: "Enter description please",
      }));
      isValid = false;
    }
    if (date) setError((prev) => ({ ...prev, date: false }));
    else {
      setError((prev) => ({
        ...prev,
        date: true,
        date_message: "Enter date please",
      }));
      isValid = false;
    }

    if (minutes) setError((prev) => ({ ...prev, minutes: false }));
    else {
      setError((prev) => ({
        ...prev,
        minutes: true,
        errors: "Only number",
        //errors: "*Please enter your mobile no.",

        minutes_message: "Enter minutes please",
      }));

      isValid = false;
    }

    if (!isValid) {
      showError("Please check survey form validation");
    }
    console.log(name, "error==>", error);
    return isValid;
  };

  const getProject = () => {
    setIsLoading(true);

    axios
      .get("/projectlist")
      .then((response) => {
        const project = response.data.data;
        setProject(project);
        setIsLoading(false);
        //console.log("Taskreport List ", response.data.data);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.response.data.message);
      });
  };

  return (
    <Box style={{ padding: "20px" }}>
      <Grid
        container
        rowSpacing={2}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {id ? null : (
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Project_id</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={project_id}
                label="project_id"
                error={error.project_id}
                onChange={handleChange}
              >
                {project.map((data) => (
                  <MenuItem value={data._id}>{data.name}</MenuItem>
                  //<MenuItem value={project_id}>{project_id}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={6}>
          <TextField
            id="title"
            label="title"
            classes={{ root: classes.customLabel }}
            type="text"
            name="title"
            error={error.title}
            required
            inputProps={{ maxLength: 50 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.title}
          />
        </Grid>
        <Grid item xs={12}>
          <TextareaAutosize
            style={{ width: " 90rem", height: "11rem" }}
            placeholder="Empty"
            id="description"
            label="Description"
            classes={{ root: classes.customLabel }}
            type="textarea"
            multiline={true}
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            variant="outlined"
            error={error.description}
            placeholder={error.description_message}
          />
        </Grid>

        <Grid item lg={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Hours</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={hours}
              id="hours"
              label="hours"
              error={error.hours}
              onChange={(e) => setHours(e.target.value)}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Minutes</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={minutes}
              id="minutes"
              label="minutes"
              error={error.minutes}
              onChange={(e) => setMinutes(e.target.value)}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={35}>35</MenuItem>
              <MenuItem value={40}>40</MenuItem>
              <MenuItem value={45}>45</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={55}>55</MenuItem>
              <MenuItem value={60}>60</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item lg={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="date"
              inputFormat="dd/MM/yyyy"
              value={date}
              onChange={(dob) => {
                setDate(dob);
                console.log("dob", dob);
              }}
              renderInput={(params) => (
                <TextField
                  value={date}
                  {...params}
                  inputProps={{
                    ...params.inputsProps,
                    placeholder: "dd/mm/aaaa",
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Grid>
        <Grid item xs={6}></Grid>
        {/* {id} */}
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

export default CreateTaskReportAdmin;
