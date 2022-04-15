import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress, Tooltip, Typography } from "@material-ui/core";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import { openDialog, closeDialog } from "app/store/fuse/dialogSlice";
import { useHistory } from "react-router-dom";
import AddQuestion from "./AddQuestion";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import MUIDataTable from "mui-datatables";
import { LocalPrintshop } from "@material-ui/icons";
import Icon from "@material-ui/core/Icon";
import DropDownList from "app/shared-components/DropDownList";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import PrintModal from "app/shared-components/PrintModal";
import { showError, showSuccess } from "app/utils/helpers";
import { fetchQuestionList, fetchQuestionTypes } from "../store/surveySlice";

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
    name: "Order id",
    label: "Order id",
    options: {
      filter: true,
      sort: true,
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
    name: "Status",
    label: "Status",
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

const QuestionsList = (props) => {
  const state = useSelector(({ fuse }) => fuse.dialog.state);
  const questionsList = useSelector(({ survey }) => survey.questions);
  const [adminDataListing, setAdminDataListing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [printDataModal, setPrintDataModal] = useState(false);
  const [isChatPopUpOpen, setIsChatPopUpOpen] = useState(false);
  const [chatRequestData, setChatRequestData] = useState({});
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const updatePropertyInclusion = async (propertyId, inclusionStatus) => {
    setIsLoading(true);
  };

  const openQuestion = (data) => {
    console.log("Edit", data);
    dispatch(
      openDialog({
        children: (
          <div component="container" style={{ width: "100%" }}>
            <AddQuestion currentData={data} />
          </div>
        ),
      })
    );
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

  const rendorTable = () => {
    try {
      let questionsArray = questionsList.questions;
      setAdminDataListing(
        questionsArray &&
          questionsArray.map((row) => [
            <div className={classes.actionContainer}>
              {/* <Tooltip title="View Question">
              <Icon
                className="cursor-pointer"
                onClick={ () => { history.push({ pathname: '/admin/intake/question/' + row.id ,state: {survey: row}})}}
              >
                visibility
              </Icon>
            </Tooltip> */}
              <Tooltip title={"Edit Question"}>
                <Icon
                  className="cursor-pointer"
                  // onClick={ () => openQuestion(row)}
                  onClick={() => {
                    history.push({
                      pathname:
                        "/admin/intake/question/edit/" +
                        props.surveyId +
                        "/" +
                        row.id,
                    });
                  }}
                >
                  edit
                </Icon>
              </Tooltip>
              <Tooltip title="Delete Question">
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
                                {"Are you sure to remove question?"}
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  For now this question deleted permanently.
                                  This can not be roleback once deleted.
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
                                    deleteQuestion(row.id);
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
                  // onClick={ (e) => deleteQuestion(row.id) }
                >
                  delete
                </Icon>
              </Tooltip>
            </div>,
            row.order,
            row.title,
            row.status ? "Active" : "Inactive",
          ])
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showError(error);
    }
  };
  useEffect(() => {
    let surveyId = props.surveyId;
    dispatch(fetchQuestionList(surveyId));
    dispatch(fetchQuestionTypes());
  }, []);
  useEffect(() => {
    console.log("List available", questionsList.questions);
    rendorTable();
  }, [questionsList]);

  const deleteQuestion = (id) => {
    setIsLoading(true);

    axios
      .delete(`/question/delete/${id}`)
      .then((response) => {
        showSuccess(response.data.message);
        dispatch(fetchQuestionList(props.surveyId));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.response?.message);
      });
  };
  return (
    <div className="mx-20 my-20">
      <MUIDataTable
        title={
          <Typography variant="h6">
            Questions Listing
            {isLoading && (
              <CircularProgress
                size={24}
                style={{ marginLeft: 15, position: "relative", top: 4 }}
              />
            )}
          </Typography>
        }
        data={adminDataListing}
        columns={columns}
        options={options}
      />

      {adminDataListing && (
        <PrintModal
          openModal={printDataModal}
          setOpenModal={setPrintDataModal}
          title="Question Report"
          subTitle="PMS SYSTEM"
          columns={columns.slice(1)}
          rows={adminDataListing.map((i) => i.slice(1))}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default QuestionsList;
