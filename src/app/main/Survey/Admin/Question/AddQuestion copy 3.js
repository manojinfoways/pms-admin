import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
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
import {fetchQuestionList} from 'app/main/Survey/Admin/store/surveySlice'
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
  const questionsList = useSelector(({survey}) => survey.questions);
  const questionTypes = useSelector(({survey}) => survey.questionTypes);

  const [isLoading, setIsLoading] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [open, setOpen] = useState(true);
  const [error, setError] = useState({});
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [option, setOption] = useState("");
  const [status, setStatus] = useState(true);
  const [ skip, setSkip ] = useState(false);
  const [ order, setOrder ] = useState(questionsList.questions?questionsList.questions.length+1:1);
  
  const [isOptionAvalilable, setIsOptionAvalilable] = useState(false);

  const [questionId, setQuestionId] = useState("");
  const [surveyId, setSurveyId] = useState(props.surveyId);
  const [questionType, setQuestionType] = useState("");
 
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
    if (props.currentData) {
      let stateData = props.currentData;
      setQuestion(stateData.title);
      setQuestionType(stateData.questionTypeId);
      setStatus(stateData.status);
      setSurveyId(stateData.surveyId)
      setOrder(stateData.order)
      setSkip(stateData.skip);
      setQuestionId(stateData.id);
      setOptions(stateData.question_choices);
      if (stateData.question_choices.length) {
        setIsOptionAvalilable(true);
      }
      
      
       
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
        let payload = {
          "title": question,
          "order": order,
          "skip": skip,
          "status": status,
          "surveyId": surveyId,
          "questionTypeId": questionType,
          "choices":options
        }

        axios
          .put(`/question/update/${questionId}`, payload)
          .then((res) => {
            showSuccess(res.data.message);
            dispatch(fetchQuestionList(surveyId));
            setIsLoading(false);
           })
          .catch((error) => {
            setIsLoading(false);
            showError(error?.response?.data?.message);
          });
      } else {
        
        let payload = {
          "title": question,
          "order": order,
          "skip": skip,
          "status": status,
          "surveyId": surveyId,
          "questionTypeId": questionType,
          "choices":options
        }
        console.log("payload", payload);
        axios
          .post(`/question/create`, payload)
          .then((res) => {
            showSuccess(res.data.message);
            formClear();
            dispatch(fetchQuestionList(surveyId));
            setIsLoading(false);
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
        question_message: "Enter Question",
      }));
      isValid = false;
    }
    if (questionType) setError((prev) => ({ ...prev, questionType: false }));
    else {
      setError((prev) => ({
        ...prev,
        questionType: true,
        questionType_message: "Enter Question",
      }));
      isValid = false;
    }

    
    if (options.length) {
      let haserror = false;
      options.forEach(element => {
        if (!haserror) {
          if (element.title) {
            setError((prev) => ({ ...prev, options: false }));
          } else {
            setError((prev) => ({
              ...prev,
              options: true,
              option_message: "Enter Question option please",
            }));
            haserror = true;
          }
        }
        isValid = !haserror;
      });
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
      setOptions([{
        "title": "",
        "image": "",
        "min_value": 0,
        "max_value": 0,
        "order":1,
        "status": true
      }]);
      setIsOptionAvalilable(true);
      return true;
    }
  };

  return (
    
    
        
         
    <Box style={ { padding: "20px", width: "100%" } }>
      <Grid
        container
        rowSpacing={2}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 }>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Question type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={ questionType }
              required
            error={error.questionType}

              label="Question type"
              onChange={(event) => {
                setQuestionType(event.target.value);
                optionAvalilable(event.target.value);
              }}
            >
              { questionTypes && questionTypes.map((item,index) => {
                return <MenuItem key={index} value={ item.id }>{ item.title}</MenuItem>
              })}
              
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
                label="Is Active"
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
          ? options && options.map((val, index) => {
              return (
                <>
                  <Grid key={index} item xs={10} sm={10} md={8} lg={8}>
                    <TextField
                      id="options"
                      label={`Option ${index+1}`}
                      classes={{ root: classes.customLabel }}
                      type="text"
                      name="options"
                      error={val.title==""?error.options:false}
                      required
                      inputProps={{ maxLength: 50 }}
                      value={val.title}
                      onChange={ (e) => {
                        let newdata = [ ...options ];
                        let temp_element = { ...newdata[index] };
                        temp_element.title = e.target.value;
                        newdata[index] = temp_element;

                           
                         setOptions(newdata);
                      }}
                      variant="outlined"
                      fullWidth
                      placeholder={error.question_message}
                    />
                  </Grid>
                  <Grid key={index} item xs={2} sm={2} md={2} lg={2}>
                    <TextField
                      id="order"
                      label={`Order ${index+1}`}
                      classes={{ root: classes.customLabel }}
                      type="text"
                      name="order"
                      error={val.order==""?error.order:false}
                      required
                      inputProps={{ maxLength: 50 }}
                      value={val.order}
                      onChange={ (e) => {
                        let newdata = [ ...options ];
                        let temp_element = { ...newdata[index] };
                        temp_element.order = e.target.value;
                        newdata[index] = temp_element;
                         setOptions(newdata);
                      }}
                      variant="outlined"
                      fullWidth
                      placeholder={error.question_message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} lg={2}>
                    { index != options.length - 1 ? (
                      <IconButton aria-label="delete" size="large"
                         onClick={ () => {
                        let newdata = [ ...options ];
                        newdata.splice(index, 1);
                           console.log("Remove",newdata);

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
                        newdata.push({
                          "title": "",
                          "image": "",
                          "min_value": 0,
                          "order":1,
                          "max_value": 0,
                          "status": true
                        });
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
      <Grid container
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item lg={ 4 }>
        <TextField
            id="order"
            label="Order No"
            classes={{ root: classes.customLabel }}
            type="number"
            name="order"
            error={error.question}
            required
            inputProps={{ maxLength: 50 }}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.order}
          />
        </Grid>

        <Grid item lg={8}>
          {isLoading ? (
            <div className="flex justify-center" className="mt-0">
              <CircularProgress size={30} />
            </div>
          ) : questionId ? (
            <SubmitButton  variant="contained" style={{margin:"0"}} onClick={formSubmit}>
              Update Question
            </SubmitButton>
          ) : (
            <SubmitButton variant="contained" style={{margin:"0"}} onClick={formSubmit}>
              Submit Question
            </SubmitButton>
          )}
        </Grid>
      </Grid>
          </Box>
         
   );
};

export default AddQuestions;
