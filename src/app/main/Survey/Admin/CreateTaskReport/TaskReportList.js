import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress, Tooltip, Typography } from "@material-ui/core";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import { openDialog, closeDialog } from "app/store/fuse/dialogSlice";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import { format } from "date-fns";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { MenuItem } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { LocalPrintshop } from "@material-ui/icons";
import Icon from "@material-ui/core/Icon";
import DropDownList from "app/shared-components/DropDownList";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import PrintModal from "app/shared-components/PrintModal";
import { showError, showSuccess } from "app/utils/helpers";
import { MoreTime } from "@mui/icons-material";

import DateRangePicker from "react-bootstrap-daterangepicker";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css"; // theme css file
import "bootstrap-daterangepicker/daterangepicker.css";
import { times } from "lodash";

const columns = [
  {
    name: "Actions",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      download: false,
      print: false,
      setCellProps: () => ({ style: { minWidth: "120px" } }),
    },
  },
  {
    name: "title",
    label: "Title",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "description",
    label: "Description",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "minutes",
    label: "Minutes",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "date",
    label: "Date",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "updatedat",
    label: "Updatedat",
    options: {
      filter: true,
      sort: true,
    },
  },
];

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

const TaskReportList = () => {
  const state = useSelector(({ fuse }) => fuse.dialog.state);

  const [adminPtrListing, setAdminPtrListing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [printDataModal, setPrintDataModal] = useState(false);
  const [sumVal, setSumVal] = useState(0);
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

  const options = useMemo(
    () => ({
      filter: true,
      filterType: "multiselect",
      tableBodyMaxHeight: "calc(100vh - 230px)",
      rowsPerPage: 100,
      tableBodyHeight: "calc(100vh - 230px)",
      fixedHeader: true,
      print: false,
      customToolbar: () => (
        <Tooltip title="Print">
          <LocalPrintshop
            className="text-gray-600 cursor-pointer hover:text-black"
            onClick={() => setPrintDataModal(true)}
          />
        </Tooltip>
      ),
      draggableColumns: {
        enabled: true,
        transitionTime: 300,
      },
      selectableRows: "none",
      downloadOptions: {
        filename: "CNMI-Listing.csv",
        separator: ",",
      },
      setRowProps: (row, dataIndex, rowIndex) => {
        const properties = { class: classes.dark2Background };
        if (rowIndex % 2 === 0) {
          properties["class"] = clsx(
            properties["class"],
            classes.dark1Background
          );
        }
        return properties;
      },
    }),
    [classes]
  );

  useEffect(() => {
    dispatch(setToolbarHeader("Task Report List"));
    // setStartDate(moment().format("DD-MM-YYYY"));
    // setEndDate("2022-04-05");
    // setEndDate(moment().format("DD-MM-YYYY"));

    // setStartDate(moment().startOf("month").format("YYYY-MM-DD").toDate());
    // setEndDate(moment().endOf("month").format("YYYY-MM-DD").toDate());
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
        setAdminPtrListing(
          resdata.map((row) => [
            <div className={classes.actionContainer}>
              <Tooltip title={"Edit Survey"}>
                <Icon
                  className="cursor-pointer"
                  onClick={() => {
                    history.push({
                      pathname: "/admin/taskreport/update/" + row._id,
                      state: { survey: row },
                    });
                  }}
                >
                  edit
                </Icon>
              </Tooltip>
              <Tooltip title="Delete Survey">
                <Icon
                  className="cursor-pointer"
                  onClick={() =>
                    row.id !== 0 &&
                    dispatch(
                      openDialog({
                        children: (
                          <div>
                            <Dialog
                              fullScreen={false}
                              open={true}
                              aria-labelledby="responsive-dialog-title"
                            >
                              <DialogTitle id="responsive-dialog-title">
                                {"Are you sure to remove survey?"}
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  For now this survey deleted permanently. This
                                  can not be roleback once deleted.
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  autoFocus
                                  onClick={(ev) => dispatch(closeDialog())}
                                >
                                  Disagree
                                </Button>
                                <Button
                                  onClick={(ev) => {
                                    deleteSurvey(row._id);
                                    dispatch(closeDialog());
                                  }}
                                  autoFocus
                                >
                                  Agree
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </div>
                        ),
                      })
                    )
                  }
                  // onClick={ (e) => deleteSurvey(row.id) }
                >
                  delete
                </Icon>
              </Tooltip>
            </div>,
            // row.project_id,
            row.title,
            row.description,
            row.minutes,
            moment(row.date).format("DD-MM-YYYY"),
            moment(row.updatedat).format("DD-MM-YYYY"),
          ])
        );

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.response?.data?.message);
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
        showError(error.response?.message);
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
            <div
              style={{
                backgroundColor: "white",
                // marginLeft: "2px",
              }}
            >
              {hours} :{minutes}
            </div>
          </div>
        </Grid>
      </Grid>
      <MUIDataTable
        title={
          <Typography variant="h6">
            Task Report Listing
              {isLoading && (
                <CircularProgress
                  size={24}
                  style={{ marginLeft: 15, position: "relative", top: 4 }}
                />
              )}
          </Typography>
        }
        data={adminPtrListing}
        columns={columns}
        options={options}
      />

      {adminPtrListing && (
        <PrintModal
          openModal={printDataModal}
          setOpenModal={setPrintDataModal}
          title="Survey Report"
          subTitle="PMS SYSTEM"
          columns={columns.slice(1)}
          rows={adminPtrListing.map((i) => i.slice(1))}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default TaskReportList;
