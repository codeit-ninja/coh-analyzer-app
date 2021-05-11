<template>
    <h6>Connected Twitch account</h6>
    <section v-if="!isLoggedIn">
        <div class="alert alert-warning d-flex align-items-center mt-3" role="alert">
            <i class="bi bi-exclamation-octagon me-2"></i>
            <span>Click on the button to connect.</span>
            <button class="btn btn-outline-primary ms-auto" @click="connect">
                <i class="bi bi-twitch"></i>
                <span>connect</span>
            </button>
        </div>
    </section>
    <section v-else>
        <table class="table table-borderless">
            <tbody>
                <tr>
                    <td class="ps-0" width="25%">
                        <label class="form-label">Twitch user ID</label>
                    </td>
                    <td>{{user?.id}}</td>
                </tr>
                <tr>
                    <td class="ps-0">
                        <label class="form-label">Username</label>
                    </td>
                    <td>{{user?.name}}</td>
                </tr>
                <tr>
                    <td class="ps-0">
                        <label class="form-label">Email</label>
                    </td>
                    <td>{{user?.email}}</td>
                </tr>
                <tr>
                    <td class="ps-0">
                        <label class="form-label">Views</label>
                    </td>
                    <td>{{user?.views}}</td>
                </tr>
            </tbody>
        </table>
    </section>
    <!-- <h6 class="mt-4">Company of Heroes</h6>
    <section>
        <form>
            <div class="mb-2">
                <label class="form-label">Path to warnings.log</label>
                <div class="input-group">
                    <input type="text" class="form-control" v-model="App.config.cohLogPath" />
                    <button class="btn btn-outline-primary" type="button">
                        <span>select file</span>
                    </button>
                </div>
                <span v-if="state.config.exists" class="form-validated form-validated-success">
                    <i class="bi bi-check-circle"></i>
                    <span>File validated</span>
                </span>
                <span v-else class="form-validated form-validated-error">
                    <i class="bi bi-exclamation-circle"></i>
                    <span>File not found</span>
                </span>
            </div>
        </form>
    </section> -->
</template>
<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { HelixPrivilegedUser } from 'twitch';
import { loadModule } from '@/modules/core.module';

export default defineComponent({
    props: {
        isLoggedIn: Boolean,
        user: HelixPrivilegedUser
    },
    setup(props) {
        const connect = () => loadModule('twitch').authenticate()
        
        return {
            connect,
            ...toRefs(props)
        }
    },
})
</script>
