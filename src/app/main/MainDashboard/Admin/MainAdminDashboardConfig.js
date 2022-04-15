import { authRoles } from 'app/auth';
import {lazy} from "react";

const AdminDashBoardConfig = {
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
            path: '/admin/dashboard',
            component: lazy(() => import('./MainAdminDashboard')),
        },
    ],
};

export default AdminDashBoardConfig;
