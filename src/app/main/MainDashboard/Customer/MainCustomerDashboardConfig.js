import { authRoles } from 'app/auth';
import {lazy} from "react";

const CustomerDashBoardConfig = {
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
    auth: authRoles.user,
    routes: [
        {
            path: '/dashboard',
            component: lazy(() => import('./MainCustomerDashboard')),
        },
    ],
};

export default CustomerDashBoardConfig;
