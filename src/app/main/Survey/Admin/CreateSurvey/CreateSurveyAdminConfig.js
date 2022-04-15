
import { authRoles } from 'app/auth';
import {lazy} from "react";

const CreateSurveyAdmin = {
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
            path: '/admin/intake/create',
            component: lazy(() => import('./CreateSurveyAdmin')),
        },
        {
            path: '/admin/intake/update/:id',
            component: lazy(() => import('./CreateSurveyAdmin')),
        },
        {
            path: '/admin/intake/list',
            component: lazy(() => import('./SurveyList')),
        },
        
    ],
};

export default CreateSurveyAdmin;
