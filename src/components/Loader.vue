<template>
    <div class="d-flex flex-column align-items-center justify-content-center h-100" v-if="loading">
        <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
            <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                <animateTransform 
                    attributeName="transform" 
                    attributeType="XML" 
                    type="rotate"
                    dur=".7s" 
                    from="0 50 50"
                    to="360 50 50" 
                    repeatCount="indefinite" />
            </path>
        </svg>
        <div class="loading-text">
            Upgrading 88mm Tiger canon to 140mm variant.
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        loading: Boolean
    },
    setup(props) {
        //
    },
})
</script>

<style lang="scss" scoped>
svg {
    width: 80px;
    height: 80px;
}
</style>