import { Ref, ref } from "@vue/reactivity";
import { Profile } from "../steam/profile";

export class Streamer {
    #steamId: BigInt|null = null;

    #steamProfile: Profile|null = null;

    public async init( steamId: BigInt ) {
        this.#steamId = steamId;
        this.#steamProfile = await Profile.getBySteamId( steamId );

        console.log(this.steamProfile)
    }

    public get steamId() {
        return this.#steamId;
    }

    public get steamProfile() {
        return this.#steamProfile;
    }
}