<template>
    asd
</template>
<script lang="ts">
import Player from '@/modules/player.module'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    props: {
        player: {
            type: Player,
            required: true
        }
    },
    setup(props) {
        console.log(props);
    },
})
</script>
