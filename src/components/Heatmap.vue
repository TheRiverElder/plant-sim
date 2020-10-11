<template>
    <div>
        <div>
          <v-switch
            label="Turn on/off grid"
            v-model="grid"
          />

          <v-slider
            label="Full heat"
            :min="1"
            :max="10"
            :step="0"
            v-model.number="fullHeatPower"
          >
            <template v-slot:append>
              1E
              <v-text-field
                dense
                hide-details
                v-model.number="fullHeatPower"
              />
            </template>
          </v-slider>

          <p> Produced Power: {{ producedPower.toFixed(2) }}</p>
        </div>

        <canvas ref="canvas" width="800" height="600" @click="handleClickCanvas"></canvas>

        <div>
          <p> Coordinate: ({{ currentUnitX }}, {{ currentUnitY }}) </p>
          <p> Current Unit: {{ currentUnitProtoId }} </p>
          <p> Mass: {{ currentUnitMass.toFixed(2) }} </p>
          <p> Heat: {{ currentUnitHeat.toFixed(2) }} </p>
          <p> Duration: {{ currentUnitDuration.toFixed(3) }} </p>
        </div>
    </div>
</template>

<script lang="ts">
import Reactor from '@/game/Reactor'
import { paintHeatmap } from '@/utils/graphics';
import { Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

// eslint-disable-next-line
function lerp (n: number) {
  return 6 * Math.pow(n, 5) - 15 * Math.pow(n, 4) + 10 * Math.pow(n, 3)
}

function watcher(this: { paint: () => void }) {
  this.paint();
}

export default Vue.extend({
  name: 'Heatmap',

  props: {
    cell: Number
  },

  data () {
    return {
      currentUnitX: NaN,
      currentUnitY: NaN,
      currentUnitProtoId: 'null',
      currentUnitMass: NaN,
      currentUnitHeat: NaN,
      currentUnitDuration: NaN,
      grid: true,
      fullHeatPower: 5,
      producedPower: 0
    }
  },

  watch: {
    currentUnitX: watcher,
    currentUnitY: watcher,
    grid: watcher,
  },

  computed: {
    ...mapState(['reactor']),
  },

  methods: {
    paint () {
      const canvas = this.$refs.canvas as HTMLCanvasElement
      if (!canvas) {
        return
      }
      console.time('loop');
      paintHeatmap(this.reactor.getBufferedHeatmap(), canvas, this.cell, Math.pow(10, this.fullHeatPower), this.grid);
      console.timeEnd('loop');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      if (!isNaN(this.currentUnitX) && !isNaN(this.currentUnitY)) {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.currentUnitX * this.cell, this.currentUnitY * this.cell, this.cell, this.cell);
      }
    },

    isOnGrid (px: number, py: number, cell: number) {
      return !(px % cell) || !(py % cell)
    },

    getHeatAt (rpx: number, rpy: number, reactor: Reactor, cell: number) {
      const px = rpx - cell / 2
      const py = rpy - cell / 2
      const x0 = Math.floor(px / cell)
      const y0 = Math.floor(py / cell)
      const dx = ((px < 0 ? px + cell : px) % cell) / cell
      const dy = ((py < 0 ? py + cell : py) % cell) / cell

      const v00 = reactor.getHeat(x0, y0)
      const v10 = reactor.getHeat(x0 + 1, y0)
      const v01 = reactor.getHeat(x0, y0 + 1)
      const v11 = reactor.getHeat(x0 + 1, y0 + 1)

      const h0 = (1 - dx) * v00 + dx * v10
      const h1 = (1 - dx) * v01 + dx * v11
      const heat = (1 - dy) * h0 + dy * h1

      // if (rpx === 10 && rpy === 10) {
      //   console.log('rpx, rpy', rpx, rpy)
      //   console.log('px, py', px, py)
      //   console.log('x0, y0', x0, y0)
      //   console.log('dx, dy', dx, dy)
      //   console.log('v00', x0, y0, v00)
      //   console.log('v10', x0, y0 + 1, v10)
      //   console.log('v01', x0 + 1, y0, v01)
      //   console.log('v11', x0 + 1, y0 + 1, v11)
      //   console.log('h0', h0)
      //   console.log('h1', h1)
      //   console.log('heat', heat)
      // }

      return heat
    },

    update () {
      this.reactor.power = 0;
      this.reactor.tick();
      this.paint();
      const unit = this.reactor.getUnit(this.currentUnitX, this.currentUnitY);
      // console.log('unit = ' + JSON.stringify(unit));
      if (!unit || !unit.proto) {
        return;
      }
      this.currentUnitProtoId = unit.proto.id;
      this.currentUnitMass = unit.mass;
      this.currentUnitHeat = unit.heat;
      this.currentUnitDuration = unit.duration;
      this.producedPower = this.reactor.power;
    //   console.log(this.reactor)
    },

    handleClickCanvas (event: MouseEvent) {
      const x = Math.floor(event.offsetX / this.cell);
      const y = Math.floor(event.offsetY / this.cell);
      const unit = this.reactor.getUnit(x, y);
      this.currentUnitX = x;
      this.currentUnitY = y;
      this.currentUnitProtoId = unit.proto.id;
      this.currentUnitMass = unit.mass;
      this.currentUnitHeat = unit.heat;
      this.currentUnitDuration = unit.duration;
    }
  },

  mounted () {
    Object.assign(this.$refs.canvas, {
      width: this.cell * this.reactor.width,
      height: this.cell * this.reactor.height,
    });
    setInterval(this.update.bind(this), 1000);
    // this.update();
  }
})
</script>
