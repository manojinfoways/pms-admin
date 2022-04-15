import { authRoles } from "app/auth";
import { lazy } from "react";

const ProfileConfig = {
  settings: {
    layout: {
      config: {
        footer: {
          display: false,
        },
      },
    },
  },
  //   auth: [
  //     ...authRoles.user,
  //     // ...authRoles.admin,
  //     // ...authRoles.researcher,
  //     // ...authRoles.poster,
  //   ],
  routes: [
    {
      path: "/admin/profile",
      exact: true,
      component: lazy(() => import("./Profile")),
    },
  ],
};

export default ProfileConfig;
