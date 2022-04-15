import {Log, UserManager, WebStorageStateStore} from "oidc-client";
import React, {Component} from "react";
import FuseSplashScreen from "@fuse/core/FuseSplashScreen";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";
import {IDENTITY_CONFIG, METADATA_OIDC} from "app/utils/authConst";
import {setUserData} from "app/auth/store/userSlice";
import AuthContext from "app/AuthContext";
import axios from "axios";

class AuthCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authStatus: localStorage.getItem('authStatus')
        }
        this.UserManager = new UserManager({
            ...IDENTITY_CONFIG,
            userStore: new WebStorageStateStore({store: window.sessionStorage}),
            metadata: {
                ...METADATA_OIDC
            }
        });
        // Logger
        
    }

    componentDidMount() {
        if (!this.state.authStatus) {
            this.signinRedirect();
        } else if (this.state.authStatus === 'Initiated') {
            this.signinRedirectCallback();
        }
    }

    componentWillUnmount() {
        localStorage.clear();
    }

    signinRedirectCallback = () => {
        localStorage.removeItem('authStatus')
        this.UserManager.signinRedirectCallback()
            .then((user) => {
                if (user) {
                    let newUserRole;
                    let redirectUrl;
                    if (user.profile.role === "Admin") {
                        newUserRole = ['admin',]
                        redirectUrl = 'ptr/admin/dashboard'
                    } else if (user.profile.role === "user") {
                        newUserRole = ['user',]
                        redirectUrl = 'ptr/dashboard'
                    } else if (user.profile.role === "staff") {
                        newUserRole = ['staff',]
                        redirectUrl = 'dlm/dashboard'
                    } else if (user.profile.role === "RESEARCHERS") {
                        newUserRole = ['researcher',]
                        redirectUrl = 'ptr/researcher/dashboard'
                    } else if (user.profile.role === "POSTER") {
                        newUserRole = ['poster',]
                        redirectUrl = 'ptr/poster/dashboard'
                    } else {
                        newUserRole = []
                        redirectUrl = localStorage.getItem('redirectUri')
                    }
                    const redirectURI = localStorage.getItem('redirectUri');
                    localStorage.removeItem('redirectUri')
                    if (redirectURI !== '/') {
                        if (redirectURI !== '/logout') {
                            if (redirectURI !== '/404') {
                                if (redirectURI !== '/callback') {
                                    redirectUrl = redirectURI
                                }
                            }
                        }
                    }

                    axios.post('/authlogin', {
                        userName: user.profile.preferred_username,
                        email: user.profile.email,
                        firstName: user.profile.name.split(" ")[0] || "",
                        lastName: user.profile.name.split(" ")[1] || "",
                        role: user.profile.role,
                        phoneNumber: ""
                    }).then(res => {
                        axios.defaults.headers.common['Authorization' ] = `Bearer ${res.data.token}`;
                        axios.defaults.headers.common['x-access-token'] = localStorage.getItem("jwt_access_token")
                         
                        const decodedToken = this.parseJwt(res.data.token)
                        const new_user = {
                            id_token: res.data.token,
                            access_token: user.access_token,
                            redirectUrl: redirectUrl,
                            role: newUserRole,
                            user_id: decodedToken.id,
                            data: {
                                displayName: user.profile.name,
                                photoURL: "",
                                email: user.profile.email
                            },
                            shortcuts: []
                        }

                        this.props.setUserData(new_user)
                        this.props.history.push(redirectUrl)
                        this.setState({
                            authStatus: 'Completed'
                        });
                    }).catch(err => {
                        console.error("LogIn Failed: ", err)
                    });
                }
            })
            .catch((error) => this.signinRedirect())
    };

    getUser = async () => {
        const user = await this.UserManager.getUser();
        if (!user) {
            return await this.UserManager.signinRedirectCallback();
        }
        return user;
    };

    parseJwt = (token) => {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    };

    signinRedirect = () => {
        localStorage.setItem("redirectUri", window.location.pathname);
        localStorage.setItem("authStatus", "Initiated");
        this.UserManager.signinRedirect({});
    };

    isAuthenticated = () => {
        const oidcStorage = JSON.parse(sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`))
        return !!oidcStorage
    };

    signinSilent = () => {
        this.UserManager.signinSilent({
            scope: "openid profile email roles api1",
            response_type: "token id_token"
        }).then((user) => {
            console.log("signed in", user);
        }).catch((err) => {
            console.log(err);
        });
    };

    signinSilentCallback = () => {
        this.UserManager.signinSilentCallback();
    };

    createSigninRequest = () => {
        return this.UserManager.createSigninRequest();
    };

    logout = () => {
        this.UserManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token")
        });
        this.UserManager.clearStaleState();
    };

    signoutRedirectCallback = () => {
        this.UserManager.signoutRedirectCallback().then(() => {
            localStorage.clear();
            window.location.replace(process.env.REACT_APP_PUBLIC_URL);
        });
        this.UserManager.clearStaleState();
    };

    render() {

        if (this.state.authStatus === 'Completed') {
            const authService = {
                signinRedirectCallback: this.signinRedirectCallback,
                getUser: this.getUser,
                signinRedirect: this.signinRedirect,
                isAuthenticated: this.isAuthenticated,
                signinSilent: this.signinSilent,
                signinSilentCallback: this.signinSilentCallback,
                createSigninRequest: this.createSigninRequest,
                logout: this.logout,
                signoutRedirectCallback: this.signoutRedirectCallback,
            }
            return (
                <AuthContext.Provider value={authService}>
                    {this.props.children}
                </AuthContext.Provider>
            )
        } else {
            return <FuseSplashScreen/>
        }

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setUserData,
        },
        dispatch
    );
}


export default withRouter(connect(null, mapDispatchToProps)(AuthCheck));
