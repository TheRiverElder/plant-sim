<template>
    <div class="reactor-layout" ref="layout" :style="reactorBg">
        <div 
            v-for="(pos, index) of layout.slots" 
            :key="index" 
            class="slot"
            :style="styleAt(index)"
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
import { iconOf, imgOf } from "@/utils/resources";
import { Layout, UnitData } from '@/game/interface/common-interfaces';

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

    computed: {
        reactorBg() {
            if (this.layout.src) {
                return [
                    `background-image: url('${imgOf(this.layout.src)}')`,
                    'background-clip: padding-box',
                    'background-origin: border-box',
                    'background-repeat: no-repeat',
                    'background-size: cover'
                ].join(';');
            } else {
                return '';
            }
        },
    },

    methods: {
        iconAt(index: number) {
            return iconOf((this.slots[index] as UnitData)?.protoId || "empty");
        },

        styleAt(index: number) {
            const slot = (this.layout as Layout).slots[index];
            const unit = this.slots[index];
            return [
                `left: ${slot.x * this.actualCellWidth}px`,
                `top: ${slot.y * this.actualCellWidth}px`,
                `background-image: url('${imgOf(slot.src || 'slot')}')`,
                'background-clip: padding-box',
                'background-origin: border-box',
                'background-repeat: no-repeat',
                'background-size: cover'
            ].join(';');
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