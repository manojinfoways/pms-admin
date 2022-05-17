import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Box, CircularProgress } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { Autocomplete, Button, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { showError, showSuccess } from "app/utils/helpers";
import history from "@history";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

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

const CreateProject = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [customer, setCustomer] = useState("");
  const [requestType, setRequestType] = useState("");
  const [error, setError] = useState({});
  const [add, setAdd] = useState({});
  const [remove, setRemove] = useState({});
  const [options, setOptions] = useState([]);
  const [masterUser, setMasterUser] = useState([]);
  const [inputData, setInputData] = useState("");
  const user = useSelector(({ auth }) => auth.user);
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [fileshow, setFileshow] = useState("");
  const [file, setFile] = useState(undefined);
  const textInput = useRef();
  const [userNames, setUserNames] = useState([]);
  const [id, setId] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const theme = useTheme();
  const [center, setCenter] = useState({
    lat: parseFloat(`${process.env.REACT_APP_GOOGLE_LAT}`),
    lng: parseFloat(`${process.env.REACT_APP_GOOGLE_LONG}`),
  });
  const classes = useStyles(props);
  const dispatch = useDispatch();

  useEffect(() => {
    getUsers();
  }, []);

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;

    let selectedItem = typeof value === "string" ? value.split(",") : value;
    console.log("selectedItem--", selectedItem);
    setUserIds(selectedItem);

    let selNames = users.filter((i) => {
      return selectedItem.includes(i._id);
    });

    if (selNames.length) {
      let namesonly = selNames.map((i) => {
        return i.firstname;
      });

      setUserNames(namesonly);
    }
    // console.log("NAmes of users", selNames);
  };

  useEffect(() => {
    if (props.match.params.id) {
      dispatch(setToolbarHeader("Update Project"));
    } else {
      dispatch(setToolbarHeader("Add Project"));
    }
    if (props.location.state && props.location.state.survey) {
      let stateData = props.location.state.survey;
      // console.log("123", stateData);
      setName(stateData.name);
      setStatus(stateData.status);
      setImage(stateData.image);
      setId(stateData._id);

      let myUname = stateData.assignUsers;
      let fnames = myUname.map((i) => {
        return i.firstname;
      });
      let uids = myUname.map((i) => {
        return i._id;
      });

      setUserIds(uids);
      setUserNames(fnames);

      let masterUser = stateData.assignUsers;
      let uId = masterUser.map((i) => {
        return i._id;
      });
      setMasterUser(uId);
      console.log("UId", uId);

      setCenter({
        lat: parseFloat(`${stateData.latitude}`),
        lng: parseFloat(`${stateData.longitude}`),
      });
    } else {
      if (props.match.params.id) {
        history.push("/admin/project/list");
      }
    }
  }, []);

  useEffect(() => {
    if (inputData && inputData.length > 2) {
      axios
        // .post(`/project/create`, {
        .post(`/properties/search`, {
          searchText: inputData,
        })
        .then((res) => setOptions(res.data.rows));
    }
  }, [inputData]);

  const handleUploadBtnClick = () => {
    textInput.current.click();
  };

  const handleImageChange = (event) => {
    setFileshow(URL.createObjectURL(event.target.files[0]));
    setFile("file", event.target.files[0]);

    // formSubmit(event.target.files[0]);
  };

  const formClear = () => {
    setNotes("");
    setCustomer("");
    setRequestType("");
    setInputData("");
    setName("");
    setStatus("");
    setImage("");
    setOptions([]);
    setError({});
  };
  const deleteSurvey = (projectId) => {
    if (isFormValid()) {
      setIsLoading(true);
      if (id) {
        axios
          .post(`/deleteproject/${_id} `, { projectId: projectId })
          .then((res) => {
            showSuccess(res.data.message);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error.res.data.message);
          });
      }
    }
  };

  const formSubmit = () => {
    if (true) {
      setIsLoading(true);
      if (id) {
        axios
          .put(`/editproject`, {
            projectId: id,
            name: name,
            status: status,
            image: image,
          })
          .then((res) => {
            showSuccess(res.data.message);

            formClear();
            setIsLoading(false);

            history.push("/admin/project/list");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error.stack + "=" + error.message);
          });
      } else {
        var bodyFormData = new FormData();

        bodyFormData.append("image", image);
        bodyFormData.append("name", name);
        bodyFormData.append("status", status);

        axios({
          method: "post",
          url: "/createproject",
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            showSuccess(res.data.message);
            formClear();
            setIsLoading(false);
            history.push("/admin/project/list");
          })
          .catch((error) => {
            setIsLoading(false);
            showError(error.response.data.message);
          });
      }
    }
  };

  const isFormValid = () => {
    setError({});
    let isValid = true;
    if (name) setError((prev) => ({ ...prev, name: false }));
    else {
      setError((prev) => ({
        ...prev,
        name: true,
        name_message: "Enter Survey name please",
      }));
      isValid = false;
    }

    if (!isValid) {
      showError("Validation Error");
    }
    console.log(name, "error==>", error);
    return isValid;
  };

  const getUsers = () => {
    setIsLoading(true);

    axios
      .get("/userlist")
      .then((res) => {
        const Users = res.data.data;
        setUsers(Users);

        const userIds = res.data.data;
        // setUserIds(userIds);

        setIsLoading(false);
        // console.log("UserList", res.data.data);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.response.data.message);
      });
  };

  // assign-user api

  // const newList = list.filter((item) => item.id !== id);

  // setList(newList);

  // let removeItem = (e) => {
  //   let firstname = e.target.getAttribute("firstname");
  //   setUserIds(userIds.filter((i) => i.firstname !== firstname));
  //   console.log("RU", firstname);
  //   console.log("RUS", removeItem);
  // };

  const removedUser = () => {
    let rusers = [];
    masterUser.map((item) => {
      let isexist = userIds.find((i) => {
        return i == item;
      });
      if (!isexist) {
        rusers.push(item);
      }
    });
    console.log("rusers", rusers);
    return rusers;
  };
  const assignUsers = () => {
    let removedUserId = removedUser();

    if (true) {
      setIsLoading(true);
      if (id) {
        axios
          .post("/assignproject", {
            projectId: id,
            user: "remove",
            userId: removedUserId,
          })
          .then((res) => {
            // showSuccess(res.data.message);
            setIsLoading(false);
            console.log("assignUser-", res.data.data);
          })
          .catch((error) => {
            setIsLoading(false);
            console.log("error-", error);
            // showError(error.response.data.message);
          });

        axios
          .post("/assignproject", {
            projectId: id,
            user: "add",
            userId: userIds,
          })
          .then((res) => {
            // showSuccess(res.data.message);
            setIsLoading(false);
            console.log("assignUser-", res.data.data);
          })
          .catch((error) => {
            setIsLoading(false);
            console.log("error-", error);
            // showError(error.response.data.message);
          });
      } else {
      }
    }
  };
  return (
    <Box style={{ padding: "20px" }}>
      <Grid
        container
        rowSpacing={2}
        className="m-20"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid
          style={{
            display: "flex",
            flexDirection: "row",
          }}
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
        >
          <TextField
            id="name"
            label="Name"
            classes={{ root: classes.customLabel }}
            type="text"
            name="Name"
            error={error.name}
            required
            inputProps={{ maxLength: 50 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder={error.name_message}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="status"
              error={error.status}
              onChange={handleChange}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>InActive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <FormControl
            style={{
              width: "100%",
            }}
          >
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>

            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={userIds}
              onChange={handleChange1}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(userIds) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {userNames.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {users.map((item, index) => (
                <MenuItem
                  key={`${index}`}
                  value={item._id}
                  style={getStyles(item._id, userNames, theme)}
                >
                  {item.firstname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div
            style={{
              marginLeft: "15rem",
              marginTop: "2rem",
            }}
          >
            <Avatar
              className={clsx(
                classes.avatar,
                "avatar w-72 h-72 p-8 box-content"
              )}
              style={{
                cursor: "pointer",
              }}
              alt="image photo"
              src={fileshow ? fileshow : image}
            />

            <div>
              <Link to="/" onClick={handleUploadBtnClick}>
                Upload image
              </Link>

              <input
                type="file"
                id="file_input_file"
                ref={textInput}
                accept="image/png, 
               image/jpeg"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid>
        <Grid
          container
          rowSpacing={2}
          className="m-20"
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={2}>
            <SubmitButton variant="contained" onClick={assignUsers}>
              Assign User
            </SubmitButton>
          </Grid>
          <Grid item xs={2}>
            {/* {id} */}
            {isLoading ? (
              <div className="flex justify-center mt-20">
                <CircularProgress size={30} />
              </div>
            ) : id ? (
              <SubmitButton variant="contained" onClick={formSubmit}>
                Update
              </SubmitButton>
            ) : (
              <SubmitButton variant="contained" onClick={formSubmit}>
                Submit
              </SubmitButton>
            )}
          </Grid>

          <Grid item xs={2}>
            {props.match.params.id ? (
              <SubmitButton variant="contained">
                <div
                  onClick={(ev) => {
                    deleteSurvey(id);
                    console.log("-d e l e t e-");
                  }}

                  // onClick={deleteSurvey} data-id={_id}
                >
                  Delete
                </div>
              </SubmitButton>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateProject;
