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
    name: "firstname",
    label: "First Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "lastname",
    label: "Last Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "email",
    label: "Email",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "phone",
    label: "Phone",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "role",
    label: "Role",
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

const UserList = () => {
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
    dispatch(setToolbarHeader("User List"));
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get("/userlist")

      .then((response) => {
        console.log("User List", response.data.data);
        setAdminPtrListing(
          response.data.data.map((row) => [
            <div className={classes.actionContainer}>
              <Tooltip title={"Edit Survey"}>
                <Icon
                  className="cursor-pointer"
                  onClick={() => {
                    history.push({
                      pathname: "/admin/users/update/" + row._id,
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
                >
                  delete
                </Icon>
              </Tooltip>
            </div>,
            row.firstname,
            row.lastname,
            row.email,
            row.phone,
            row.role,
          ])
        );

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.response?.data?.message);
      });
  };
  const deleteSurvey = (id) => {
    setIsLoading(true);

    axios
      .post(`/users/delete`, { id: id })
      .then((response) => {
        showSuccess(response.data.message);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.response.data.message);
      });
  };
  return (
    <div className="mx-20 my-20">
      <MUIDataTable
        title={
          <Typography variant="h6">
            List Listing
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

export default UserList;
