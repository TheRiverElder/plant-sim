<template>
    <v-app id="app" class="fill-y">
        <v-app-bar 
            app 
            dark 
            color="primary" 
            class="d-flex"
            clipped-left
        >
            <v-img 
                height="100%"
                width="64px"
                contain
                src="plant-sim-logo.png"
            />

            <Terminal class="flex-grow-1"/>
        </v-app-bar>

        <v-navigation-drawer app permanent clipped>
            <v-list>
                <v-list-item
                    v-for="route of routes"
                    :key="route.path"
                    :to="route.path"
                >{{ route.name }}</v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main class="fill-y">
            <router-view class="fill-y" />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Terminal from '@/components/Terminal.vue';
import { routes } from '@/router'

export default Vue.extend({
    components: {
        Terminal,
    },

    data() {
        return {
            routes: routes,
        };
    },

    created() {
        this.$store.dispatch('initialize');
    }
})
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

html, body, #app {
    width: 100%;
    height: 100%;
}

.fill {
    width: 100%;
    height: 100%;
}

.fill-y {
    height: 100%;
}

.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.overflow-auto {
    overflow: auto;
}
</style>
