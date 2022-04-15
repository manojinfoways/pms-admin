import React from "react";

const SilentRenewConfig = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false,
                },
                toolbar: {
                    display: false,
                },
                footer: {
                    display: false,
                },
                leftSidePanel: {
                    display: false,
                },
                rightSidePanel: {
                    display: false,
                },
            },
        },
    },
    routes: [
        {
            path: '/silentrenew',
            component: React.lazy(() => import('./SilentRenew')),
        },
    ],
};

export default SilentRenewConfig;
