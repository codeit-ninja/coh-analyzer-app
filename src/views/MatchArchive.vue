<template>
    <div class="boxed">
        <h2 class="mb-5">
            <i class="bi bi-clock me-3"></i>
            Match history
        </h2>
        <h6 class="mb-3">Overview</h6>
        <form class="mb-4">
            <div class="row row-cols-4">
                <div>
                    <label class="form-label">Date</label>
                    <select class="form-select form-select-sm" v-model="filter.date">
                        <option value="desc">Newest to old</option>
                        <option value="asc">Oldest to new</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Outcome</label>
                    <select class="form-select form-select-sm" v-model="filter.outcome">
                        <option value="all">Show all</option>
                        <option value="WON">Won</option>
                        <option value="LOST">Lost</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Match type</label>
                    <select class="form-select form-select-sm" v-model="filter.type">
                        <option value="all">Show all</option>
                        <option value="SKIRMISH">Skirmish</option>
                        <option value="BASIC_MATCH">Basic match</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Map</label>
                    <select class="form-select form-select-sm">
                        <option>Redball express</option>
                        <option>Angoville</option>
                        <option>Route N13</option>
                        <option>Duclair</option>
                    </select>
                </div>
            </div>
        </form>
        <div v-if="archive.length > 0">
            <div class="match match--quikview" v-for="match in archive" :key="match">
                <div class="row align-items-center">
                    <div class="col-3">
                        {{moment(match.date).format('DD-MM-YYYY')}}
                    </div>
                    <div class="col-4">
                        {{match.map || 'unknown'}}
                    </div>
                    <div class="col-2">
                        <span class="badge" 
                            :class="{
                                'bg-danger': match.outcome === '' || match.outcome.toLowerCase() === 'lost',
                                'bg-success': match.outcome.toLowerCase() === 'won',
                            }">
                            {{match.outcome || 'lost'}}
                        </span>
                    </div>
                    <div class="col-3">
                        {{match.type || 'unknown'}}
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="alert alert-warning">
                No matches found, they will appear here as soon as you start playing the game :)
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import moment from 'moment';
import { defineComponent, onMounted, reactive, watch } from 'vue'
import { getMatchHistory, archive } from '@/modules/game/matches';

export default defineComponent({
    setup() {
        const filter = reactive({
            outcome: 'all',
            type: 'all',
            date: 'desc'
        })

        onMounted( async () => {
            await getMatchHistory({
                filter: filter,
            });
        });

        watch(filter, () => {
            getMatchHistory({
                filter: filter
            })
        })

        return {
            archive,
            moment,
            filter
        }
    },
})
</script>
