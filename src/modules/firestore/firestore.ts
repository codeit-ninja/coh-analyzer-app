import FB from 'firebase';
import config from '@/config';
import admin from 'firebase-admin';
import { remote } from 'electron';
import { getStorageItem, setStorageItem } from '@/functions/helpers';

//export const firebase = FB.initializeApp(config.firebase);
//export const firestore = firebase.firestore();
//export const storage = firebase.storage();
export class Firebase {
    /**
     * Firebase base app
     * 
     * @type { firebase.app.App }
     */
    #app: FB.app.App;

    /**
     * Firebase admin app
     * 
     * @type { admin.app.App }
     */
    #admin: admin.app.App;

    /**
     * Firebase firestor object 
     * 
     * @type { FB.firestore.Firestore }
     */
    #firestore: FB.firestore.Firestore;

    /**
     * Firebase storage object
     * 
     * @type { FB.storage.Storage }
     */
    #storage: FB.storage.Storage;

    constructor() {
        this.#app = FB.initializeApp(config.firebase);
        this.#admin = admin.initializeApp({
            credential: admin.credential.cert(config.firebaseAdmin),
            databaseURL: 'https://company-of-heroes-twitch-default-rtdb.europe-west1.firebasedatabase.app',
            serviceAccountId: 'firebase-adminsdk-ke10i@company-of-heroes-twitch.iam.gserviceaccount.com'
        });
        this.#firestore = this.#app.firestore();
        this.#storage = this.#app.storage();
    }

    /**
     * Login
     * 
     * Logs a user in based in its steam ID  
     * If a user doesn't exist, create one
     * 
     * @param steamId 
     */
    public async login(steamId: string) {
        return await this.#app.auth().signInWithCustomToken(await this.#admin.auth().createCustomToken(steamId));
    }

    /**
     * Firebase SDK
     * 
     * @returns firebase app
     */
    public get app() {
        return this.#app;
    }

    /**
     * Firebase admin SDK
     * 
     * @returns firebase admin
     */
    public get admin() {
        return this.#admin;
    }
    
    /**
     * Firebase firestore object
     * 
     * @returns firestore object
     */
    public get firestore() {
        return this.#firestore;
    }

    /**
     * Firebase storage object
     * 
     * @returns storage object
     */
    public get storage() {
        return this.#storage;
    }
}