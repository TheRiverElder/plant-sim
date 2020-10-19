<template>
    <div class="d-flex">
        <v-btn icon :disabled="numVal <= min" @click="mutate(-1)"><v-icon>mdi-minus</v-icon></v-btn>

        <v-text-field
            class="text-center ipt"
            type="number"
            v-model="numVal"
            dense
            hide-details
        />

        <v-btn icon :disabled="numVal >= max" @click="mutate(1)"><v-icon>mdi-plus</v-icon></v-btn>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        value: Number,
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
    },

    data() {
        return {
            numVal: 0,
        };
    },

    watch: {
        value(val) {
            this.mutate(val - this.numVal);
        },

        numVal(val) {
            this.$emit('input', val);
        },
    },

    methods: {
        mutate(delta: number) {
            this.numVal = Math.max(this.min, Math.min(this.numVal + delta, this.max));
        },
    },
});
</script>

<style scoped>
.ipt {
    width: 6em;
}
</style>