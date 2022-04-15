import { authRoles } from 'app/auth';
import {lazy} from "react";

const AnalyticsConfig = {
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
            path: '/ptr/admin/analytics',
            component: lazy(() => import('./Analytics')),
        },
    ],
};

export default AnalyticsConfig;
