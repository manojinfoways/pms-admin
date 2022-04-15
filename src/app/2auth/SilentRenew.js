import React from "react";

import {AuthConsumer} from "app/providers/authProviders";
import FuseSplashScreen from "@fuse/core/FuseSplashScreen/FuseSplashScreen";

const SilentRenew = () => (
    <AuthConsumer>
        {({signinSilentCallback}) => {
            signinSilentCallback();
            return <FuseSplashScreen/>
        }}
    </AuthConsumer>
);

export default SilentRenew;