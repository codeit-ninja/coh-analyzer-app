import fs from 'fs-extra';
import { BaseModule } from "../base.module";
import { remote } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { iAccessTokenClient } from "app";
import { iConfigModule, iAccessToken, iFirebaseConfig } from "app";

export default class Config extends BaseModule {
    public static path = `${remote.app.getPath('documents')}\\FkNoobs CoH Bot\\config.json`;

    public readonly id: string;

    public readonly apiKey: string;

    public readonly authDomain: string;

    public readonly projectId: string;

    public readonly storageBucket: string;

    public readonly messagingSenderId: string;

    public readonly appId: string;

    public readonly databaseURL: string;

    public readonly measurementId: string;

    public readonly cohLogPath: string;

    public readonly twitch: iAccessTokenClient;

    constructor() {
        super();

        let config: iConfigModule;

        if(fs.pathExistsSync(Config.path)) {
            config = fs.readJsonSync(Config.path) as iConfigModule;
        } else {
            config = Config.default();
        }

        this.id = config.id;
        this.apiKey = config.apiKey;
        this.authDomain = config.authDomain;
        this.projectId = config.projectId;
        this.storageBucket = config.storageBucket;
        this.messagingSenderId = config.messagingSenderId;
        this.appId = config.appId;
        this.databaseURL = config.databaseURL;
        this.measurementId = config.measurementId;
        this.cohLogPath = config.cohLogPath;
        this.twitch = config.twitch;
    }

    /**
     * Returns object containing firebase config
     * 
     * @returns { iFirebaseConfig }
     */
    public firebase(): iFirebaseConfig {
        return {
            apiKey: this.apiKey,
            authDomain: this.authDomain,
            projectId: this.projectId,
            storageBucket: this.storageBucket,
            messagingSenderId: this.messagingSenderId,
            appId: this.appId,
            databaseURL: this.databaseURL,
            measurementId: this.measurementId,
        }
    }

    /**
     * Set and saves twitch token
     * 
     * @param { iAccessToken } data
     */
    public setTwitchTokens(data: iAccessToken) {
        this.twitch.accessToken = data.accessToken;
        this.twitch.refreshToken = data.refreshToken;
        
        this.save();
    }

    /**
     * Saves current state of the config
     */
    public save() {
        fs.ensureFileSync(Config.path);
        fs.writeJsonSync(Config.path, this);
    }

    /**
     * Returns default configuration object
     * 
     * @returns { iConfigModule }
     */
    public static default(): iConfigModule {
        return {
            id: uuidv4(),
            apiKey: "AIzaSyDQfwetBDpebLJKu50O4oai9hZoNTBXKjE",
            authDomain: "company-of-heroes-twitch.firebaseapp.com",
            projectId: "company-of-heroes-twitch",
            storageBucket: "company-of-heroes-twitch.appspot.com",
            messagingSenderId: "271737567479",
            appId: "1:271737567479:web:9ec594152c54f1fb3c7bf2",
            databaseURL: 'https://company-of-heroes-twitch-default-rtdb.europe-west1.firebasedatabase.app/',
            measurementId: "G-CPQ1R9E1X5",
            cohLogPath: `${remote.app.getPath('documents')}\\My Games\\Company of Heroes Relaunch\\warnings.log`,
            twitch: {
                clientId: '67kqvxzgx6pvdyjlrkbmdty1kns90v',
                accessToken: '',
                refreshToken: '',
            }
        }
    }
}