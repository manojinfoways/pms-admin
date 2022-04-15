import {authRoles} from 'app/auth';
import {lazy} from 'react';

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
      path: '/admin/detail/location/:survey_location_id',
      component: lazy(() => import('../SurveyLocations/SurveyLocationDetails')),
    },
    {
      path: '/admin/map',
      component: lazy(() => import('./MapAdmin')),
    },
  ],
};

export default CreateSurveyAdmin;
