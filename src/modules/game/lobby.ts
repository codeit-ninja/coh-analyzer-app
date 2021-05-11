import { authProvider, loadModule, LobbySlot, LobbySlotSteamData } from '@/modules/core.module';
import { ref, Ref } from 'vue';
import { Player } from './player';
import { Replay } from './replay';
import moment from 'moment';

/**
 * Company of Heroes game lobby  
 * 
 * Returns info about the lobby the streamer is in.  
 * Note that some info is only available if the streamer is hosting
 * or when the game has started. This is due to the limited info 
 * we can read out of the logfile.
 * 
 * All properties are private and should not be editable outside the class.  
 * This to prevent wrong information being emitted to the outside classes.
 * 
 * All properties in this class are being populated using events.
 * 
 * @author Richard Mauritz | FkNoobsCoH | Faith | [82AD] Red
 * @module Lobby
 */
export default class Lobby {
    /**
     * Is streamer hosting?
     * 
     * Returns a reactive property
     * 
     * @returns boolean
     */
    protected _host: Ref<boolean>;

    /**
     * Type of lobby
     * 
     * Returns `undefined` if streamer is not in a lobby  
     * Returns a reactive property
     * 
     * @returns undefined | 'AUTOMATCH' | 'BASIC_MATCH' | 'SKIRMISH'
     */
    protected _type: Ref<'' | 'AUTOMATCH' | 'BASIC_MATCH' | 'SKIRMISH'>;

    /**
     * Current lobby status
     * 
     * Returns `undefined` if streamer is not in a lobby  
     * Returns a reactive property
     * 
     * @returns 'HOSTING'|'IN_LOBBY'|'IN_GAME'|undefined
     */
    protected _status: Ref<'HOSTING'|'IN_LOBBY'|'IN_GAME'|'FINISHED'|undefined>;

    /**
     * Name of the map
     * 
     * Returns the index name of the map  
     * For example: 6p_red_ball_express
     * 
     * Returns a reactive property
     * 
     * @returns string
     */
    protected _map: Ref<string|''>;

    /**
     * List of slots available in the lobby
     * 
     * Only returns values when streamer is host, or game has started  
     * Returns a reactive property
     * 
     * @returns LobbySlot[]
     */
    protected _slots: Ref<LobbySlot[]>;

    /**
     * Returns all current players in the lobby
     * 
     * Returns players ONLY when the match has started.  
     * Returns a reactive property.
     * 
     * @returns Player[]
     */
    protected _players: Ref<Player[]>;

    /**
     * Size is the lobby
     * 
     * Return value can only be trusted when streamer is host 
     * or when game has started  
     * Returns a reactive property.
     * 
     * @returns number
     */
    protected _availableSlots: Ref<number>;

    /**
     * Outcome of the current match
     * 
     * Returns `WON` when streamer won else `LOST`  
     * Returns a reactive property
     * 
     * @returns WON|LOST
     */
    protected _outcome: Ref<'WON'|'LOST'|''>;

    /**
     * Array of promises
     * 
     * Used to fetch or store data but it needs to wait until we 
     * loaded all async data.
     * 
     * @returns Promise[]
     */
    #promises: Promise<any>[] = [];

    /**
     * Replay file
     * 
     * Returns the replay file, contains replay only on `GAME_ENDED`  
     * Returns a reactive property
     * 
     * @returns Replay
     */
    protected _replay: Ref<Replay|undefined>;

    /**
     * Is in a lobby?
     * 
     * Returns true when streamer is in a lobby  
     * Returns a reactive property
     * 
     * @returns boolean
     */
    protected _isActive: Ref<boolean>;
    
