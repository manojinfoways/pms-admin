import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { darken } from "@material-ui/core/styles/colorManipulator";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import JWTLoginTab from "./tabs/JWTLoginTab";

const useStyles = makeStyles((theme) => ({
  root: {
    background: `linear-gradient(to right, ${
      theme.palette.primary.dark
    } 0%, ${darken(theme.palette.primary.dark, 0.1)} 100%)`,
    color: theme.palette.primary.contrastText,
  },
  leftSection: {},
  rightSection: {
    background: `linear-gradient(to right, ${
      theme.palette.primary.dark
    } 0%, ${darken(theme.palette.primary.dark, 0.1)} 100%)`,
    color: theme.palette.primary.contrastText,
  },
}));

function Login() {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const error = useSelector((state) => state);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24"
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-400 md:max-w-3xl rounded-20 shadow-2xl overflow-hidden"
      >
        <Card
          className={clsx(
            classes.leftSection,
            "flex flex-col w-full max-w-sm items-center justify-center shadow-0"
          )}
          square
        >
          <CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <div className="flex items-center mb-48">
                <img
                  className="logo-icon w-48"
                  src={`/assets/images/logos/homevue.svg`}
                  alt="logo"
                />
                <div className="border-l-1 mr-4 w-1 h-40" />
                <div>
                  <Typography
                    className="text-24 font-semibold logo-text"
                    color="inherit"
                  >
                    PMS
                  </Typography>
                  <Typography
                    className="text-16 tracking-widest -mt-8 font-ACustome"
                    color="textSecondary"
                  >
                    Application
                  </Typography>
                </div>
              </div>
            </motion.div>

            {/* <Tabs
							value={selectedTab}
							onChange={handleTabChange}
							variant="fullWidth"
							className="w-full mb-32"
						>
							<Tab
								icon={
									<img
										className="h-40 p-4 bg-black rounded-12"
										src="assets/images/logos/jwt.svg"
										alt="firebase"
									/>
								}
								className="min-w-0"
								label="JWT"
							/>
							<Tab
								icon={<img className="h-40" src="assets/images/logos/firebase.svg" alt="firebase" />}
								className="min-w-0"
								label="Firebase"
							/>
							<Tab
								icon={<img className="h-40" src="assets/images/logos/auth0.svg" alt="auth0" />}
								className="min-w-0"
								label="Auth0"
							/>
						</Tabs> */}

            <JWTLoginTab />
          </CardContent>

          <div className="flex flex-col items-center justify-center pb-20">
            {/* <div>
							<span className="font-normal mr-8">Don't have an account?</span>
							<Link className="font-normal" to="/register">
								Register
							</Link>
						</div>
						<Link className="font-normal mt-8" to="/">
							Back to Dashboard
						</Link> */}
          </div>
        </Card>

        <div
          className={clsx(
            classes.rightSection,
            "hidden md:flex flex-1 items-center justify-center p-64"
          )}
        >
          <div className="max-w-420">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
              <Typography
                variant="h3"
                color="inherit"
                className="font-semibold leading-tight"
              >
                Welcome to the <br /> PMS SYSTEM
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography variant="subtitle1" color="inherit" className="mt-32">
                Admin panel for manage survey and questions.
              </Typography>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
