import { authRoles } from "app/auth";
import { lazy } from "react";

const CreateStagesAdmin = {
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
      path: "/admin/stages/create",
      component: lazy(() => import("./CreateStagesAdmin")),
    },
    {
      path: "/admin/stages/update/:id",
      component: lazy(() => import("./CreateStagesAdmin")),
    },
    {
      path: "/admin/stages/list",
      component: lazy(() => import("./StagesList")),
    },
  ],
};

export default CreateStagesAdmin;
