<template>
    <div class="boxed">
        <h2 class="mb-5">
            <i class="bi bi-speedometer2 me-3"></i>
            Dashboard
        </h2>
        <div class="mb-4">
            <FirebaseProfile :user="firebaseUser" v-if="firebaseUser" />
        </div>
        <div class="mb-4">
            <TwitchProfile :is-logged-in="isLoggedIn" :user="twitchUser" />
        </div>
    </div>
</template>
<script>
import { ref, defineComponent, onMounted } from 'vue'
import { loadModule, authProvider } from '@/modules/core.module';
import TwitchProfile from '@/components/twitch/Profile.vue';
import FirebaseProfile from '@/components/firebase/FirebaseProfile.vue';
import { sortBy } from 'lodash';

export default defineComponent({
    setup() {
        const twitchUser = ref(null);
        const firebaseUser = ref(null);
        const isLoggedIn = ref(!loadModule('twitch').isExpired())
        const lobby = loadModule('lobby');        

        onMounted(async () => {
            const auth = await authProvider();

            twitchUser.value = auth.twitch;
            firebaseUser.value = auth.firebase;
        })
        
        // const twitchUser = authProvider().twitch;
        // const firebaseUser = authProvider().firebase;
        // const isLoggedIn = ref(!loadModule('twitch').isExpired())
        // const lobby = loadModule('lobby');

        const sort = stats => sortBy(stats, 'mode');
        
        return {
            isLoggedIn,
            twitchUser,
            firebaseUser,
            lobby,
            sort
        }
    },
    components: {
        TwitchProfile,
        FirebaseProfile
    }
})
</script>
