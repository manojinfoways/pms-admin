import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useFormContext, Controller } from "react-hook-form";
import { openDialog, closeDialog } from "app/store/fuse/dialogSlice";
import AddQuestion from './AddQuestion'
import QuestionsList from './QuestionsList'
import { Box, CircularProgress } from "@material-ui/core";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Stack from "@mui/material/Stack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
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


const CreateSurvey = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [surveyName, setSurveyName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState(true);
  const [surveyId, setSurveyId] = useState("");

  const [center, setCenter] = useState({
    lat: parseFloat(`${process.env.REACT_APP_GOOGLE_LAT}`),
    lng: parseFloat(`${process.env.REACT_APP_GOOGLE_LONG}`),
  });
  const classes = useStyles(props);
  
  const openQuestion= ()=>{
    dispatch(
      openDialog({
        children: (
          <div component="container" style={{'width':"100%"}}>
            <AddQuestion surveyId={ props.match.params.survey_id } />
          </div>)
      }))
  }
  const handleUpdatCenter = (center) => {
    setCenter({ lat: center.lat, lng: center.lng });
  };
  useEffect(() => {
    if (props.location.state && props.location.state.survey) {
      let stateData = props.location.state.survey;
      dispatch(setToolbarHeader(`${stateData.name}'s Details`));
      setSurveyName(stateData.name);
      setDescription(stateData.description);
      setStartDate(stateData.startDate);
      setEndDate(stateData.endDate);
      setStatus(stateData.status);
      setSurveyId(stateData.id);
      setCenter({
        lat: parseFloat(`${stateData.latitude}`),
        lng: parseFloat(`${stateData.longitude}`),
      });
    } else {
      if (props.match.params.survey_id) {
         history.push("/admin/intake/list");
      }
    }
  }, []);

  return (
    <div>
      <Box
        style={{ padding: "20px" }}
        component="div"
        sx={{ p: 1, m: 2, border: "1px dashed grey", backgroundColor: "#fff" }}
      >
        <Grid
          container
          rowSpacing={2}
          className="m-20"
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography
              variant="h6"
              gutterBottom
              component="span"
              className="mr-1"
            >
              Description:
            </Typography>
            <Typography variant="subtitle1" gutterBottom component="span">
              {description}
            </Typography>
            <br></br>
            <Typography
              variant="h6"
              gutterBottom
              component="span"
              className="mr-1"
            >
              Date:
            </Typography>
            <Typography variant="subtitle1" gutterBottom component="span">
              {moment(startDate).format("MM-DD-YYYY")} -{" "}
              {moment(endDate).format("MM-DD-YYYY")}
            </Typography>
            <br></br>

            <Typography variant="h6" gutterBottom component="span">
              Status:
            </Typography>
            <Typography variant="subtitle1" gutterBottom component="span">
              {status ? "Active" : "Inactive"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        style={{ padding: "20px" }}
        component="div"
        sx={{ p: 1, m: 2, border: "1px dashed grey", backgroundColor: "#fff" }}
      >
        <Grid
          container
          rowSpacing={2}
          className="m-20"
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} justify="space-between" >
            {/* <Button variant="outlined" onClick={openQuestion} align="right" startIcon={<AddIcon />}>
              Add Question
            </Button> */}
            <Button variant="outlined" onClick={ 
              () => { history.push({ pathname: '/admin/intake/question/add/'+ props.match.params.survey_id })}
              } align="right" startIcon={<AddIcon />}>
              Add Question
            </Button>
          </Grid>
          {/* history.push({ pathname: '/admin/intake/add-question/' + props.match.params.survey_id }) */}
        </Grid>
      </Box>
      <QuestionsList surveyId={props.match.params.survey_id} />
    </div>
  );
};

export default CreateSurvey;
