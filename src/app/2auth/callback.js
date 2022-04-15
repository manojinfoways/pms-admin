import * as React from "react";

import { AuthConsumer } from "../providers/authProviders";

export const Callback = () => (
    <AuthConsumer>
        {({ signinRedirectCallback }) => {
           const user = signinRedirectCallback();
            return <span>loading</span>;
        }}
    </AuthConsumer>
);