
import * as React from "react";
import { AuthConsumer } from "app/providers/authProviders";

export const Logout = () => (
    <AuthConsumer>
        {({ logout }) => {
            logout();
            return <span>loading</span>;
        }}
    </AuthConsumer>
);