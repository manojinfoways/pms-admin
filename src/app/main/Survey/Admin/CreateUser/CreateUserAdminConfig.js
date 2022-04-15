import { authRoles } from "app/auth";
import { lazy } from "react";

const CreateUserAdmin = {
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
      path: "/admin/users/create",
      component: lazy(() => import("./CreateUserAdmin")),
    },
    {
      path: "/admin/users/update/:id",
      component: lazy(() => import("./CreateUserAdmin")),
    },
    {
      path: "/admin/users/list",
      component: lazy(() => import("./UserList")),
    },
  ],
};
export default CreateUserAdmin;
