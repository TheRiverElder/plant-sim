<template>
    <div ref="layout">
        <div v-for="y of height" :key="y" class="d-flex">
            <span
                v-for="x of width"
                :key="x"
                class="cell"
                @click="$emit('click', posOf(x, y), $event)"
                @mouseup="$emit('mouseup', posOf(x, y), $event)"
            >
                <img
                    :width="actualCellWidth"
                    :height="actualCellWidth"
                    :src="iconAt(x - 1, y - 1)"
                />
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { iconOf } from "@/utils/resources";
import { UnitData } from '@/game/interfaces';

export default Vue.extend({
    props: {
        width: Number,
        height: Number,
        slots: Array,
        cellWidth: {
            type: Number,
            default: 0,
        },
    },

    data() {
        return {
            actualCellWidth: this.cellWidth,
        };
    },

    methods: {
        posOf(x: number, y: number) {
            return {
                x: x - 1,
                y: y - 1,
            };
        },

        iconAt(x: number, y: number) {
            return iconOf((this.slots[this.width * y + x] as UnitData)?.protoId || "inertial_dust");
        },

        resizeCellWidth() {
            this.actualCellWidth = (this.$el as HTMLDivElement).clientWidth / this.width;
        },
    },

    mounted() {
        this.resizeCellWidth();
    },
});
</script>

<style scoped>
.cell:hover {
    /* border: 0.1em solid #66ccff; */
    /* filter: brightness(0.5); */
    filter: invert(30%);
}
/* .cell::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border: 0.1em solid #66ccff;
    filter: brightness(0.5);
} */
</style>