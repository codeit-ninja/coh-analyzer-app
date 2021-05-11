<script lang="ts">
import { loadModule } from '@/modules/core.module';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        loadModule('twitch').requestToken()
            .finally(() => window.location.href = "/");
    }
});
</script>
