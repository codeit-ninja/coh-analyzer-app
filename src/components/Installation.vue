<template>
    <div class="mt-4 p-6 m-auto w-6/12 bg-white shadow-md rounded">
        <h1 class="text-xl mb-7 font-semibold">Request token</h1>
        <p class="mb-4">
            Before we can communicate with Twitch we need to request an access token.
        </p>
        <button class="bg-purple-700 text-white rounded py-2 px-4">Authorize with Twitch</button>
        <!-- <div v-if="isConnectedTwitch">
            <InstallationStep v-for="step in Installation.steps" :key="step" :step="step" />
        </div> -->
    </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { runSetup } from '@/modules/setup.module';
//import InstallationStep from '@/components/install/Step';

export default defineComponent({
    setup() {
        const isConnectedTwitch = ref(false);
        const { Installation } = runSetup();

        return {
            isConnectedTwitch,
            Installation
        }
    },
    components: {
        //InstallationStep
    }
})
</script>