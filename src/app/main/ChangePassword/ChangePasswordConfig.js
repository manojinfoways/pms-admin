import { authRoles } from 'app/auth';
import {lazy} from "react";

const ChangePasswordConfig = {
    settings: {
        layout: {
            config: {
                footer: {
                    display: false,
                },
            },
        },
    },
    auth: [...authRoles.user, ...authRoles.admin, ...authRoles.researcher, ...authRoles.poster],
    routes: [
        {
            path: '/admin/change-password',
            exact: true,
            component: lazy(() => import('./ChangePassword')),
        },
    ],
};

export default ChangePasswordConfig;
