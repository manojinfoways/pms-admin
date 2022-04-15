import { authRoles } from "app/auth";
import { lazy } from "react";

const CreateTaskReportAdmin = {
  settings: {
    layout: {
      config: {
        footer: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: "/admin/taskreport/create",
      component: lazy(() => import("./CreateTaskReportAdmin")),
    },
    {
      path: "/admin/taskreport/update/:id",
      component: lazy(() => import("./CreateTaskReportAdmin")),
    },
    {
      path: "/admin/taskreport/list",
      component: lazy(() => import("./TaskReportList")),
    },
  ],
};

export default CreateTaskReportAdmin;
