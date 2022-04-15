import { createContext } from 'react';

const AuthContext = createContext({
    signinRedirectCallback: (d) => ({}),
    logout: () => ({}),
    signoutRedirectCallback: () => ({}),
    isAuthenticated: () => ({}),
    signinRedirect: () => ({}),
    signinSilentCallback: () => ({}),
    createSigninRequest: () => ({})
});

export default AuthContext;

