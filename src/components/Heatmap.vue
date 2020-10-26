<template>
    <div>
        <canvas
            ref="canvas"
            :width="totalWidth"
            :height="totalHeight"
            @click="handleClickCanvas"
        ></canvas>
    </div>
</template>

<script lang="ts">
import { paintHeatmap } from "@/utils/graphics";
import { Vue } from "vue-property-decorator";
import { mapState } from "vuex";

// eslint-disable-next-line
function lerp(n: number) {
    return 6 * Math.pow(n, 5) - 15 * Math.pow(n, 4) + 10 * Math.pow(n, 3);
}

function watcher(this: { paint: () => void }) {
    this.paint();
}

export default Vue.extend({
    name: "Heatmap",

    props: {
        cellWidth: Number,
        width: Number,
        height: Number,
        heatmap: Array,
        maxValue: Number,
        grid: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            actualCellWidth: this.cellWidth,
            totalWidth: this.width * this.cellWidth,
            totalHeight: this.height * this.cellWidth,
        };
    },

    watch: {
        grid: "paint",
        heatmap: "paint",
    },

    methods: {
        paint() {
            const canvas = this.$refs.canvas as HTMLCanvasElement;
            if (canvas) {
                paintHeatmap(
                    this.heatmap as number[][],
                    canvas,
                    this.actualCellWidth,
                    this.maxValue,
                    this.grid,
                );
            }
        },

        update() {
            this.paint();
        },

        handleClickCanvas(event: MouseEvent) {
            const x = Math.floor(event.offsetX / this.actualCellWidth);
            const y = Math.floor(event.offsetY / this.actualCellWidth);
            this.$emit("click", y * this.width + x, event);
        },

        resizeCellWidth() {
            this.actualCellWidth = Math.floor((this.$el as HTMLDivElement).clientWidth / this.width);
            this.totalWidth = this.width * this.actualCellWidth;
            this.totalHeight = this.height * this.actualCellWidth;
        },
    },

    mounted() {
        this.resizeCellWidth();
        this.paint();
    },
});
</script>
