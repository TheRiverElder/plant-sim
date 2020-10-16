<template>
    <div>
        <canvas
            ref="canvas"
            width="800"
            height="600"
            @click="handleClickCanvas"
        ></canvas>
    </div>
</template>

<script lang="ts">
import Reactor from "@/game/Reactor";
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
        grid: Boolean,
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
                    this.cellWidth,
                    this.maxValue,
                    this.grid
                );
            }
        },

        update() {
            this.paint();
        },

        handleClickCanvas(event: MouseEvent) {
            const x = Math.floor(event.offsetX / this.cellWidth);
            const y = Math.floor(event.offsetY / this.cellWidth);
            this.$emit("click", { x, y });
        },
    },

    mounted() {
        Object.assign(this.$refs.canvas, {
            width: this.cellWidth * this.width,
            height: this.cellWidth * this.height,
        });
        this.paint();
    },
});
</script>
