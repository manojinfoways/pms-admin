import { authRoles } from "app/auth";
import { lazy } from "react";

const CreateProjectAdmin = {
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
      path: "/admin/project/create",
      component: lazy(() => import("./CreateProjectAdmin")),
    },
    {
      path: "/admin/project/update/:id",
      component: lazy(() => import("./CreateProjectAdmin")),
    },

    {
      path: "/admin/project/list",
      component: lazy(() => import("./ProjectList")),
    },
  ],
};

export default CreateProjectAdmin;
