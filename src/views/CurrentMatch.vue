<template>
    <div class="boxed">
        <h2 class="mb-5">
            <i class="bi bi-controller me-3"></i>
            Current match
        </h2>
        <section v-if="lobby?.isActive">
            <section class="mb-4">
                <h6>Setup</h6>
                <div class="row mb-1">
                    <div class="col-3">
                        <label>Map</label>
                    </div>
                    <div class="col-9">
                        <span>{{lobby?.map}}</span>
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col-3">
                        <label>Type</label>
                    </div>
                    <div class="col-9">
                        <span>{{lobby?.type.replace('_', ' ')}}</span>
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col-3">
                        <label>Slots</label>
                    </div>
                    <div class="col-9">
                        <span>{{lobby?.slots.length}}</span>
                    </div>
                </div>
                <div class="row mb-1">
                    <div class="col-3">
                        <label>Players</label>
                    </div>
                    <div class="col-9">
                        <span>{{lobby?.players.length}}</span>
                    </div>
                </div>
            </section>
            <h6>Team #1</h6>
            <table class="table table-borderless mb-4">
                <thead>
                    <tr>
                        <th width="20%">#</th>
                        <th width="50%">Player</th>
                        <th>Rank</th>
                        <th>Faction</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="player in getByTeam(lobby?.players, 0)" :key="player">
                        <td class="align-middle">
                            {{player.id}}
                        </td>
                        <td class="align-middle">
                            {{player.profile.alias}}
                        </td>
                        <td class="align-middle">
                            {{player.rank}}
                        </td>
                        <td class="align-middle">
                            <FactionIcon :id="player.race" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <h6>Team #2</h6>
            <table class="table table-borderless">
                <thead>
                    <tr>
                        <th width="20%">#</th>
                        <th width="50%">Player</th>
                        <th>Rank</th>
                        <th>Faction</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="player in getByTeam(lobby?.players, 1)" :key="player">
                        <td class="align-middle">
                            {{player.id}}
                        </td>
                        <td class="align-middle">
                            {{player.profile.alias}}
                        </td>
                        <td class="align-middle">
                            {{player.rank}}
                        </td>
                        <td class="align-middle">
                            <FactionIcon :id="player.race" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section v-else class="clearfix">
            <div class="alert alert-warning">
                You are currently not in a lobby, start a game to see the current match info.
            </div>
            <button class="btn btn-link float-end">
                View last match
                <i class="bi bi-arrow-right me-0 ms-3"></i>
            </button>
        </section>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { loadModule } from '@/modules/core.module';
import { orderBy, filter } from 'lodash';
import FactionIcon from '@/components/game/FactionIcon.vue';

export default defineComponent({
    setup() {
        const orderByTeam = (players: any) => orderBy(players, 'team', 'asc');
        const getByTeam = (players: any, id: number) => filter(players, ['team', id]);

        const lobby = loadModule('lobby');
        
        return {
            lobby,
            orderByTeam,
            getByTeam
        }
    },
	components: { 
        FactionIcon 
    }
})
</script>
