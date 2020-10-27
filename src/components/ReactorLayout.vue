<template>
    <div class="reactor-layout" ref="layout">
        <div 
            v-for="(pos, index) of layout.slots" 
            :key="index" 
            class="slot"
            :style="`left:${(pos.x) * actualCellWidth}px;top:${(pos.y) * actualCellWidth}px`"
        >
            <img
                :width="actualCellWidth"
                :height="actualCellWidth"
                :src="iconAt(index)"
                @click="$emit('click', index, $event)"
                @mouseup="$emit('mouseup', index, $event)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { iconOf } from "@/utils/resources";
import { UnitData } from '@/game/interface/common-interfaces';

export default Vue.extend({
    props: {
        layout: Object,
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
        iconAt(index: number) {
            return iconOf((this.slots[index] as UnitData)?.protoId || "empty");
        },

        resize() {
            const el = this.$el as HTMLDivElement;
            this.actualCellWidth = Math.round(el.clientWidth / this.layout.width);
            el.style.height = this.layout.height * this.actualCellWidth + 'px';
        },
    },

    mounted() {
        this.resize();
    },
});
</script>

<style scoped>
.reactor-layout {
    position: relative;
}
.slot:hover {
    border: 0.1em solid #66ccff;
    filter: brightness(0.5);
    filter: invert(30%);
    z-index: 2;
}
.slot {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    height: fit-content;
}
.slot > img {
    display: block;
}
</style>