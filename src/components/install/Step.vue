<template>
    <div class="flex items-start mb-5">
        <svg v-if="step.state.processing" class="animate-spin mt-0.5 mr-2 h-4 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <CheckCircle v-if="step.state.succeeded" size="1.3x" class="text-green-700 mr-2" />
        <ExclamationCircle v-if="step.state.error" size="1.3x" class="text-red-700 mr-2" />
        <span class="-mt-0.5">
            {{step.description}}
            <span class="block text-red-700">{{step.state.error?.message}}</span>
        </span>
    </div>
</template>
<script  lang="ts">
import { CheckCircle, ExclamationCircle } from 'vue-next-heroicons/solid';
import { InstallationStep } from '@/modules/installation/steps/base.module';
import { PropType, defineComponent } from 'vue';
import { remote } from 'electron';

export default defineComponent({
    props: {
        step: {
            type: Object as PropType<InstallationStep>,
            required: true
        }
    },
    components: {
        CheckCircle,
        ExclamationCircle
    }
});
</script>