    constructor() {
        this._host = ref(false);
        this._type = ref('');
        this._status = ref(undefined);
        this._map = ref('');
        this._slots = ref([]);
        this._players = ref([]);
        this._availableSlots = ref(0);
        this._outcome = ref('');
        this._replay = ref(undefined);
        this._isActive = ref(false);

        loadModule('events').on('STARTED_HOSTING', () => this._host.value = true);
        loadModule('events').on('LEFT_LOBBY', () => this.reset());
        loadModule('events').on('LOBBY_TYPE_BASIC_MATCH', () => this.setType('BASIC_MATCH'));
        loadModule('events').on('LOBBY_TYPE_SKIRMISH', () => this.setType('SKIRMISH'));
        loadModule('events').on('SET_SLOT', (player) => this.fillSlot(player));
        loadModule('events').on('SET_LOBBY_AVAILABLE_SLOTS', (size) => this._availableSlots.value = size);
        loadModule('events').on('POPULATE_PLAYER', (player) => this.#promises.push(this.populatePlayer(player)));
        loadModule('events').on('SET_MAP', (name) => this.setMap(name));
        loadModule('events').on('GAME_STARTED', () => this.started());
        loadModule('events').on('GAME_ENDED', () => this.ended());
        loadModule('events').on('LOBBY_CLOSED', () => this.close());
        loadModule('events').on('SET_VICTORIOUS', playerId => this.setOutcome(playerId));
    }

    /**
     * Fills a slot with a player.
     * 
     * Fires on `SET_SLOT` event.
     * 
     * @param player LobbySlot
     */
    public fillSlot(player: LobbySlot) {
        let slotId = 0;

        if(this._availableSlots.value === 8) {
            if(player.playerIndex === 0) slotId = 0;
            if(player.playerIndex === 1) slotId = 2;
            if(player.playerIndex === 2) slotId = 4;
            if(player.playerIndex === 3) slotId = 6;
            if(player.playerIndex === 4) slotId = 1;
            if(player.playerIndex === 5) slotId = 3;
            if(player.playerIndex === 6) slotId = 5;
            if(player.playerIndex === 7) slotId = 7;
        }

        if(this._availableSlots.value === 6) {
            if(player.playerIndex === 0) slotId = 0;
            if(player.playerIndex === 1) slotId = 2;
            if(player.playerIndex === 2) slotId = 4;
            if(player.playerIndex === 3) slotId = 1;
            if(player.playerIndex === 4) slotId = 3;
            if(player.playerIndex === 5) slotId = 5;
        }

        if(this._availableSlots.value === 4) {
            if(player.playerIndex === 0) slotId = 0;
            if(player.playerIndex === 1) slotId = 2;
            if(player.playerIndex === 2) slotId = 1;
            if(player.playerIndex === 3) slotId = 3;
        }

        if(this._availableSlots.value === 2) {
            if(player.playerIndex === 0) slotId = 0;
            if(player.playerIndex === 1) slotId = 1;
        }
        console.log(this._availableSlots);
        this._slots.value[player.playerIndex] = {
            playerIndex: player.playerIndex,
            slotId: slotId,
            playerId: player.playerId,
            type: player.type,
            team: player.team,
            race: player.race,
        };
    }

    /**
     * Populate stats for an existing player in lobby.
     * 
     * Fires on `POPULATE_PLAYER` event.
     * 
     * @param slot LobbySlot
     */
    public async populatePlayer(slot: LobbySlotSteamData) {
        const slotIndex = this._slots.value.findIndex(s => s.slotId === slot.slotId);
        const player = await Player.load(this._slots.value[slotIndex], slot.steamId, slot.rank);

        if( player ) this._players.value.push(player);
    }

    /**
     * Set lobby stated to game started.
     * 
     * Fires when `GAME_STARTED` event occured
     */
    public async started() {
        const { steamId } = await authProvider();

        this._isActive.value = true;

        Promise.all(this.#promises).finally(() => {
            this._status.value = 'IN_GAME';

            loadModule('firebase').firestore
                .collection('users')
                .doc(steamId.toString())
                .collection('matches')
                .doc('current-match')
                .set(this.toObject());
        })
    }

    /**
     * Set lobby statsus to game ended.
     * 
     * Fires when `GAME_ENDED` event occured
     */
    public async ended() {
        this._status.value = 'FINISHED';
        this._replay.value = await Replay.latest();
    }

    /**
     * Sets the outcome of a match
     * 
     * If the `playerId` matches the streamers player id
     * it means he won. If no match and game has ended it means he lost.
     * 
     * @param playerId
     */
    public async setOutcome(playerId: number) {
        const { coh } = await authProvider();

        if(playerId === coh.id) {
            this._outcome.value = 'WON';
        }

        /**
         * We assume that if we cannot determine if player has won  
         * That he probaly lost the game or left early.
         */
        if( ! this._outcome.value ) {
            this._outcome.value = 'LOST';
        }
    }

