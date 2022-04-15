import i18next from "i18next";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";
import { authRoles } from "app/auth";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

const navigationConfig = [
  // {
  //   id: "Dashboard",
  //   title: "Dashboard",
  //   translate: "Dashboard",
  //   type: "collapse",
  //   auth: [...authRoles.admin],
  //   icon: "dashboard",
  //   url: "/admin/analytics",
  //   children: [
  //     {
  //       id: "Analytics",
  //       title: "Analytics",
  //       translate: "Analytics",
  //       auth: [...authRoles.admin],
  //       type: "item",
  //       url: "/admin/analytics",
  //     },
  //   ],
  // },
  // {
  //   id: "Intake Management",
  //   title: "Intake Management",
  //   translate: "Intake Management",
  //   type: "collapse",
  //   auth: [...authRoles.admin],
  //   icon: "description",
  //   children: [
  //     {
  //       id: "Intake List",
  //       title: "Intake List",
  //       translate: "Intake List",
  //       auth: [...authRoles.admin],
  //       type: "item",
  //       url: "/admin/intake/list",
  //     },
  //     {
  //       id: "Create Intake",
  //       title: "Create Intake",
  //       translate: "Create Intake",
  //       auth: [...authRoles.admin],
  //       type: "item",
  //       url: "/admin/intake/create",
  //     },
  //     {
  //       id: "Map",
  //       title: "Map",
  //       translate: "Map",
  //       auth: [...authRoles.admin],
  //       type: "item",
  //       url: "/admin/map",
  //     },
  //   ],
  // },
  // {
  //   id: "Stage Management",
  //   title: "Stage Management",
  //   translate: "Stage Management",
  //   type: "collapse",
  //   auth: [...authRoles.admin],
  //   icon: "description",
  //   children: [
  //     {
  //       id: "Stage List",
  //       title: "Stage List",
  //       translate: "Stage List",
  //       auth: [...authRoles.admin],
  //       type: "item",
  //       url: "/admin/stages/list",
  //     },
  //     {
  //       id: "Create New Intake",
  //       title: "Create New Intake",
  //       translate: "Create New Intake",
  //       auth: [...authRoles.admin],
  //       type: "item",
  //       url: "/admin/stages/create",
  //     },
  //   ],
  // },

  {
    id: "User Management",
    title: "User Management",
    translate: "User Management",
    type: "collapse",
    auth: [...authRoles.admin],
    icon: "description",
    children: [
      {
        id: "User Listing",
        title: "User Listing",
        translate: "User Listing",
        auth: [...authRoles.admin],
        type: "item",
        url: "/admin/users/list",
      },
      {
        id: "Create User",
        title: "Create User",
        translate: "Create User",
        auth: [...authRoles.admin],
        type: "item",
        url: "/admin/users/create",
      },
    ],
  },
  {
    id: "Project Management",
    title: "Project Management",
    translate: "Project Management",
    type: "collapse",
    auth: [...authRoles.admin],
    icon: "description",
    children: [
      {
        id: "Project Listing",
        title: "Project Listing",
        translate: "Project Listing",
        auth: [...authRoles.admin],
        type: "item",
        url: "/admin/project/list",
      },
      {
        id: " Create Project",
        title: " Create Project",
        translate: " Create Project",
        auth: [...authRoles.admin],
        type: "item",
        url: "/admin/project/create",
      },
    ],
  },
  {
    id: "Task Report",
    title: "Task Report",
    translate: "Task Report",
    type: "collapse",
    auth: [...authRoles.admin],
    icon: "description",
    children: [
      {
        id: "Task Report List",
        title: "Task Report List",
        translate: "Task Report List",
        auth: [...authRoles.admin],
        type: "item",
        url: "/admin/taskreport/list",
      },
      {
        id: "Create Task Report",
        title: "Create Task Report",
        translate: "Create Task Report",
        auth: [...authRoles.admin],
        type: "item",
        url: "/admin/taskreport/create",
      },
    ],
  },
  // {
  //   id: "Configuration",
  //   title: "Configuration",
  //   translate: "Configuration",
  //   type: "collapse",
  //   auth: [...authRoles.admin],
  //   icon: 'tune',
  //   children: [
  //     {
  //       id: 'PTR Configuration',
  //       title: 'PTR',
  //       translate: 'PTR',
  //       auth: [...authRoles.admin],
  //       type: 'item',
  //       url: '/apps/configuration/ptr',
  //     },
  //     {
  //       id: 'EFILE Configuration',
  //       title: 'EFILE',
  //       translate: 'EFILE',
  //       auth: [...authRoles.admin],
  //       type: 'item',
  //       url: '/apps/configuration/efile',
  //     },
  //     {
  //       id: 'LRS Configuration',
  //       title: 'LRS',
  //       translate: 'LRS',
  //       auth: [...authRoles.admin],
  //       type: 'item',
  //       url: '/apps/configuration/lrs',
  //     }
  //   ]
  // },
];

export default navigationConfig;
