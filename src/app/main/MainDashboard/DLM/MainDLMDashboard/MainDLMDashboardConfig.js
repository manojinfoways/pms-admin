import { authRoles } from 'app/auth';
import {lazy} from "react";

const MainDLMDashboardConfig = {
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
    auth: authRoles.staff,
    routes: [
        {
            path: '/dlm/dashboard',
            component:  lazy(() => import('./MainDLMDashboard')),
        },
    ],
};

export default MainDLMDashboardConfig;
