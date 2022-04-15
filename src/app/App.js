import FuseAuthorization from '@fuse/core/FuseAuthorization';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import history from '@history';
import {Router} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import { Auth } from './auth';

import withAppProviders from 'app/withAppProviders';
import axios from 'axios';

/*
 * Axios HTTP Request defaults
*/
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const App = () => {
    return (
        <Router history={history}>
            <Auth>
                <FuseAuthorization>
                    <FuseTheme>
                        <SnackbarProvider
                            maxSnack={5}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            classes={{
                                containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                            }}
                        >
                            <FuseLayout/>
                        </SnackbarProvider>
                    </FuseTheme>
                </FuseAuthorization>
            </Auth>
        </Router>
    );
};

export default withAppProviders(App)();
