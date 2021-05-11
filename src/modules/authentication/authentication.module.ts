import config from '@/config';
import * as Helpers from '@/functions/helpers';
import moment from 'moment';

export type iTokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

export class OAuth2Provider {
    /**
     * Client id
     * 
     * @returns string
     */
    #clientId: string;

    /**
     * Client secret
     * 
     * @returns string
     */
    #clientSecret: string;

    /**
     * Twitch authorization scopes
     * 
     * @returns string
     */
    #scopes: string[];

    /**
     * Local authentication url
     * 
     * @returns string
     */
    #redirectUri: string;

    constructor() {
        this.#clientId = config.twitch.clientId;
        this.#clientSecret = config.twitch.clientSecret;
        this.#scopes = config.twitch.scopes;
        this.#redirectUri = process.env.NODE_ENV === 'production' ? 'http://localhost/oauth/code' : 'http://localhost:8080/oauth/code';
    }

    /**
     * Get configured client id
     * 
     * @returns string
     */
    public get clientId() {
        return this.#clientId;
    }

    /**
     * Get configured client secret
     * 
     * @returns string
     */
    public get clientSecret() {
        return this.#clientSecret;
    }

    /**
     * Get current acces token
     * 
     * @returns string
     */
    public get accessToken() {
        return Helpers.getStorageItem('TWITCH_ACCESSTOKEN');
    }

    /**
     * Set new accestoken
     * 
     * @param string accessToken
     */
    public set accessToken(accessToken: string) {
        Helpers.setStorageItem('TWITCH_ACCESSTOKEN', accessToken);
    }

    /**
     * Get current refreshtoken
     * 
     * @returns string
     */
    public get refreshToken() {
        return Helpers.getStorageItem('TWITCH_REFRESHTOKEN');
    }

    /**
     * Set new accestoken
     * 
     * @param string refreshToken
     */
    public set refreshToken(refreshToken: string) {
        Helpers.setStorageItem('TWITCH_REFRESHTOKEN', refreshToken);
    }

    /**
     * Get accestoken expiry date
     * 
     * @returns date
     */
    public get expiryDate() {
        return Helpers.getStorageItem('TWITCH_EXPIRYDATE');
    }

    /**
     * Set new accestoken
     * 
     * @param date expiryDate
     */
    public set expiryDate(expiryDate: Date) {
        Helpers.setStorageItem('TWITCH_EXPIRYDATE', expiryDate);
    }

    /**
     * Get current list of scopes
     * 
     * @returns string[]
     */
     public get scope() {
        return Helpers.getStorageItem('TWITCH_SCOPE');
    }

    /**
     * Update scopes
     * 
     * @param string[]
     */
    public set scope(scopes: string) {
        Helpers.setStorageItem('TWITCH_SCOPE', scopes);
    }

    /**
     * Authenticate user, redirects user to twitch
     * 
     * @returns void
     */
    public authenticate() {
        window.location.href = Helpers.buildTwitchAuthUri(this.#clientId, this.#redirectUri, this.#scopes);
    }

    /**
     * Do a token request. 
     * If a refreshtoken exists it will do a refreshtoken request
     * 
     * @returns void
     */
    public async requestToken() {
        const tokens = await Helpers.http.post<iTokenResponse>(Helpers.buildTwitchTokenUri(this.#clientId, this.#clientSecret, this.#redirectUri, this.refreshToken));
        
        this.accessToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token;
        this.scope = tokens.scope;
        this.expiryDate = moment().add(tokens.expires_in, 'seconds').toDate();
    }

    /**
     * Checks if current accesstoken is expired
     * 
     * @returns boolean
     */
    public isExpired() {
        return moment().isSameOrAfter(this.expiryDate) || ! this.accessToken;
    }
}