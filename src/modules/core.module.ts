import Root from '@/App.vue';
import Config from '@/config';

import { iCoreModules } from "app"; 
import { createApp, reactive } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { EventEmitter } from 'events';
import Log from '@/modules/game/log';
import Twitch from './twitch/twitch.module';
import Lobby from './game/lobby';
import { Firebase } from '@/modules/firestore/firestore';
import { AuthUser } from './authentication/AuthUser';
import { Auth } from './twitch/auth';
import { getStorageItem } from '@/functions/helpers';

export type LobbySlot = {
    slotId?: number;
    playerIndex: number;
    playerId: number;
    type: number;
    team: number;
    race: number;
}

export type LobbySlotSteamData = {
    steamId: BigInt;
    slotId: number;
    rank: number;
}

export type GameEvents = {
    'LAUNCHED_GAME': () => void;
    'LOAD_STREAMER_PROFILE': (steamdId: BigInt) => void;
    'STARTED_HOSTING': () => void;
    'JOINED_LOBBY': () => void;
    'LEFT_LOBBY': () => void;
    'SET_LOBBY_AVAILABLE_SLOTS': (size: number) => void;
    'LOBBY_TYPE_BASIC_MATCH': () => void;
    'LOBBY_TYPE_SKIRMISH': () => void;
    'SET_SLOT': (player: LobbySlot) => void;
    'POPULATE_PLAYER': (player: LobbySlotSteamData) => void;
    'SET_MAP': (map: string) => void;
    'LOBBY_RESET': () => void;
    'GAME_STARTED': () => void;
    'GAME_ENDED': () => void;
    'LOBBY_CLOSED': () => void;
    'SET_VICTORIOUS': (playerId: number) => void;
}

export interface iCore {
    start(): void;
    modules: iCoreModules;
}

type AppState = {
    loading: boolean;
    ready: boolean;
    error: Error|null;
}

export const state = reactive<AppState>({
    loading: true,
    ready: false,
    error: null
});
export const routes = Config.routes;
export const vue = createApp(Root);
export const router = createRouter({ history: createWebHistory(process.env.BASE_URL), routes: routes.map(route => route.route)});

type Modules = {
    events: EventEmitter,
    twitch: Twitch,
    twitch2: Auth;
    log: Log,
    lobby: Lobby,
    firebase: Firebase
}

type Constructable = {
    new(): any;
}

/**
 * List of registered modules
 */
const modules: { 
    [k: string]: any
} = {};

let authPrvdr: AuthUser;

/**
 * Register
 * 
 * Adds a module to the core
 * 
 * @param name 
 * @param module 
 */
export const registerModule = <K extends string, T>(name: K, module: Constructable|Auth) => {
    if( modules[name] ) return;

    if( typeof module === 'function' ) {
        modules[name] = new module();
    } else {
        modules[name] = module;
    }
}
/**
 * Load
 * 
 * Loads a module from the core
 * 
 * @param name 
 * @returns 
 */
export const loadModule = <K extends keyof Modules>(name: K): Modules[K] => {
    if( modules[name] ) {
        return modules[name];
    }
    
    throw new Error('Module not found.');
}
/**
 * Register auth provider  
 * 
 * Make sure to only register it once  
 * unless you know what you are doing
 * 
 * @param provider AuthUser
 */
export const registerAuthProvider = (provider: AuthUser) => {
    authPrvdr = provider;
}
/**
 * Get the authProvider.
 * 
 * Has an interval which makes sure the authProvider exists.  
 * If the authprovider is indefined will throw Error object.  
 * 
 * The error will result in a App crash state.
 * 
 * @returns AuthUser
 * @throws Error
 */
export const authProvider = () => {
    return new Promise<AuthUser>(resolve => {
        let count = 0;
        const validateProvider = setInterval(() => {
            count++;

            if(authPrvdr) {
                clearInterval(validateProvider);
                return resolve(authPrvdr);
            }

            if(count === 10) {
                clearInterval(validateProvider);
                state.error = new Error('Something went wrong.');
            }
        }, 500);
    })
}

registerModule('events', EventEmitter);
registerModule('twitch', Twitch);
registerModule('log', Log);
registerModule('lobby', Lobby);
registerModule('firebase', Firebase);

window.addEventListener('error', (e) => {
    console.log(e.error.message);
})