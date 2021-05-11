import { ElectronAuthProvider } from "twitch-electron-auth-provider/lib";
import { ApiClient } from "twitch/lib";

export class Auth {
    private static _instance: Auth;

    private _provider: ElectronAuthProvider;

    private _client: ApiClient; 

    private constructor() {
        this._provider = new ElectronAuthProvider({
            clientId: process.env.VUE_APP_TWITCH_CLIENT_ID as string,
            redirectUri: 'http://localhost/oauth/code'
        });
        
        
        this._client = new ApiClient({ authProvider: this._provider });
        this._client.requestScopes([
            'channel_read',
            'user_read',
            'chat:edit',
            'chat:read',
            'whispers:read',
            'whispers:edit'
        ]);
    }

    public get provider() {
        return this._provider;
    }

    public get client() {
        return this._client;
    }

    public static get instance() {
        return this._instance || (this._instance = new Auth());
    }

    public static init() {
        return this._instance;
    }
}