import { getStorageItem } from '@/functions/helpers';
import firebase from 'firebase';
import { HelixPrivilegedUser } from 'twitch/lib';
import { loadModule, router, state } from '@/modules/core.module';
import { Profile } from '../steam/profile';

export class SteamIdNotFoundError extends Error {
    constructor() {
        super();

        this.name = 'SteamIdNotFoundError';
        this.message = 'There was an error with finding the registered steam ID. We could not find one';
    }
}

export class NoCohProfileFound extends Error {
    constructor() {
        super();

        this.name = 'NoCohProfileFound';
        this.message = 'We couldn\'t find a Company of Heroes profile, please notify FkNoobsCoH';
    }
}

export class FireBaseAuthFailedError extends Error {
    constructor() {
        super();

        this.name = 'FireBaseAuthFailedError';
        this.message = 'Something went wrong with the authentication, please notify FkNoobsCoH.';
    }
}

export class AuthenticationError extends Error {
    constructor(...params: any) {
        super(params);

        this.name = 'AuthenticationError';
    }
}

export class AuthUser {    
    constructor(
        public steamId: BigInt, 
        public firebase: firebase.User, 
        public coh: Profile,
        public twitch: HelixPrivilegedUser|null
    ) {}

    public static async startup() {
        state.loading = true;

        return new Promise<AuthUser>((resolve, reject) => {

            const steamId = getStorageItem('APP_STEAM_ID');
            const firebase = loadModule('firebase');

            if( ! steamId ) {
                state.loading = false;
                state.ready = true;

                router.replace({'name': 'Installation'})

                return reject('Need installation first');
            }

            firebase.app.auth().onAuthStateChanged(async user => {
                /**
                 * If no user was found on auth state  
                 * Try to login with the steamId.
                 */
                if( ! user ) {
                    await firebase.login(steamId);
                }

                const firebaseUser = await this.loadFirebaseUser();
                const cohUser = await this.loadCohUser(steamId);
                const twitchUser = await this.loadTwitchUser();

                if( ! firebaseUser || ! cohUser ) {
                    state.error = new AuthenticationError('We had trouble authenticating you, try to restart the application. If the error persists, contact FkNoobsCoH.');
                
                    return reject(state);
                }

                state.loading = false;
                state.ready = true;

                return resolve(new AuthUser(steamId, firebaseUser, cohUser, twitchUser));
            });
        });
    }

    private static loadFirebaseUser() {
        return loadModule('firebase').app.auth().currentUser;
    }

    private static async loadCohUser(steamId: string) {
        try {
            return Profile.getBySteamId(BigInt(steamId));
        } catch(e) {
            return null;
        }
    }

    private static async loadTwitchUser() {
        try {
            return await loadModule('twitch').user();
        } catch(e) { 
            return null;
        }
    }
}