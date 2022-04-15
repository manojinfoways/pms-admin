import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress, Tooltip, Typography } from "@material-ui/core";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import { openDialog, closeDialog } from "app/store/fuse/dialogSlice";
import { useHistory } from "react-router-dom";

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
    name: "name",
    label: "Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "budgetShare",
    label: "Budget Share",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "duration",
    label: "Duration",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "position",
    label: "Position",
    options: {
      filter: true,
      sort: true,
    },
  },

  {
    name: "status",
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

const StagesList = () => {
  const state = useSelector(({ fuse }) => fuse.dialog.state);

  const [adminPtrListing, setAdminPtrListing] = useState([]);
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
    dispatch(setToolbarHeader("Stages List"));
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get("/stage/list")
      .then((response) => {
        console.log("STAGES LIST", response.data.data);

        setAdminPtrListing(
          response.data.data.map((row) => [
            <div className={classes.actionContainer}>
              <Tooltip title={"Edit Survey"}>
                <Icon
                  className="cursor-pointer"
                  onClick={() => {
                    history.push({
                      pathname: "/admin/stages/update/" + row._id,
                      state: { survey: row },
                    });
                  }}
                >
                  edit {row.id}
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
                                    deleteSurvey(row.id);
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
            row.name,
            row.budgetShare,
            row.duration,
            row.position,
            row.status,
          ])
        );

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.response.data.message);
      });
  };
  const deleteSurvey = (id) => {
    setIsLoading(true);

    axios
      .delete(`/survey/delete/${id}`)
      .then((response) => {
        showSuccess(response.data.message);
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
            Stages Listing
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

export default StagesList;
