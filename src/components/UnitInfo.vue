<template>
    <v-card
        :class="classes"
        @click="$emit('click', value)"
        @mousedown="$emit('mousedown', value.uid, $event)"
    >
        <v-img
            class="flex-grow-0 my-2 mr-3"
            width="64"
            height="64"
            contain
            :src="icon"
        />

        <div class="flex-grow-1 text-left d-flex flex-column">
            <h4 class="my-2">{{ name }}</h4>

            <span v-if="!dense" class="text-subtitle-1 grey--text px-5">{{
                desc
            }}</span>

            <div class="d-flex">
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
import { UnitData } from "@/game/interfaces";
import { nameOf, iconOf, descOf, textOf } from "../utils/resources";
import Vue from "vue";

const visiblePropertyKeys = [
    {
        key: "heat",
        color: "red",
        toValueStr: (v: number) => v.toFixed(2),
        toProgress: (v: number) => v / 1e3,
    },
    {
        key: "mass",
        color: "yellow",
        toValueStr: (v: number) => v.toFixed(2),
        toProgress: (v: number) => v / 1e4,
    },
    {
        key: "duration",
        color: "green",
        toValueStr: (v: number) => (v * 100).toFixed(2) + "%",
        toProgress: (v: number) => v * 100,
    },
];

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
    },

    computed: {
        classes() {
            return ['pa-2', this.disabled ? 'disabled' : ''];
        },

        properties() {
            const unit = this.value as UnitData;
            return visiblePropertyKeys.map(
                ({ key, color, toValueStr, toProgress }) => ({
                    key,
                    color,
                    value: unit[key] || 0,
                    valueStr: toValueStr(unit[key]),
                    progress: toProgress(unit[key]),
                })
            );
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