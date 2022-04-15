import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import GeoJSON from 'ol/format/GeoJSON';
import {Box} from '@material-ui/core';

import Grid from '@mui/material/Grid';
import {fromLonLat, get} from 'ol/proj';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';
import {Cluster as ClusterSource} from 'ol/source';
import classes from './MapAdmin.module.css';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { MenuItem } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';


import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {showError, showSuccess} from 'app/utils/helpers';
import {useHistory} from 'react-router-dom';

import {GISMap} from 'app/shared-components/map';
import {Layers, VectorLayer} from 'app/shared-components/map/layers';
import { vector } from 'app/shared-components/map/source';
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import { fetchChartData,fetchQuestionList,fetchSurveyList } from "../store/surveySlice";

const styleCache = {};
let styles = (feature) => {
  const size = feature.get('features').length;
  console.log("size",size);
  let style = styleCache[size];
  if (!style) {
    style = new Style({
      image: new CircleStyle({
        radius: size > 1 ? 15 : 8,
        stroke: new Stroke({
          color: '#000',
          width: size > 1 ? 5 : 1,
        }),
        fill: new Fill({
          color: '#3399CC',
        }),
      }),
      text: new Text({
        text: size > 1 ? size.toString() : '',
        font: '18px Calibri,sans-serif',
        fill: new Fill({
          color: '#fff',
        }),
      }),
    });
    styleCache[size] = style;
  }
  return style;
};

