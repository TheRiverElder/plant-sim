<template>
    <v-card
        :class="classes"
        @click="$emit('click', value.uid, $event)"
        @mousedown="$emit('mousedown', value.uid, $event)"
    >
        <img
            class="flex-grow-0 my-2 mr-3"
            :width="iconSize"
            :height="iconSize"
            contain
            :src="icon"
        />

        <div :class="'flex-grow-1 flex-shrink-1 text-left d-flex' + (line ? ' align-center' : ' flex-column')">
            <h4 class="my-1">{{ name }}</h4>

            <span v-if="!dense" class="text-subtitle-1 grey--text px-5" v-text="desc"/>

            <div class="d-flex flex-grow-1">
                <v-progress-linear
                    v-for="pair of properties"
                    class="flex-grow-1 mx-2"
                    :key="pair.key"
                    :color="pair.color"
                    :value="pair.progress"
                    :height="20"
                    striped
                >
                    <i v-if="dense" class="bar-text">{{ pair.valueStr }}</i>

                    <i v-else class="bar-text"
                        >{{ textOf(pair.key) }}: {{ pair.valueStr }}</i
                    >
                </v-progress-linear>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts">
import { nameOf, iconOf, descOf, textOf } from "../utils/resources";
import Vue from "vue";
import { UnitData } from '@/game/interface/common-interfaces';

export default Vue.extend({
    name: "UnitInfo",

    props: {
        value: Object,
        disabled: {
            type: Boolean,
            default: false,
        },
        dense: {
            type: Boolean,
            default: false,
        },
        line: {
            type: Boolean,
            default: false,
        },
        iconSize: {
            type: Number,
            default: 64,
        },
    },

    computed: {
        classes() {
            return ['d-flex', this.disabled ? 'disabled' : '', this.line ? 'pa-1' : 'pa-2'].join(' ');
        },

        properties() {
            const unit = this.value as UnitData;
            return [
                { key: 'heat', color: 'red', valueStr: unit.heat.toFixed(2), progress: unit.heat / 1e4 },
                { key: 'mass', color: 'yellow', valueStr: unit.mass.toFixed(2), progress: unit.mass / 1e3 },
                { key: 'duration', color: 'green', valueStr: (unit.duration * 100).toFixed(2) + "%", progress: unit.duration * 100 },
            ];
        },

        icon() {
            return iconOf(this.value.protoId);
        },

        desc() {
            return descOf(this.value.protoId);
        },

        name() {
            return nameOf(this.value.protoId);
        },
    },

    methods: {
        textOf,
    },
});
</script>

<style scoped>
.disabled {
    cursor: not-allowed;
    opacity: 0.6;
    filter: grayscale(100%);
}
.bar-text {
    color: gray;
    text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
}
</style>