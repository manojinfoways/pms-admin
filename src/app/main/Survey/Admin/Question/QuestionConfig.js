import {authRoles} from 'app/auth';
import {lazy} from 'react';

const QuestionConfig = {
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
      path: '/admin/intake/question/:type/:survey_id/:question_id',
      component: lazy(() => import('./AddQuestion')),
    },
    {
      path: '/admin/intake/question/:type/:survey_id',
      component: lazy(() => import('./AddQuestion')),
    },
    {
      path: '/admin/intake/question/:survey_id',
      component: lazy(() => import('./QuestionPage')),
    },
    {
      path: '/admin/intake/question/',
      component: lazy(() => import('./AddQuestion')),
    },
    {
      path: '/admin/intake/questionlist',
      component: lazy(() => import('./QuestionsList')),
    },
  ],
};

export default QuestionConfig;
