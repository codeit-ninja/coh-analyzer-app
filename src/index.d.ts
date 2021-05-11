declare module 'app' {
    import Config from '@/modules/config/config.module';
    import Twitch from '@/modules/twitch/twitch.module';
    import { RouteRecordRaw } from 'vue-router';

    interface iCoreModules {
        twitch: Twitch;
    }

    interface iConfig {
        twitch: iTwitchAuthorization;
        firebase: iFirebase;
        firebaseAdmin: iFirebaseAdmin
        routes: Array<iRoute>;
        logPath: string;
        playbackPath: string;
    }

    interface iRoute {
        route: RouteRecordRaw;
        menuItemName?: string;
        menuItemIcon?: string;
    }
    
    interface iBaseModule {
        new(): any;
    }

    interface iTwitchAuthorization {
        clientId: string;
        clientSecret: string;
        redirectUri: string;
        scopes: string[];
        accessToken?: string;
        refreshToken?: string;
        expireDate?: Date;
    }
    
    interface iAccessToken {
        accessToken: string,
        refreshToken: string
    }
    
    interface iAccessTokenClient extends iAccessToken {
        clientId: string;
        clientSecret: string;
    }

    interface iFirebase {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        databaseURL: string;
        measurementId: string;
    }

    interface iFirebaseAdmin {
        type: string;
        projectId: string;
        privateKeyId: string;
        privateKey: string;
        clientEmail: string;
        clientId: string;
        authUri: string;
        tokenUri: string;
        auth_provider_x509_cert_url: string;
        client_x509_cert_url: string;
    }
}