import config from '@/config';
import { readFileSync, statSync } from 'fs-extra';
import { difference } from 'lodash';
import { loadModule } from '@/modules/core.module';
import { parsePlayerRegex, parseSlotRegex } from '@/functions/helpers';

const LAUNCHED_GAME = 'RELICCOH started';
const STREAMERS_STEAM_ID = /Found profile: \/steam\/(?<steamId>\d+)/;
const STARTED_HOSTING = 'RLINK -- starting online hosting';
const JOINED_LOBBY = 'RLINK -- JoinAsync: Starting AsyncJob...';
const LEFT_LOBBY = 'Disconnect called with reasonID 1005 - clicked back';
const SET_LOBBY_AVAILABLE_SLOTS = /GameSetupForm::SetScenarioFile[\s-]+(?<availableSlots>\d)/;
const SET_LOBBY_AVAILABLE_SLOTS_2 = /players=(?<availableSlots>\d)/;
const SET_LOBBY_AVAILABLE_SLOTS_3 = /Player Count: (?<availableSlots>\d)/;
const LOBBY_TYPE_BASIC_MATCH = 'GameSetupForm - UpdateMatchType: Setting match type to 0: BASIC_MATCH';
const LOBBY_TYPE_SKIRMISH = 'GameSetupForm - UpdateMatchType: Setting match type to 14: CLASSIC_COOP_SKIRMISH';
const SET_SLOT = /Player (?<playerIndex>[#\d])+ - \[Id (?<playerId>\d+|-1), Type (?<type>\d+), Team (?<team>\d+), Race (?<race>\d+)\]|Player ([#\d])+ - Closed/;
const POPULATE_PLAYER = /\[[\d:a-z]+ \/steam\/(?<steamId>\d+)\], slot =\s+(?<slotId>\d), ranking =\s+(?<rank>\d+|-1)/;
const SET_MAP = /\*\*\* Beginning mission (?<map>\w+)/;
const RESET_LOBBY = 'GameInfo::ResetInfo';
const GAME_STARTED = /APP -- Game Start/;
const GAME_ENDED = /GameObj::DoGameOverPopup/;
const LOBBY_CLOSED = /APP -- Game Stop/;
const SET_AS_VICTORIOUS = /\[(?<playerId>\d+)\] as victorious ally/;

export default class Log {
    #prevState = this.currState;

    #isParsing = false;

    constructor() {
        setInterval( this.watch.bind(this), 50 );
    }

    protected watch() {
        if(this.#prevState.size !== this.currState.size && ! this.#isParsing) {
            this.#isParsing = true;

            this.parse(difference(this.currState.lines, this.#prevState.lines));
            this.#prevState = this.currState;
        }

        this.#isParsing = false;
    }

    protected parse(lines: string[]) {
        lines.forEach(line => this.fireEventIfExists(line));
    }

    protected fireEventIfExists(line: string) {
        //console.log(line);

        if( line.match(LAUNCHED_GAME) ) loadModule('events').emit('LAUNCHED_GAME');
        if( line.match(STARTED_HOSTING) ) loadModule('events').emit('STARTED_HOSTING');
        if( line.match(LEFT_LOBBY) ) loadModule('events').emit('LEFT_LOBBY');
        if( line.match(JOINED_LOBBY) ) loadModule('events').emit('JOINED_LOBBY');
        if( line.match(LOBBY_TYPE_BASIC_MATCH) ) loadModule('events').emit('LOBBY_TYPE_BASIC_MATCH');
        if( line.match(LOBBY_TYPE_SKIRMISH) ) loadModule('events').emit('LOBBY_TYPE_SKIRMISH');
        if( line.match(RESET_LOBBY) ) loadModule('events').emit('LOBBY_RESET');
        if( line.match(GAME_STARTED) ) loadModule('events').emit('GAME_STARTED');
        if( line.match(GAME_ENDED) ) loadModule('events').emit('GAME_ENDED');
        if( line.match(LOBBY_CLOSED) ) loadModule('events').emit('LOBBY_CLOSED');

        const streamerSteamId = line.match(STREAMERS_STEAM_ID);
        if( streamerSteamId && streamerSteamId.groups ) loadModule('events').emit('LOAD_STREAMER_PROFILE', BigInt( streamerSteamId.groups.steamId ));

        const slotCount = line.match(SET_LOBBY_AVAILABLE_SLOTS);
        if( slotCount && slotCount.groups ) loadModule('events').emit('SET_LOBBY_AVAILABLE_SLOTS', parseInt(slotCount.groups.availableSlots));

        const slotCount_2 = line.match(SET_LOBBY_AVAILABLE_SLOTS_2);
        if( slotCount_2 && slotCount_2.groups ) loadModule('events').emit('SET_LOBBY_AVAILABLE_SLOTS', parseInt(slotCount_2.groups.availableSlots));

        const slotCount_3 = line.match(SET_LOBBY_AVAILABLE_SLOTS_3);
        if( slotCount_3 && slotCount_3.groups ) loadModule('events').emit('SET_LOBBY_AVAILABLE_SLOTS', parseInt(slotCount_3.groups.availableSlots) * 2);

        const slot = line.match(SET_SLOT);
        if( slot && slot.groups ) loadModule('events').emit('SET_SLOT', parseSlotRegex(slot.groups));

        const player = line.match(POPULATE_PLAYER);
        if( player && player.groups ) loadModule('events').emit('POPULATE_PLAYER', parsePlayerRegex(player.groups));

        const map = line.match(SET_MAP);
        if( map && map.groups ) loadModule('events').emit('SET_MAP', map.groups.map);

        const checkIfVictory = line.match(SET_AS_VICTORIOUS);
        if( checkIfVictory && checkIfVictory.groups ) loadModule('events').emit('SET_VICTORIOUS', parseInt(checkIfVictory.groups.playerId));
    }

    protected get currState() {
        const size = statSync(config.logPath).size;
        const content = readFileSync(config.logPath, { encoding: 'ascii' });
        const lines = content.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);

        return { size, content, lines }
    }
}