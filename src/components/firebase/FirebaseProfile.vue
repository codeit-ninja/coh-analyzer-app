<template>
    <h6>Connected Company of Heroes account</h6>
    <table class="table table-borderless">
        <tbody>
            <tr>
                <td width="25%"><label class="form-label">CoH player ID</label></td>
                <td>{{profile?.id}}</td>
            </tr>
            <tr>
                <td><label class="form-label">Steam ID</label></td>
                <td>{{profile?.steamId}}</td>
            </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { loadModule } from '@/modules/core.module';
import firebase from 'firebase';

export default defineComponent({
    props: {
        user: {
            required: true,
            type: Object
        }
    },
    setup(props) {
        const profile = ref<firebase.firestore.DocumentData | undefined>(undefined);

        onMounted( async () => {
            loadModule('firebase').firestore.collection('users').doc(props.user.uid).get().then(doc => {
                profile.value = doc.data();
            });
        });

        return {
            profile
        }
    },
})
</script>
