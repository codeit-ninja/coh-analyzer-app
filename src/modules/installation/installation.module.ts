import { getStorageItem, setStorageItem } from "@/functions/helpers";
import { reactive } from "@vue/reactivity";
import { Profile } from "../steam/profile";
import { loadModule } from '@/modules/core.module';

export class Installation {
    public static steps = reactive([
        {
            name: 'Creating account.',
            done: false,
            error: null
        },
        {
            name: 'Logging in for the first time',
            done: false,
            error: null
        },
        {
            name: 'Storing basic info.',
            done: false,
            error: null
        }
    ])

    public static async start(steamId: string, profile: Profile) {
        setStorageItem('APP_STEAM_ID', steamId);

        const promises = [];
        const firebase = loadModule('firebase');

        this.steps[0].done = false;
        this.steps[1].done = false;
        this.steps[2].done = false;

        const step1 = new Promise(resolve => setTimeout( async () => {
            await firebase.admin.auth().createCustomToken(steamId).then(token => setStorageItem('APP_GOOGLE_TOKEN', token));

            resolve(this.steps[0].done = true);
        }, 1500));

        const step2 = new Promise(resolve => setTimeout( async () => {
            await firebase.app.auth().signInWithCustomToken(getStorageItem('APP_GOOGLE_TOKEN'));

            resolve(this.steps[1].done = true);
        }, 1700));
        
        const step3 = new Promise(resolve => setTimeout( async () => {
            await firebase.firestore.collection('users').doc(steamId).set({
                steamId: steamId,
                country: profile.country,
                id: profile.id
            });

            resolve(this.steps[2].done = true);
        }, 2200));

        promises.push(step1, step2, step3);

        return Promise.all(promises);
    }
}