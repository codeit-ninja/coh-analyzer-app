<template>
    <img :src="image" class="img-fluid" width="20" style="position: relative;top: -1px;" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        id: Number
    },
    setup(props) {
        let image = '';

        if(props.id === 0) {
            image = require('@/assets/flags/usa.png');
        } else if(props.id === 1) {
            image = require('@/assets/flags/wehrmacht.png');
        } else if(props.id === 2) {
            image = require('@/assets/flags/brits.png');
        } else {
            image = require('@/assets/flags/panzer-elite.png');
        }

        return {
            image
        }
    },
})
</script>
