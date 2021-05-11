<template>
    <div class="app-crashed-notification d-flex flex-column align-items-center justify-content-center position-absolute top-0 h-100 w-100">
        <div class="app-crashed-notification-content text-center">
            <i class="bi bi-exclamation-octagon d-block fs-1 text-danger mb-2"></i>
            <h1 class="text-danger">Whoops</h1>
            <p class="mt-4 mb-1">{{error.message}}</p>
            <b class="d-block mb-4">{{error.data?.solve}}</b>
            <small>{{error.name}}</small>

            <div class="text-center d-flex justify-content-center">
                <button class="btn" id="dismiss-error" @click="close">Close</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { state } from '@/modules/core.module';

export default defineComponent({
    props: {
        error: Error
    },
    setup(props) {
        console.log(props.error);
        
        const close = () => state.error = null;

        return {
            close
        }
    },
})
</script>