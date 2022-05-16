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

  //auth: [...authRoles.user, ...authRoles.admin],
  // auth: authRoles.admin,
  routes: [
    {
      auth: [...authRoles.admin],
      path: "/admin/project/create",
      component: lazy(() => import("./CreateProjectAdmin")),
    },
    {
      auth: [...authRoles.admin],
      path: "/admin/project/update/:id",
      component: lazy(() => import("./CreateProjectAdmin")),
    },

    {
      auth: [...authRoles.user, ...authRoles.admin],
      path: "/admin/project/list",
      component: lazy(() => import("./ProjectList")),
    },
  ],
};

export default CreateProjectAdmin;
