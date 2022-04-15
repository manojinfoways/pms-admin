import { authRoles } from 'app/auth';
import {lazy} from "react";

const PTRAdminDashboardConfig = {
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
            path: '/ptr/admin/dashboard',
            component: lazy(() => import('./PTRAdminDashboard')),
        },
    ],
};

export default PTRAdminDashboardConfig;
