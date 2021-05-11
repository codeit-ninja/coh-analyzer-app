import { getStorageItem } from '@/functions/helpers';
import { Core } from '@/modules/core.module';
import { Profile } from '@/modules/steam/profile';
import { HelixPrivilegedUser } from 'twitch/lib';
import Firebase from 'firebase';

export class User {
    public static twitch: HelixPrivilegedUser|null;

    public static steam: Profile|null;

    public static async load() {        
        this.twitch = await Core.twitch.user();
        
        if( getStorageItem('APP_STEAM_ID') ) {
            this.steam = await Profile.getBySteamId(BigInt(getStorageItem('APP_STEAM_ID')));
        }

        return User;
    }

    public static firebase() {
        if( ! Core.firebase.app.auth().currentUser )
    }

    // public static get firebase() {
    //     return Core.firebase.app.auth().currentUser;
    // }
}