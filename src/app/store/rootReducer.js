import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import fuse from './fuse';
import ptr from './ptr';
import survey from 'app/main/Survey/Admin/store/surveySlice';  
import chart from 'app/main/Survey/Admin/store/chartSlice';  
// import configuration from "app/main/Configuration/store/configurationSlice";
import i18n from "./i18nSlice";
 
const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    auth,
    fuse,
    survey,
    chart,
    ptr,
    i18n,
    // configuration,
    ...asyncReducers,
  });

  /*
	Reset the redux store when user logged out
	 */
  if (action.type === "auth/user/userLoggedOut") {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