    /**
     * Set name of the map
     * 
     * @param name 
     */
    public setMap(name: string) {
        this._map.value = name;
    }

    /**
     * Is streamer hosting?
     * Returns a reactive property
     * 
     * @returns boolean
     */
    public get hosting() {
        return this._host.value;
    }

    /**
     * Type of lobby
     * 
     * Returns `undefined` if streamer is not in a lobby  
     * Returns a reactive property
     * 
     * @returns undefined | 'AUTOMATCH' | 'BASIC_MATCH' | 'SKIRMISH'
     */
    public get type() {
        return this._type.value;
    }

    /**
     * Name of the map
     * 
     * Returns the index name of the map  
     * For example: 6p_red_ball_express
     * 
     * Returns a reactive property
     * 
     * @returns string
     */
     public get map() {
        return this._map.value;
    }

    /**
     * List of slots available in the lobby
     * 
     * Only returns values when streamer is host, or game has started  
     * Returns a reactive property
     * 
     * @returns LobbySlot[]
     */
    public get slots() {
        return this._slots.value;
    }

    /**
     * Returns all current players in the lobby
     * 
     * Returns players ONLY when the match has started.  
     * Returns a reactive property
     * 
     * @returns Player[]
     */
    public get players() {
        return this._players.value;
    }

    /**
     * List of slots available in the lobby
     * 
     * Only returns values when streamer is host, or game has started  
     * Returns a reactive property
     * 
     * @returns number
     */
    public get availableSlots() {
        return this._availableSlots.value;
    }

    /**
     * Outcome of the current match
     * 
     * Returns `WON` when streamer won else `LOST`  
     * Returns a reactive property
     * 
     * @returns WON|LOST
     */
    public get outcome() {
        return this._outcome.value;
    }

    /**
     * Replay file
     * 
     * Returns the replay file, contains replay only on `GAME_ENDED`  
     * Returns a reactive property
     * 
     * @returns Replay
     */
    public get replay() {
        return this._replay.value;
    }

    /**
     * Is in a lobby?
     * 
     * Returns true when streamer is in a lobby  
     * Returns a reactive property
     * 
     * @returns boolean
     */
    public get isActive() {
        return this._isActive.value;
    }

    /**
     * Set current match type.
     * 
     * @method
     * @param type '' | 'AUTOMATCH' | 'BASIC_MATCH' | 'SKIRMISH'
     */
    public setType(type: '' | 'AUTOMATCH' | 'BASIC_MATCH' | 'SKIRMISH') {
        this._type.value = type;
    }

    public toObject() {
        return {
            hosting: this.hosting,
            map: this.map,
            type: this.type,
            outcome: this.outcome,
            slots: this.availableSlots,
            players: this.players.map(player => player.toObject()),
            replay: this.replay?.downloadUrl || '',
            date: moment().toString(),
            isActive: this.isActive
        }
    }

    /**
     * Resets lobby
     * 
     * @returns Lobby
     */
    public reset() {
        //this._slots.value = [];

        //console.log('RESET ---------------------------------------------------------------')

        return this;
    }

    /**
     * Reset object initial values
     * 
     * Excecutes on `LOBBY_CLOSED` event
     * 
     * @returns void
     */
    public async close() {
        const { steamId } = await authProvider();

        await loadModule('firebase').firestore
            .collection('users')
            .doc(steamId.toString())
            .collection('matches')
            .add(this.toObject());

        this._host.value = false;
        this._type.value = '';
        this._status.value = undefined;
        this._map.value = '';
        this._slots.value = [];
        this._players.value = [];
        this._availableSlots.value = 0;
        this._outcome.value = '';
        this._replay.value = undefined;
        this._isActive.value = false;
    }
}

export interface iLobby {
    host: boolean;
    type: 'AUTOMATCH' | 'BASIC_MATCH' | 'SKIRMISH' | undefined;
    status: 'HOSTING'|'IN_LOBBY'|'IN_GAME'|'FINISHED';
    players: Player[];
    slots: number;
    outcome: 'WON'|'LOST'|'';
}