import { Redirect } from "react-router-dom";
import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import Error404Page from "app/main/404/Error404Page";
import LoginConfig from "app/main/login/LoginConfig";

import CreateSurveyAdminConfig from "app/main/Survey/Admin/CreateSurvey/CreateSurveyAdminConfig";
import CreateProjectAdminConfig from "app/main/Survey/Admin/Project/CreateProjectAdminConfig";
import CreateUserAdminConfig from "app/main/Survey/Admin/CreateUser/CreateUserAdminConfig";
import CreateTaskReportAdminConfig from "app/main/Survey/Admin/CreateTaskReport/CreateTaskReportAdminConfig";

import MapAdminConfig from "app/main/Survey/Admin/Map/MapAdminConfig";
import QuestionConfig from "app/main/Survey/Admin/Question/QuestionConfig";

import CreateStagesAdminConfig from "app/main/Survey/Admin/Stages/CreateStagesAdminConfig";

import MainAdminDashboardConfig from "app/main/MainDashboard/Admin/MainAdminDashboardConfig";
import MainCustomerDashboardConfig from "app/main/MainDashboard/Customer/MainCustomerDashboardConfig";

import LogoutConfig from "app/main/Logout/LogoutConfig";
// import SilentRenewConfig from "app/auth/SilentRenewConfig";
import PTRAdminDashboardConfig from "app/main/Survey/Admin/PTRAdminDashboard/PTRAdminDashboardConfig";

import AnalyticsConfig from "app/main/MainDashboard/Analytics/AnalyticsConfig";
import MainDLMDashboardConfig from "app/main/MainDashboard/DLM/MainDLMDashboard/MainDLMDashboardConfig";
import ChangePasswordConfig from "app/main/ChangePassword/ChangePasswordConfig";
import ProfileConfig from "app/main/Profile/ProfileConfig";

const routeConfigs = [
  CreateSurveyAdminConfig,
  MapAdminConfig,
  QuestionConfig,

  CreateStagesAdminConfig,
  CreateProjectAdminConfig,
  CreateUserAdminConfig,
  CreateTaskReportAdminConfig,

  MainAdminDashboardConfig,
  MainCustomerDashboardConfig,
  LogoutConfig,
  // SilentRenewConfig,
  PTRAdminDashboardConfig,
  AnalyticsConfig,
  MainDLMDashboardConfig,
  ChangePasswordConfig,
  ProfileConfig,
  LoginConfig,
];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    path: "/loading",
    exact: true,
    component: () => <FuseLoading />,
  },
  {
    path: "/404",
    component: () => <Error404Page />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
