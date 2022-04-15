import React, { Component } from "react";
import AuthService from "app/services/authService";
import AuthContext from 'app/AuthContext';

export const AuthConsumer = AuthContext.Consumer;

export class AuthProvider extends Component {
    authService;
    constructor(props) {
        super(props);
        this.authService = new AuthService();
        
    }
    render() {
        return <AuthContext.Provider value={this.authService}>{this.props.children}</AuthContext.Provider>;
    }
}