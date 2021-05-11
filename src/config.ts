import { iConfig } from 'app';
import { remote } from 'electron';
import Dashboard from '@/views/Dashboard.vue';
import OAuth from '@/views/Auth.vue';

const config: iConfig = {
    /**
     * Add custom routes here
     */
    routes: [
        {
            route: {
                path: '/install',
                name: 'Installation',
                component: () => import(/* webpackChunkName: "Installation" */ '@/views/Install.vue')
            }
        },
        {
            menuItemName: 'Dashboard',
            menuItemIcon: 'bi bi-speedometer2',
            route: {
                path: '/',
                alias: [
                    '/dashboard',
                    '/index.html',
                    '/app://index.html'
                ],
                name: 'Dashboard',
                component: Dashboard
            }
        },
        {
            menuItemName: 'Current match',
            menuItemIcon: 'bi bi-controller',
            route: {
                path: '/matches/current',
                name: 'CurrentMatch',
                component: () => import(/* webpackChunkName: "CurrentMatch" */ '@/views/CurrentMatch.vue')
            }
        },
        {
            menuItemName: 'Match history',
            menuItemIcon: 'bi bi-clock-history',
            route: {
                path: '/matches/history',
                name: 'MatchArchive',
                component: () => import(/* webpackChunkName: "MatchArchive" */ '@/views/MatchArchive.vue')
            }
        },
        {
            menuItemName: 'Settings',
            menuItemIcon: 'bi bi-gear',
            route: {
                path: '/settings',
                name: 'Settings',
                component: () => import(/* webpackChunkName: "Settings" */ '@/views/Settings.vue')
            }
        },
        {
            route: {
                path: '/oauth/code',
                name: 'Auth',
                component: OAuth
            }
        }
    ],
    logPath: remote.app.getPath('documents') + '\\My Games\\Company of Heroes Relaunch\\warnings.log',
    playbackPath: remote.app.getPath('documents') + '\\My Games\\Company of Heroes Relaunch\\playback',
    twitch: {
        clientId: '67kqvxzgx6pvdyjlrkbmdty1kns90v',
        clientSecret: 'ci9bjgi8g33775bhnk30br5jgvbaqp',
        redirectUri: 'http://localhost:8080/oauth/code',
        scopes: [
            'channel_read', 
            'user_read', 
            'chat:edit', 
            'chat:read',
            'whispers:read', 
            'whispers:edit'
        ],
        accessToken: undefined,
        refreshToken: undefined,
        expireDate: undefined
    },
    firebase: {
        /**
         * Firebase API configuration
         */
        apiKey: "AIzaSyDQfwetBDpebLJKu50O4oai9hZoNTBXKjE",
        authDomain: "company-of-heroes-twitch.firebaseapp.com",
        projectId: "company-of-heroes-twitch",
        storageBucket: "company-of-heroes-twitch.appspot.com",
        messagingSenderId: "271737567479",
        appId: "1:271737567479:web:9ec594152c54f1fb3c7bf2",
        databaseURL: 'https://company-of-heroes-twitch-default-rtdb.europe-west1.firebasedatabase.app/',
        measurementId: "G-CPQ1R9E1X5",
    },
    firebaseAdmin: {
        type: "service_account",
        projectId: "company-of-heroes-twitch",
        privateKeyId: "676858bc14d8dec0fc98ff38869a23335f8715c0",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuFUSZrCdzXy2y\nfJ+XC95cxIcXsEkjcTPpN7P3of5TFQmtT/WXyEDmiHlb8HVIMn3+ZXPZUobqxviD\nFMxpN7nK1JtAXMHidF9nxafMzkBoOqofMDfV0QJ1NYdD0asVSd5lIGbyrbPNsYCx\nnO+oOD5X7YEfWBrywg5g9WHZqRNgv2jYwgRXntKi0SfyiMcIVXQ2SNKrq1hM3LKT\nlz3FlUi2QN5s773LYoDET68vAt0CWZX1atqmaQgAqpyED7zTMEJj0UNqTognMZE2\n8Zz2sHeiTPSTnxamDmtuiNlyqvpVXkCCH4hBsbjstzy6gN8VLGhUq68TLcYSrTDy\nKm4YFb97AgMBAAECggEARWNX0TMUFIITGmpfSFskOnDhchlDxdtI+ERKOUH6OA6S\nKWFOQL5C1EEAspthfDIYE29H4o9pFKrTgpgnNCdQqJ7e9SQj6go9vwTDcjih5om/\npqfXEaR6aNK5xFgN6/HiMgfc0Q1Ytnvykpk905z7iJu0FJTPRQUBqzcT1ij0/uIT\nITAMIsQ5l7WMm1wDVxBdk8hfymDlN4C6VwDlVg6BCDS9Tm2M1rrm18Kja5YTKXg+\npXLOGnW9Wue5pdDOWE3wTxZlHh+n9Web+Igxx0N3RTJrzaGSHO/8rxGoFsFTfNH5\nVzr5R9BfTcxYiS+L2HR/6gV7sm3nJGXoNM5Lqcli6QKBgQDvQ9BwQ156im5hCeIQ\nZdIDJLag5MKgZHX0dGEzw4VyCD3Qt0nX4D4UCK5Su2VZsqIgzCvfVJf0d14HQzNG\npfvRxjyPgh1BxdjExMl8H1x13Z7150JKcpHuiTggBt+9eughT4oOxQJh3wNJpSIZ\nB8fKqGQRVZ20IPRuF8ArkxdwIwKBgQC6QlU+99UwB1egXIjqJIwgwuCxCr4hsxmL\ne6+xVppcRqJY43McrFT0GncEv9gwGWz3hMD6W0o4eJWhrekx8/NY6f6FXJ+VK+gr\nLRH2bB0s+Yx21JFyFxhB47gw4jo9Xc5YOL/42YTFzmxIrlyfSxrjFMSlp6Jj9RKl\nQpL75Se8yQKBgHIEAMnecKE4Ykz/pqhlvOQelKCrIkvIU6U/6CoAnBCw+LQDA79J\nbouhb2ChSDSsOTIj2Sw9ZYPrdfVEAqVB53QZYTaJrGNxYlCx7cmmMCtChsNrhl1v\npzbiUMqCPBBRB1kITCOpoe79lNV9SXhgCsb542WXROVXZuMnkj2xhFO9AoGAavLx\nveFSkWx13Uek+kUYDSu5Fw9jEziiv1u7C2n94mRQjhe0Hk+5zBxyINEDksLWtd2N\nbXQDzx82VArnLt6z6Wca1XrUyzPV8QzFFqkHq65zADyYc1ldfWADgFY2OMxnUnLr\nkDleKrKXrLgpyPG4M5HWRIRYE2tCVJBAk9EGGzkCgYEAm9wcvgrbTi70YrVARymt\n2c/GPeyxUWMfWiL2PDDkTDiJxykhWGOvfPILwQJU3oC6qGIDCdcCFraXNCjkvUHm\ngU2WawZ5rw7YZf7eXNlIfiUU8XP5FD/oO3kcg7b9R7c/jSPbUW8EQAppkUCkGN/C\nS2JsXIfuq1pqkUoIx7tjRSU=\n-----END PRIVATE KEY-----\n",
        clientEmail: "firebase-adminsdk-ke10i@company-of-heroes-twitch.iam.gserviceaccount.com",
        clientId: "101429526930543456162",
        authUri: "https://accounts.google.com/o/oauth2/auth",
        tokenUri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ke10i%40company-of-heroes-twitch.iam.gserviceaccount.com"
    }
}

export default config;