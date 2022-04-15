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
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Grid from "@mui/material/Grid";
import { Autocomplete, Button, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { showError, showSuccess } from "app/utils/helpers";
import history from "@history";
import moment from "moment";

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

const AddQuestions = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [open, setOpen] = useState(true);

  const [error, setError] = useState({});
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState(true);
  const [skip, setSkip] = useState(false);
  const [isOptionAvalilable, setIsOptionAvalilable] = useState(false);

  const [questionId, setQuestionId] = useState("");
  const [surveyId, setSurveyId] = useState(14);
  const [questionType, setQuestionType] = useState("");
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
    // if (props.match.params.id) {
    //   dispatch(setToolbarHeader("Edit Survey"));
    // } else {
    //   dispatch(setToolbarHeader("Create a New Survey"));
    // }
    if (props.location && props.location.state && props.location.state.survey) {
      let stateData = props.location.state.survey;
      setQuestion(stateData.name);
      setStatus(stateData.status);
      setId(stateData.id);
      setCenter({
        lat: parseFloat(`${stateData.latitude}`),
        lng: parseFloat(`${stateData.longitude}`),
      });
    } else {
    }
  }, []);

 

  const formClear = () => {
   
    setQuestion("");
    setSkip(false);
    setStatus(true);
     setOptions([]);
    setError({});
  };

  const formSubmit = () => {
    if (isFormValid()) {
      setIsLoading(true);
      if (questionId) {
        axios
          .put(`survey/update/${id}`, {
            name: question,
            latitude: center.lat,
            longitude: center.lng,
            status: status,
          })
          .then((res) => {
            showSuccess(res.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/survey/list");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error?.response?.data?.message);
          });
      } else {
        axios
          .post(`/question/create`, {
            "title": question,
            "order": 1,
            "skip": skip,
            "status": status,
            "surveyId": surveyId,
            "questionTypeId": questionType
          })
          .then((res) => {
            showSuccess(res.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/survey/list");
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
    if (question) setError((prev) => ({ ...prev, question: false }));
    else {
      setError((prev) => ({
        ...prev,
        question: true,
        question_message: "Enter Survey name please",
      }));
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
    console.log(question, "error==>", error);
    return isValid;
  };
  const optionAvalilable = (id) => {
    if ([1, 2, 6].includes(id)) {
      setOptions([]);
      setIsOptionAvalilable(false);
      return false;
    } else {
      setOptions([{ value: "" }]);
      setIsOptionAvalilable(true);
      return true;
    }
  };

  return (
    <Dialog
    fullWidth={fullWidth}
    maxWidth={maxWidth}
    open={open}
    onClose={()=>{}}
  >
    
    <DialogTitle>Add Question</DialogTitle>
    <DialogContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // m: 'auto',
          width: 'fit-content',
        }}
      >
       <Grid
         
        rowSpacing={2}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Question type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={questionType}
              label="Question type"
              onChange={(event) => {
                setQuestionType(event.target.value);
                optionAvalilable(event.target.value);
              }}
            >
              <MenuItem value={1}>TEXT INPUT</MenuItem>
              <MenuItem value={2}>DATE</MenuItem>
              <MenuItem value={3}>RADIO</MenuItem>
              <MenuItem value={4}>CHECKBOX</MenuItem>
              <MenuItem value={5}>RATING</MenuItem>
              <MenuItem value={6}>TEXT AREA</MenuItem>
              <MenuItem value={7}>AUTO COMPLETE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        container
        rowSpacing={2}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField
            id="question"
            label="Question"
            classes={{ root: classes.customLabel }}
            type="text"
            name="question"
            error={error.question}
            required
            inputProps={{ maxLength: 50 }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.question_message}
          />
        </Grid>
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
                    checked={skip}
                    onChange={(e) => {
                      setSkip(e.target.checked);
                    }}
                  />
                }
                label="Can user skip this question?"
                labelPlacement="start"
              />
            </FormGroup>
          </FormControl>
        </Grid>
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
      <Grid
        container
        rowSpacing={2}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
       
        {isOptionAvalilable
          ? options.map((val, index) => {
              return (
                <>
                  <Grid item xs={10} sm={10} md={9} lg={9}>
                    <TextField
                      id="question"
                      label={`Option ${index+1}`}
                      classes={{ root: classes.customLabel }}
                      type="text"
                      name="question"
                      error={error.question}
                      required
                      inputProps={{ maxLength: 50 }}
                      //  value={val.value}
                      onChange={ (e) => {
                        let newdata = [ ...options ];
                        newdata[ index ][ "value" ] = e.target.value
                        console.log("options",newdata);
                         setOptions(newdata);
                      }}
                      variant="outlined"
                      fullWidth
                      placeholder={error.question_message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} md={3} lg={3}>
                    { index != options.length - 1 ? (
                      <IconButton aria-label="delete" size="large"
                         onClick={ () => {
                        let newdata = [ ...options ];
                        newdata.splice(index,1);
                        setOptions(newdata);
                      }}
                      >
                       <RemoveIcon fontSize="inherit" />
                     </IconButton>
                    //   <Button
                    //   variant="outlined"
                    //   align="right"
                    //   size="large"
                    //   onClick={ () => {
                    //     let newdata = [ ...options ];
                    //     newdata.splice(index,1);
                    //     setOptions(newdata);
                    //   }}
                    //   startIcon={<RemoveIcon/>}
                    // ></Button>
                    ) : (
                      <IconButton aria-label="delete" size="large"
                      onClick={ () => {
                        let newdata = [ ...options ];
                        newdata.push({ value: "" });
                        setOptions(newdata);
                      } }>
                      <AddIcon fontSize="inherit" />
                      </IconButton>
                      // <Button
                      //   variant="outlined"
                      //     align="right"
                      //     size="large"
                      //     onClick={ () => {
                      //       let newdata = [ ...options ];
                      //       newdata.push({ value: "" });
                      //       setOptions(newdata);
                      //     }}
                      //   startIcon={<AddIcon />}
                      // ></Button>
                    )}
                  </Grid>
                </>
              );
            })
          : null}
      </Grid>
      <Grid>
        <Grid item lg={6}></Grid>

        <Grid item lg={2}>
          {isLoading ? (
            <div className="flex justify-center mt-20">
              <CircularProgress size={30} />
            </div>
          ) : questionId ? (
            <SubmitButton  variant="contained" onClick={formSubmit}>
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
    </DialogContent>
    <DialogActions>
      <Button onClick={()=>{}}>Close</Button>
    </DialogActions>
  </Dialog>
  );
};

export default AddQuestions;
