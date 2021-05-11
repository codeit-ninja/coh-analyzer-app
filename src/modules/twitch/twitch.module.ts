import { ApiClient, StaticAuthProvider } from 'twitch/lib';
import { OAuth2Provider } from '@/modules/authentication/authentication.module';
import { RefreshTokenError } from '../exceptions/RefreshTokenError';
import { state } from '@/modules/core.module';

export default class Twitch extends OAuth2Provider {
    public getApiClient() {   
        return new ApiClient({ authProvider: new StaticAuthProvider(this.clientId, this.accessToken) });
    }

    public async user() {
        return await this.getApiClient().helix.users.getMe();
    }

    public async channel() {
        return await this.getApiClient().kraken.channels.getMyChannel();
    }

    public async autoRefreshToken() {
        if( ! this.refreshToken ) return;

        try {
            if( this.isExpired() ) {
                await this.requestToken();
            }
        } catch(e) {
            state.error = new RefreshTokenError();
        }
    }
}