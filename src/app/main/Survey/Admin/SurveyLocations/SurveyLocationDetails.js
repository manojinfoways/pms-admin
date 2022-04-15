import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {useHistory, useLocation} from 'react-router-dom';
import {Box} from '@material-ui/core';
import classes from './SurveyLocationDetails.module.css';
import {Typography} from '@mui/material';
import Question from '../../../../shared-components/question/Question';
import Loading from '../../../../shared-components/loading/Loading';
import {setToolbarHeader} from 'app/store/fuse/toolbarHeaderSlice';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
const SurveyLocationDetails = (props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [locations, setLocations] = useState(
    location.state
      ? location.state.locations
        ? location.state.locations.length > 0
          ? JSON.parse(location.state.locations)
          : []
        : []
      : [],
  );

  const [activeLocation, setActiveLocation] = useState(null);

  console.log('location ', location);

  // const [locations, setLocations] = useState(
  //   props.match.params.locations
  //     ? location.state.locations.length > 0
  //       ? JSON.parse(location.state.locations)
  //       : []
  //     : [],
  // );

  // let locations = [];

  // try {
  //   location.state
  //     ? location.state.locations.length > 0
  //       ? JSON.parse(location.state.locations)
  //       : []
  //     : [];
  // } catch (error) {
  //   console.log('Errors ', error);
  // }

  let params = useParams();
  useEffect(() => {
    dispatch(setToolbarHeader('Intake Details'));
  }, []);

  const [selected, setSelected] = useState(
    params.survey_location_id ? parseInt(params.survey_location_id) : -1,
  );

  // console.log(
  //   'locations ',

  //   location
  //     ? location.state
  //       ? location.state.locations
  //         ? location.state.locations
  //         : ''
  //       : ''
  //     : '',
  // );

  useEffect(() => {
    loadQuestionResponses();
  }, [selected]);

  const loadQuestionResponses = () => {
    setIsLoading(true);

    axios
      .get(`/surveylocation/find/${selected}`)

      .then((response) => {
        setIsLoading(false);

        // console.log('Survey Response', response.data.questions);
        let response1 = response.data.question_responses;
        // response1 = response1.filter((que) => que.order > 0);

        response1 = response1.map((res) => {
          let question = {...res.question};
          question.answer = res.answer;
          return {...res, question};
        });
        setQuestions(response1);

        setActiveLocation(response.data);

        console.log('Questions ', response1);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const handleChange = (choice) => {
    console.log('Selected ', choice.id);
    setSelected(choice.id);
  };
  //+ location.state.survey_location.id
  return (
    <Box style={{padding: '20px', backgroundColor: 'white'}}>
      {/* <h4>{params.survey_location_id}</h4> */}
      <div
        style={{marginBottom: '1rem'}}
        onClick={() => {
          console.log('Back clicked');
          history.goBack();
        }}>
        <KeyboardBackspaceIcon fontSize="large" />
        {' Go back to Map'}
      </div>
      {isLoading && questions.length === 0 && (
        <div className={classes.nodata}>
          <Loading />
        </div>
      )}

      <div>
        <div className={classes.tagcontainer}>
          {locations.map((choice) => {
            return (
              <div key={choice.id}>
                <div
                  className={
                    classes.container1 +
                    (choice.id === selected ? ' ' + classes.selected : '')
                  }
                  onClick={() => handleChange(choice)}>
                  {choice.name ? choice.name : 'Name N/A'}
                </div>
              </div>
            );
          })}
        </div>
        {activeLocation && (
          <div>
            <Typography variant="h4">{activeLocation.title}</Typography>
            <Typography variant="h6" color="textSecondary">
              {activeLocation.status}
            </Typography>
            <br />
          </div>
        )}
        {!isLoading && questions.length === 0 && (
          <div className={classes.nodata}>
            <Typography style={{fontSize: '14px'}}>
              No responses found
            </Typography>
          </div>
        )}
        {questions.map((response) => {
          return (
            <div key={response.id}>
              <Question data={response.question} key={response.id} disabled />
              <hr />
              <br />
            </div>
          );
        })}
        {activeLocation &&
          activeLocation.signature &&
          activeLocation.signature !== null &&
          activeLocation.signature.length > 0 && (
            <div style={{marginTop: '1rem'}}>
              <img
                src={
                  'https://survey.mgtechx.com/api/uploads/' +
                  activeLocation.signature
                }
                width={'70%'}
                alt="signature image"
              />
            </div>
          )}
      </div>
    </Box>
  );
};

export default SurveyLocationDetails;
