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

const ProjectList = () => {
  const state = useSelector(({ fuse }) => fuse.dialog.state);
  const role = useSelector(({ auth }) => auth.user.role);
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
    // <div
    //   style={{
    //     padding: "3.2rem",
    //   }}
    // >
    <Grid
      container
      spacing={2}
      style={{
        padding: "3.2rem",
      }}
    >
      {!project.length?<h1 style={{textAlign:"center",width:"100%"}}>
        Sorry, no records found
      </h1>:null}
      {project.map((data) => (
        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              display: "flex",
            }}
          >
            {data.image ? (
              <CardMedia
                component="img"
                className="img3"
                sx={{ width: "100px", height: "100px", objectFit: "cover" }}
                image={data.image}
                alt="Live from space album contain"
              />
            ) : (
              <CardMedia
                component="img"
                className="img3"
                sx={{ width: "100px", height: "100px", objectFit: "cover" }}
                style={{ padding: "0.9rem" }}
                image="https://cdn.searchenginejournal.com/wp-content/uploads/2019/08/c573bf41-6a7c-4927-845c-4ca0260aad6b-760x400.jpeg"
                alt="Live from space album cover"
              />
            )}

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  marginTop: "0.4rem",
                  color: "black",
                  fontSize: "1.7rem",
                  marginLeft: "0.6rem",
                }}
                onClick={() => {
                  role == "admin"
                    ? history.push({
                        pathname: "/admin/project/update/" + data._id,
                        state: { survey: data },
                      })
                    : null;
                }}
              >
                {data.name}
              </div>

              <div
                style={{
                  padding: "2px",
                }}
              >
                <span
                  style={{
                    marginTop: "1.5rem",
                    overflowX: "auto",
                  }}
                  className="user_wrap"
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
                          float: "left",
                        }}
                        alt="user photo"
                        src={datas.url}
                      />
                    </Tooltip>
                  ))}
                </span>
              </div>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
    // </div>
  );
};

export default ProjectList;
