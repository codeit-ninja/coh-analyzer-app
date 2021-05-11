<template>
    <section class="mb-4 pb-2">
        <h3 class="mb-4">Connected channel</h3>
        <div class="row mb-2">
            <div class="col-3">
                <span class="text-muted">Status</span>
            </div>
            <div class="col-8">
                <span class="badge bg-light text-dark" v-if="!streamStatus">Offline</span>
                <span class="badge bg-success" v-if="streamStatus">Online</span>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-3">
                <span class="text-muted">Name</span>
            </div>
            <div class="col-8">
                <span>{{channel.name}}</span>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-3">
                <span class="text-muted">Description</span>
            </div>
            <div class="col-8">
                <span>{{channel.status}}</span>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-3">
                <span class="text-muted">Followers</span>
            </div>
            <div class="col-8">
                <span>{{channel.followers}}</span>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-3">
                <span class="text-muted">Viewers</span>
            </div>
            <div class="col-8">
                <span>{{streamStatus ? streamStatus.viewers : 0}}</span>
            </div>
        </div>
    </section>
</template>
<script>
import { defineComponent } from 'vue';
import { useTwitchClient, doTokenRequest } from '@/modules/twitch.module';

export default defineComponent({
    async setup() {
        const { apiClient, authProvider } = useTwitchClient();

        authProvider.refresh();

        const channel = await apiClient.kraken.channels.getMyChannel();
        const streamStatus = await channel.getStream();

        return {
            channel,
            streamStatus
        }
    },
})
</script>
