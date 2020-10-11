<template>
    <div>
        
        <div class="d-flex">
            <v-text-field
                class="flex-grow-1"
                v-model="text"
            />

            <v-btn text @click="execute">Exec</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import game from '@/game/game';
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            text: '',
        };
    },

    methods: {
        execute() {
            game._execute(this.text);
        }
    },
})
</script>