<template>
    <div class="boxed">
        <h2 class="mb-5">
            <i class="bi bi-layers me-3"></i>
            Setup
        </h2>
        <section v-if="!state.installing">
            <p>
                Before we can start we need some basic information.
            </p>
            <form novalidate @submit.prevent="submit">
                <div class="mb-2">
                    <label class="form-label">Steam ID</label>
                    <input
                        type="text" 
                        class="form-control" 
                        placeholder="Your steam ID, eg: 76561198036527204" 
                        v-model="steamId"
                        :class="{
                            'is-valid': !state.error && state.isValidated,
                            'is-invalid': state.error && state.isValidated
                        }"
                        :valid="!state.error"
                    />
                    <span class="invalid-feedback">{{state.error?.message}}</span>
                </div>
                <div class="mb-2" v-if="state.isValidated && !state.error">
                    <label class="form-label">Profile</label>
                    <div>
                        {{state.profile?.alias}}
                    </div>
                    <div class="form-text text-warning fs-6">
                        <i class="bi bi-exclamation-circle me-2"></i>
                        Make sure that the name shown above matches your ingame name.
                    </div>
                </div>
                <div class="mb-2 mt-2 clearfix" v-if="state.isValidated && !state.error">
                    <button class="btn btn-primary float-end">Confirm</button>
                </div>
            </form>
        </section>
        <section v-else>
            <ul class="list-unstyled">
                <li v-for="step in Installation.steps" :key="step" class="d-flex align-items-center mb-3">
                    <span class="spinner-border spinner-border-sm me-3" role="status" v-if="!step.done"></span>
                    <span class="bi bi-check-circle me-3 text-success" v-else></span>
                    <span>{{step.name}}</span>
                </li>
            </ul>
        </section>
    </div>
</template>
<script>
import { debounce } from 'lodash';
import { computed, defineComponent, reactive, watch } from 'vue';
import { Profile } from '@/modules/steam/profile';
import { Installation } from '@/modules/installation/installation.module';

export default defineComponent({
    setup() {
        const state = reactive({
            steamId: '',
            profile: null|Profile,
            error: null|Error,
            validating: false,
            isValidated: false,
            installing: false
        })
        const steamId = computed({
            get: () => {
                return state.steamId;
            },
            set: debounce(val => state.steamId = val, 50)
        });

        watch(steamId, async id => {
            if(!id) return;

            state.isValidated = false;
            state.validating = true;
            state.error = null;

            try {
                state.profile = await Profile.getBySteamId(BigInt(id));
            }
            catch(error) {
                if(error.name === 'SyntaxError') {
                    state.error = new Error('Not a valid steamID');
                }
            }

            if(!state.profile) {
                state.error = new Error('No profile found for ' + id);
            }
            
            state.isValidated = true;
            state.validating = false;
        });

        const submit = async () => {
            state.installing = true;
            await Installation.start(state.steamId, state.profile);

            window.location.href = 'app://./index.html'
        }

        return {
            state,
            steamId,
            submit,
            Installation
        }
    },
})
</script>