import moment from "moment";
import { isString } from "lodash";
import { useRoute } from 'vue-router';
import axios from 'axios';
import { LobbySlot, LobbySlotSteamData } from "@/modules/core.module";

export const http = {
    get: async <T>(url: string) => await (await axios.get<T>(url)).data,
    post: async <T>(url: string, data?: any) => await (await axios.post<T>(url, data)).data
}

export function buildTwitchAuthUri( clientId: string, redirectUri: string, scopes: string[] ) {
    const query = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scopes.join(' '),
        force_verify: 'true'
    });

    return 'https://id.twitch.tv/oauth2/authorize?' + query;
}

export function buildTwitchTokenUri( clientId: string, clientSecret: string, redirectUri: string, refreshToken?: string ) {
    const urlParams = new URLSearchParams(window.location.search);
    const params: any = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: refreshToken ? 'refresh_token' : 'authorization_code',
    };

    if(refreshToken) {
        params.refresh_token = refreshToken;
    } else {
        params.redirect_uri = redirectUri;
        params.code = urlParams.get('code');
    }

    console.log(params);

    return 'https://id.twitch.tv/oauth2/token?' + new URLSearchParams( params );
}

export function buildTwitchRefreshTokenUri( clientId: string, clientSecret: string, refreshToken: string ) {
    const query = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
    });

    return 'https://id.twitch.tv/oauth2/token?' + query;
}

export function setStorageItem(key: string, val: any) {
    return localStorage.setItem(key, isString(val) ? val : JSON.stringify( val ));
}

export function getStorageItem(key: string): any {
    let item = localStorage.getItem(key) || '';

    if( isJSON( item ) ) {
        item = JSON.parse( item );
    }

    if( moment(item).isValid() ) {
        return moment(item).toDate();
    }

    return item;
}

export function isJSON(value: string) {
    try {
        const obj = JSON.parse(value);
        if (obj && typeof obj === 'object' && obj !== null) {
            return true;
        }
    } catch (err) {
        // to shut up eslint
    }
    
    return false;
}

export function parseSlotRegex(slot: { [key: string]: string; }): LobbySlot {
    return {
        playerIndex: parseInt(slot.playerIndex),
        playerId: parseInt(slot.playerId),
        type: parseInt(slot.type),
        team: parseInt(slot.team),
        race: parseInt(slot.race),
    }
}

export function parsePlayerRegex(player: { [key: string]: string; }): LobbySlotSteamData {
    return {
        steamId: BigInt(player.steamId),
        slotId: parseInt(player.slotId),
        rank: parseInt(player.rank)
    }
}