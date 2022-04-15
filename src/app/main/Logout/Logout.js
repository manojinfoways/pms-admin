import * as React from "react";
import {AuthConsumer} from "app/providers/authProviders";
import FuseSplashScreen from "@fuse/core/FuseSplashScreen";

const Logout = () => (
    <AuthConsumer>
        {({logout}) => {
            logout();
            return <FuseSplashScreen />;
        }}
    </AuthConsumer>
)

export default Logout;