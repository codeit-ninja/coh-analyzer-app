<template>
    <nav class="nav flex-column">
        <router-link v-for="route in items" :key="route" class="nav-link" :to="route.route">
            <i v-if="route.menuItemIcon" :class="route.menuItemIcon"></i>
            <span v-text="route.menuItemName"></span>
        </router-link>
    </nav>
</template>
<script lang="ts">
import { routes } from '@/modules/core.module';
import { defineComponent, inject } from 'vue'

export default defineComponent({
    setup() {
        const items = routes.filter(module => module.route && module.menuItemName);

        return {
            items
        }
    },
})
</script>
