import { toHandlers } from "@vue/runtime-core";
import { LobbySlot } from "../core.module";
import { Profile } from "../steam/profile";

export class Player {
    protected _id: number;

    protected _steamId: BigInt;

    protected _slotId: number;

    protected _team: number;

    protected _rank: number;

    protected _race: number;

    protected _profile: Profile;

    constructor(player: LobbySlot, steamId: BigInt, rank: number, profile: Profile) {
        this._id = player.playerId;
        this._steamId = steamId;
        this._slotId = player.slotId as number;
        this._team = player.team;
        this._race = player.race;
        this._rank = rank;
        this._profile = profile;
    }

    public static async load(player: LobbySlot, steamId: BigInt, rank: number) {
        const profile = await Profile.getBySteamId(steamId);

        if( profile ) return new Player(player, steamId, rank, profile);

        return null;
    }

    public get id() {
        return this._id;
    }

    public get steamId() {
        return this._steamId;
    }

    public get slotId() {
        return this._slotId;
    }

    public get team() {
        return this._team;
    }

    public get rank() {
        return this._rank;
    }

    public get race() {
        return this._race;
    }

    public get profile() {
        return this._profile;
    }

    public toObject() {
        return {
            id: this.id,
            steamId: this.steamId.toString(),
            slotId: this.slotId,
            team: this.team,
            rank: this.rank,
            race: this.race,
            profile: this.profile.toObject()
        }
    }
}