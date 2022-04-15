import Paper from "@material-ui/core/Paper";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Autocomplete, Button, MenuItem, TextField } from "@mui/material";
import Typography from "@material-ui/core/Typography";
import _ from "@lodash";
import { useEffect, memo, useState } from "react";
import { fetchChartData,fetchQuestionList,fetchSurveyList } from "../../Survey/Admin/store/surveySlice";

import ReactApexChart from "react-apexcharts";
import { filter } from "lodash";

function Chart(props) {
	const dispatch = useDispatch();
	

  const surveyList = useSelector(({ survey }) => survey.surveyList);
  const chartData = useSelector(({ survey }) => survey.chartData);
  const questionsList = useSelector(({ survey }) =>
    survey.questions ? survey.questions.questions : []
  );

  const [chartType, setChartType] = useState("pie");
  let [pieData, setPieData] = useState([{ options: [], series: [] }]);
  let [barData, setBarData] = useState([{ options: [], series: [] }]);
  let [splineData, setSplineData] = useState([{ options: [], series: [] }]);

  const [surveyID, setSurveyID] = useState();
  const [questionID, setQuestionID] = useState();
  const [surveryQuestions, setSurveryQuestions] = useState(questionsList);

  const [awaitRender, setAwaitRender] = useState(true);

  const widget = _.merge({}, props.widget);
  const theme = useTheme();

  _.setWith(
    widget,
    "mainChart.options.theme.monochrome.color",
    theme.palette.secondary.main
  );

  useEffect(() => {
	dispatch(fetchSurveyList()).then((data) => {
		console.log("Datall", data.payload.surveyListState[ 0 ][ 'id' ]);
		let firstSurveyId = data.payload.surveyListState[ 0 ][ 'id' ];
		setSurveyID(firstSurveyId);
		dispatch(fetchQuestionList(firstSurveyId)).then((question_data) => {
			console.log("question_data", question_data);
			filterQuestions();
		});
	})
}, []);	

  const filterQuestions = () => {
	  let checkinArray = [ 3, 4, 8, 10, 11 ];
	  console.log("questionsList",questionsList);
	  if (!questionsList) {
				return false;
	  }  
	  let qList = questionsList.filter((i) => {
	 return	checkinArray.includes(i.questionTypeId)
	  })
	  setSurveryQuestions(qList);
	  console.log("MCNT",qList.length);
  }	
	useEffect(() => {
		
    setAwaitRender(false);
  }, []);
	const splineChart = () => {
		let labels = chartData.map(function (el) { return el.title; });
		let response_count = chartData.map(function (el) { return parseFloat(el.response_count); });
		let response_percentage = chartData.map(function (el) { return parseFloat(el.response_percentage); });
		
		setSplineData({
          
            series: [{
              name: 'Posted Answer',
              data: response_count
            }],
            options: {
              chart: {
                height: 350,
                type: 'area'
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'smooth'
              },
              xaxis: {
                type: 'text',
                categories: labels
              },
              tooltip: {
                x: {
                  format: 'dd/MM/yy HH:mm'
                },
              },
            },
          })
	}
	const barChart = () => {
		let labels = chartData.map(function (el) { return el.title; });
		let response_count = chartData.map(function (el) { return parseFloat(el.response_count); });
		let response_percentage = chartData.map(function (el) { return parseFloat(el.response_percentage); });
		
	 setBarData({
		 series: [ {
			 data: response_count
		 } ],
		 options: {
			 chart: {
				 type: 'bar',
				 height: 350
			 },
			 plotOptions: {
				 bar: {
					 borderRadius: 4,
					 horizontal: true,
				 }
			 },
			 dataLabels: {
				 enabled: false
			 },
			 xaxis: {
				 categories: labels,
			 }
		 },
	 });
  }	
  function pieChart() {

	// title(pin):"Yes"
	// choice_id(pin):38
	// choice_order(pin):1
	// response_count(pin):"9"
	// response_percentage(pin):"90.00"
	//   totalresponse(pin): "10"
	  if (!surveryQuestions) {
		  return false;
	  }  
	  
	let labels = chartData.map(function (el) { return el.title; });
	let response_count = chartData.map(function (el) { return parseFloat(el.response_count); });


    setPieData({
      series: response_count,
      options: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
  }

	useEffect(() => {
		if (questionID) {
			dispatch(fetchChartData(questionID)).then(() => {
				renderChart();
			}).catch(() => {
				renderChart();
			});
		}
	}, [ questionID ]);
	useEffect(() => {
		filterQuestions();
	}, [ questionsList ]);
	
	useEffect(() => {
		renderChart();
	}, [ chartData ]);
	// useEffect(() => {
	// 	renderChart();
	// }, [ chartType ]);
	const renderChart = () => {
		if (chartType=='pie') {
			pieChart();
		} else if (chartType == 'spline') {
			// splineChart();
		} else if (chartType=='bar') {
			barChart();
		}
	}
// 	useEffect(() => {
// 		filterQuestions();
// 		pieChart();
//   }, [questionsList]);
  
	const HandlerSetQuestion = (ev) => {
		setSurveyID(ev.target.value);
		dispatch(fetchQuestionList(ev.target.value)).then((question_data) => {
		  filterQuestions();
	  });
}
	if (awaitRender) {
    return null;
  }
	

  return (
    <Paper className="w-full rounded-20 shadow">
      <Grid
        container
        rowSpacing={2}
        className="m-20 p-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} sm={12} md={2} lg={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Chart</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chartType}
              onChange={(ev) => {
                setChartType(ev.target.value);
              }}
              required
              label="Chart Type"
            >
              <MenuItem key={`c1`} value="pie">
                Pie
              </MenuItem>
              <MenuItem key={`c2`} value="bar">
                Bar
			  </MenuItem>
			  <MenuItem key={`c3`} value="spline">
                Spline
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
				  <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Survey</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={surveyList?surveyID:null}
              onChange={(ev) => HandlerSetQuestion(ev)}
              required
              label="Select Survey"
					  >
					  <MenuItem key={`A${0}`} value={null}>
                    Select Survey
                    </MenuItem>
              {surveyList &&
                surveyList.map((item, index) => {
                  return (
                    <MenuItem key={`Ax${index}`} value={item.id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
				  <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Question</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={questionID}
              onChange={(ev) => {
                setQuestionID(ev.target.value);
              }}
              required
              // error={error.questionType}
              label="Question type"
            >
              {surveryQuestions &&
                surveryQuestions.map((item, index) => {
                  return (
                    <MenuItem key={`B${index}`} value={item.id}>
                      {item.title}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
		  <div className="h-450 w-full">
			  { pieData.options && chartType=='pie' ?
				   <ReactApexChart
				   options={pieData.options}
				   series={pieData.series}
				   type="pie"
				   width="100%"
				   height={400}
				 />
			  :null
			  }
			 { pieData.options && chartType=='bar' ?
				   <ReactApexChart
				   options={barData.options}
				   series={barData.series}
				   type="bar"
				   width="100%"
				   height={400}
				 />
			  :null
			  }
			   { pieData.options && chartType=='spline' ?
				   <ReactApexChart
				   options={splineData.options}
				   series={splineData.series}
				   type="area"
				   width="100%"
				   height={400}
				 />
			  :null
			  }
      </div>
    </Paper>
  );
}

export default memo(Chart);
