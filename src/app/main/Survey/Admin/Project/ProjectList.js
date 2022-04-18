import * as React from "react";
import "./Projectmodule.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { showError, showSuccess } from "app/utils/helpers";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { setToolbarHeader } from "app/store/fuse/toolbarHeaderSlice";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//   customLabel: {
//     "& label": {
//       fontSize: "12px",
//     },
//   },
// }));
const ProjectList = () => {
  // const classes = useStyles();
  const state = useSelector(({ fuse }) => fuse.dialog.state);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const [project, setProject] = useState([]);

  useEffect(() => {
    dispatch(setToolbarHeader("Project List"));
    fetchData();
  }, []);
  //API

  const fetchData = () => {
    setIsLoading(true);

    axios
      .get("/projectlist")
      .then((res) => {
        const project = res.data.data;
        setProject(project);
        console.log("Project List", project);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(error.message);
      });
  };

  const deleteSurvey = (projectId) => {
    if (isFormValid()) {
      setIsLoading(true);
      if (id) {
        axios
          .post(`/deleteproject `, { projectId: projectId })
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
  return (
    <div
      style={{
        padding: "3.2rem",
      }}
    >
      <Grid container spacing={2}>
        {project.map((data) => (
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                display: "flex",
                // height: "100%",
                // marginBottom: "1rem",
              }}
            >
              {data.image ? (
                <CardMedia
                  component="img"
                  sx={{ width: 90, height: 90, objectFit: "cover" }}
                  image={data.image}
                  alt="Live from space album contain"
                />
              ) : (
                <CardMedia
                  component="img"
                  sx={{ width: 90, height: 90, objectFit: "cover" }}
                  style={{ padding: "0.9rem" }}
                  image="https://cdn.searchenginejournal.com/wp-content/uploads/2019/08/c573bf41-6a7c-4927-845c-4ca0260aad6b-760x400.jpeg"
                  alt="Live from space album cover"
                />
              )}

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <div
                  // className="data_name"
                  style={{
                    marginTop: "0.4rem",
                    color: "black",
                    fontSize: "1.7rem",
                    marginLeft: "0.6rem",
                  }}
                  onClick={() => {
                    history.push({
                      pathname: "/admin/project/update/" + data._id,

                      state: { survey: data },
                    });
                  }}
                >
                  {data.name}
                </div>

                <span
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    // width: "100%",
                    // height: "100%",
                    // flexDirection: "row",
                    // overflow: "hidden",
                  }}
                >
                  {data.assignUsers.map((datas) => (
                    <Tooltip title={datas.firstname}>
                      <Avatar
                        style={{
                          width: "2.8rem",
                          height: "2.8rem",
                          marginLeft: "0.2rem",
                          cursor: "pointer",
                          color: " black",
                          backgroundColor: "whitesmoke",
                          marginBottom: "0.5rem",
                        }}
                        alt="user photo"
                        src={datas.url}
                      />
                    </Tooltip>
                  ))}
                </span>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProjectList;