const CreateSurvey = (props) => {

  const surveyList = useSelector(({ survey }) => survey.surveyList);
  const questionsList = useSelector(({ survey }) =>
    survey.questions ? survey.questions.questions : []
  );

  const [surveyID, setSurveyID] = useState("0");
  const [questionID, setQuestionID] = useState([]);
  const [questionName, setQuestionName] = useState([]);
  const [surveryQuestions, setSurveryQuestions] = useState(questionsList);
  const [personName, setPersonName] = useState([]);
  const handleQuestionChange = async (event) => {

    setQuestionName([]);
    const {
      target: { value },
    } = event;
    let qIDs = typeof value === 'string' ? value.split(',') : value
    await setQuestionID(
      // On autofill we get a stringified value.
      qIDs
    );

    console.log("value",value); 
    if (qIDs.length) {
      let listarray =  await questionsList.filter((i) => {
        return	 qIDs.includes(i.id)
      });
      let qnames = listarray.map((i) => { return i.title });
      console.log("qnames",qnames);
      await setQuestionName(
        qnames
      );
      // getSurveys();
    } else {
      // getSurveys();
    }
    console.log("QuestionName",questionName);
    
  };

  const HandlerSetQuestion = (ev) => {
		setSurveyID(ev.target.value);
		dispatch(fetchQuestionList(ev.target.value)).then((question_data) => {
      filterQuestions();
      // getSurveys();
    });
    setQuestionName([]);
    setQuestionID([]);
}
  useEffect(() => {
    dispatch(fetchSurveyList()).then((data) => {
      console.log("Datall", data.payload.surveyListState[ 0 ][ 'id' ]);
      let firstSurveyId = data.payload.surveyListState[ 0 ][ 'id' ];
      setSurveyID(firstSurveyId);
      console.log("Survey id",firstSurveyId);
      dispatch(fetchQuestionList(firstSurveyId)).then((question_data) => {
        console.log("question_data", question_data);
        filterQuestions();
      });
    })
  }, []);	

  const filterQuestions = async () => {
    let checkinArray = [ 3, 4, 8, 10, 11 ].concat([1,2,5,6,7,9,12]);
	  console.log("questionsList",questionsList);
	  if (!questionsList) {
				// setQuestionID("0");
				return false;
	  }  
	  let qList = await questionsList.filter((i) => {
	 return	checkinArray.includes(i.questionTypeId)
	  })
	  setSurveryQuestions(qList);
	  let firstQuestion = qList.length > 0 ? qList[ 0 ][ 'id' ] : 0;
	  // setQuestionID(firstQuestion);
  }	
  useEffect(() => {
	    getSurveys()
	}, [ questionID ]);
	useEffect(() => {
		filterQuestions();
  }, [ questionsList ]);
  

  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState('');
  const [id, setId] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const [surveys, setSurveys] = useState({
    type: 'FeatureCollection',
    features: [],
  });

  const [surveysData, setSurveysData] = useState([]);

  useEffect(() => {
    dispatch(setToolbarHeader("Intake Map"));
    getSurveys();
  }, []);
  const getSurveys = () => {
    setIsLoading(true);
    let url = `surveylocation/allwithnames`
    if (questionID.length) {
       url = `surveylocation/allwithnames?questionIds=${questionID.join(",")}`
    }
    axios({
      method: 'get',
      url: url,
      headers: {
        'content-type': 'application/json',
      },
      // data: parameters,
    })
      .then((response) => {
        setIsLoading(false);
        let response1 = response.data.data;
        const geoJson = {
          type: 'FeatureCollection',
          features: response1.map((item) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [item.longitude, item.latitude],
            },
            properties: {
              id: item.id,
              surveyId: item.surveyId,
              longitude: item.longitude,
              latitude: item.latitude,
              name: Array.prototype.map
                .call(item.question_responses, function (item) {
                  return item.answer;
                })
                .join(' '),
            },
          })),
        };

        setSurveys(geoJson);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };
  const handleClick = (location, evt) => {
    const feature = evt.map.forEachFeatureAtPixel(
      evt.pixel,
      (feature, layer) => {
        const layerAttr = layer.getProperties();
        if (layerAttr.name == 'survey' && layerAttr.visible) {
          return feature;
        }
      },
    );
    if (feature != null && feature.get('features') != undefined) {
      const features = feature.get('features');
      const ids = features
        .map((f) => {
          return f.getProperties().id;
        })
        .join(',');

      const allData = features.map((f) => {
        return f.getProperties();
      });

      //alert(ids);

      console.log('Features ', allData);
      const id = ids.split(',')[0];

      if (id) {
        console.log('id ', id);
        console.log('history ', surveysData);
        history.push({
          pathname: '/admin/detail/location/' + id,
          state: {
            survey_location: {
              id: id,
            },
            locations: JSON.stringify(allData),
          },
        });
      }
    } else {
      //alert(feature.get('id'));

      const id = feature.get('id');

      if (id) {
        console.log('id ', surveysData.length);

        history.push({
          pathname: '/admin/detail/location/' + id,
          state: {
            survey_location: {
              id: id,
            },
            locations: surveysData,
          },
        });
      }
    }
  };

  return (
    <Box style={ { padding: '20px' } }>
       <Grid
        container
        rowSpacing={2}
        className="m-20 p-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} sm={12} md={4} lg={4}>
				  <FormControl fullWidth>
				   
            <InputLabel id="demo-simple-select-label2">Select Intake</InputLabel>
            <Select
              labelId="demo-simple-select-label2"
              id="demo-simple-select2"
              value={surveyID}
              onChange={(ev) => HandlerSetQuestion(ev)}
              required
              label="Select Intake"
					  >
					  <MenuItem key={`A${0}`} value={"0"}>
                    Select Intake
                    </MenuItem>
              {surveyList &&
                surveyList.map((item, index) => {
                  return (
                    <MenuItem key={`A${index}`} value={item.id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
            </Select>
			</FormControl>
          
        </Grid> 
        <Grid item xs={ 12 } sm={ 12 } md={ 6 } lg={ 6 }>
				  <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Question</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={ questionID }
              multiple
              InputLabelProps={{ shrink: true,readOnly: true }}
              onChange={(e)=>handleQuestionChange(e)}
              required
              input={<OutlinedInput label="Tag" />}
              // renderValue={ (selected) => selected.join(', ') }
              renderValue={() => {
                return questionName.length?questionName.join(","):""
              }}
    
              label="Question type"
            >
              
              {surveryQuestions &&
                surveryQuestions.map((item, index) => {
                  return (

                  <MenuItem key={`ho${index}`} name={item.name} value={item.id}>
                  <Checkbox checked={questionID.indexOf(item.id) > -1} />
                  <ListItemText primary= {item.title} />
                  </MenuItem>
                  );
                })}
              
						   
            
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={ 12 }>
        <GISMap
          center={[145.6739, 15.0979]}
          className={classes.mapContainer}
          zoom={11}
          enableDownload={false}
          onMapClick={handleClick}>
          <Layers>
            {/* <TileLayer source={osmsource} /> */}
            <VectorLayer
              properties={{name: 'survey'}}
              style={styles}
              source={
                new ClusterSource({
                  distance: 40,
                  minDistance: 10,
                  source: vector({
                    features: new GeoJSON().readFeatures(surveys, {
                      featureProjection: get('EPSG:3857'),
                    }),
                  }),
                })
              }
            />
          </Layers>
        </GISMap>
      </Grid>
    </Box>
  );
};

export default CreateSurvey;
