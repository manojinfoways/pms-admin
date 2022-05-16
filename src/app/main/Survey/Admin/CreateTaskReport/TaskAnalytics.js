import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highcharts from "highcharts";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import moment from "moment";
import { MenuItem } from "@mui/material";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { showError, showSuccess } from "app/utils/helpers";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

const useStyles = makeStyles({
  dark1Background: {
    backgroundColor: "rgba(200,200,200,0.5)",
  },
  dark2Background: {
    "&:hover": {
      backgroundColor: "rgba(200,200,200,1)",
    },
  },
  printTitle: {
    background: "#f00",
    padding: "4px 15px",
    position: "sticky",
    top: "0",
    left: "0",
    width: "100%",

    "& > h2": {
      fontSize: "20px",
      color: "#FFFFFF",
      fontWeight: "bold",
      marginBottom: "0",
    },
  },
});

const TaskAnalytics = () => {
  const state = useSelector(({ fuse }) => fuse.dialog.state);

  // ****
  const refContainer = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  //
  const [isLoading, setIsLoading] = useState(false);
  const [sumVal, setSumVal] = useState(0);
  const [chartDate, setChartDate] = useState([]);
  const [chartMin, setChartMin] = useState([]);
  const [dateValue, setDateValue] = useState([]);
  const [minValue, setMinValue] = useState([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(29, "days").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());
  const [project_id, setProject_id] = useState("");
  const [project, setProject] = useState([]);
  const [error, setError] = useState({});
  const [minutes, setMinutes] = useState("");
  const [respondedData, setRespondedData] = useState([]);
  const [hours, setHours] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const updatePropertyInclusion = async (propertyId, inclusionStatus) => {
    setIsLoading(true);
  };
  const handleChange = (event) => {
    setProject_id(event.target.value);
  };

  useEffect(() => {
    dispatch(setToolbarHeader(" Chart"));
  }, []);

  useEffect(() => {
    getProjectList();
  }, []);
  useEffect(() => {
    fetchData();
  }, [startDate, project_id]);
  useEffect(() => {
    getCount();
  }, [respondedData]);

  // ****

  useEffect(() => {
    const chart = Highcharts.chart(refContainer.current, {
      chart: {
        type: "column",
      },
      title: {
        text: "Task Analytics",
      },
      // subtitle: {
      //   text: "---------",
      // },
      xAxis: {
        title: {
          text: "Dates",
        },
        categories: dateValue, // the categories of the X Axis
        crosshair: true,
      },
      yAxis: {
        min: 0, // minimum value of the Y Axis
        title: {
          text: "hours",
        }, // the title of the Y Axis
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      // tooltip appears when hovering over a point
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Hours",
          data: minValue,
        },
      ], // set of the data
    });
  }, [minValue]);

  const getCount = () => {
    let sum = 0;

    if (respondedData) {
      respondedData.map((item) => {
        sum = sum + parseInt(item.minutes);
      });
    }

    let hr = Math.floor(sum / 60);
    setHours(hr);
    let mn = sum % 60;
    setMinutes(mn);

    setSumVal(sum);
  };
  const handleCancel = (event, picker) => {
    picker.element.val("");
  };

  const handleCallback = (start, end, label) => {
    console.log("ORg", moment());
    console.log("start===>", start, "End date", end);
    let sd = moment(start).format("YYYY-MM-DD");
    let ed = moment(end).format("YYYY-MM-DD");

    console.log("mystart===>", sd, "End date", ed);

    setStartDate(sd);
    setEndDate(ed);

    console.log("new start", sd, "End date", ed);
  };
  const fetchData = () => {
    setIsLoading(true);

    axios
      .post("/taskreport/filterdata", {
        startdate: startDate,
        enddate: endDate,
        projectId: project_id,
      })
      .then((response) => {
        let resdata = response.data.data ? response.data.data : response.data;
        setRespondedData(resdata);

        let tm = [];
        {
          resdata.map((row) => {
            tm.push(parseFloat(row.minutes));
          });
        }
        setChartMin(tm);

        let dt = [];
        resdata.map((row) => {
          dt.push(moment(row.date).format("DD-MM-YYYY"));
        });
        setChartDate(dt);

        // ----------------- //

        let uniquedates = [];
        let uniquemin = [];

        dt.map((row, index) => {
          let isExist = uniquedates.find((i) => {
            return i == row;
          });
          if (isExist == undefined) {
            uniquedates.push(row);
          }
        });
        uniquedates.map((el) => {
          let temp = dt
            .map((item, ind) => {
              return item == el ? tm[ind] : 0;
            })
            .reduce((a, b) => a + b, 0);
          uniquemin.push(parseInt(temp / 60));
        });
        setDateValue(uniquedates);
        setMinValue(uniquemin);
        console.log("uniquedates=>", uniquedates, "uniquemin=>", uniquemin);
        setIsLoading(false);
      })

      .catch((error) => {
        setIsLoading(false);
        setChartMin([]);
        setChartDate([]);
        setHours("");
        setMinutes("");
        setSumVal("");

        showError(error.response.data.message);
      });
  };
  const deleteSurvey = (taskreportId) => {
    setIsLoading(true);

    axios
      .post(`/taskreport/delete`, { taskreportId: taskreportId })
      .then((response) => {
        showSuccess(response.data.message);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.response.message);
      });
  };

  const getProjectList = () => {
    setIsLoading(true);

    axios
      .get("/projectlist")
      .then((res) => {
        const project = res.data.data;
        setProject(project);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.message);
      });
  };
  return (
    <div className="mx-20 my-20">
      <Grid container spacing={2}>
        <Grid item xs={3}>
          {/* {startDate}
          {endDate} */}
          <div
            style={{
              marginBottom: "15px",
              width: "59%",
              fontSize: "1.8rem",
              marginLeft: "6px",
              marginTop: "7px",
              borderRadius: "4px ",
            }}
          >
            <DateRangePicker
              initialSettings={{
                startDate: startDate,
                endDate: endDate,

                locale: {
                  cancelLabel: "Clear",
                  format: "YYYY-MM-DD",
                },
                ranges: {
                  Today: [moment().toDate(), moment().toDate()],
                  Yesterday: [
                    moment().subtract(1, "days").toDate(),
                    moment().subtract(1, "days").toDate(),
                  ],
                  "Last 7 Days": [
                    moment().subtract(6, "days").toDate(),
                    moment().toDate(),
                  ],
                  "Last 30 Days": [
                    moment().subtract(29, "days").toDate(),
                    moment().toDate(),
                  ],
                  "This Month": [
                    moment().startOf("month").toDate(),
                    moment().endOf("month").toDate(),
                  ],
                  "Last Month": [
                    moment().subtract(1, "month").startOf("month").toDate(),
                    moment().subtract(1, "month").endOf("month").toDate(),
                  ],
                },
              }}
              onCancel={handleCancel}
              // onEvent={this.handleEvent}
              onCallback={(start, end) => handleCallback(start, end)}
            >
              <input className="form-control" />
            </DateRangePicker>
          </div>
        </Grid>
        <Grid item xs={1}></Grid>

        <Grid item xs={4}>
          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Project List
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={project_id}
                label="project_id"
                error={error.project_id}
                onChange={handleChange}
              >
                <MenuItem value="">All Project</MenuItem>
                {project.map((data) => (
                  <MenuItem value={data._id}>{data.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <div
            style={{
              // color: "#7a1313f5",
              fontSize: "1.8rem",
              marginBottom: "15px",
            }}
          >
            {hours && minutes ? (
              <div
                style={{
                  backgroundColor: "white",
                  // marginLeft: "2px",
                }}
              >
                {hours}:{minutes}
              </div>
            ) : null}
          </div>
        </Grid>
      </Grid>

      <div className="App">
        <div ref={refContainer} data={chartMin} />
      </div>
    </div>
  );
};

export default TaskAnalytics;
