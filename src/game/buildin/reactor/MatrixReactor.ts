import { Reactor } from '@/game/interface/server-interfaces';
import { Layout, ReactorData } from '../../interface/common-interfaces';
import { Uid, Vector } from '../../interface/types'
import Unit from '../../Unit';

const defaultInertialDustParams = {
  heat: 0,
  mass: 10000,
  duration: 1,
};

interface ReactorCtorParams {
  width: number;
  height: number;
  uid?: Uid;
  name?: string;
  wallTemparature: number;
}

export default class MatrixReactor extends Reactor {
  name: string;
  wallTemparature: number;
  slots: Unit[];
  powerBuffer = 0;
  layout: Layout;

  bufferedHeatMap: number[][];

  constructor({ width, height, wallTemparature, uid, name }: ReactorCtorParams) {
    super(uid);
    this.layout = {
      width: width,
      height: height,
      slots: Array(width * height).fill(0).map((_, i) => ({ x: i % width, y: Math.floor(i / width) })),
    };
    this.name = name || 'Reactor-' + this.uid;
    this.wallTemparature = wallTemparature;
    this.slots = Array.from(Array(width * height), () => Unit.create('empty', defaultInertialDustParams));
    this.bufferedHeatMap = this.makeBufferedHeatmap();
  }

  public indexOf(x: number, y: number): number {
    return (x >= 0 && x < this.layout.width && y >= 0 && y < this.layout.height) ? y * this.layout.width + x : -1;
  }

  public posOf(index: number): Vector {
    return (index >= 0 && index < this.slots.length) ? {
      x: index % this.layout.width,
      y: Math.floor(index / this.layout.width),
    } : { x: -1, y: -1 };
  }

  isInRange(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.layout.width && y < this.layout.height;
  }

  makeBufferedHeatmap() {
    return [
      Array(this.layout.width + 2).fill(this.wallTemparature),
      ...Array.from(Array(this.layout.height), (v, r) => [
        this.wallTemparature,
        ...this.slots.slice(r * this.layout.width, (r + 1) * this.layout.width).map(u => u.heat),
        this.wallTemparature
      ]),
      Array(this.layout.width + 2).fill(this.wallTemparature),
    ];
  }

  getHeat(x: number, y: number): number {
    return this.isInRange(x, y) ? this.getUnit(x, y).heat : this.wallTemparature;
  }

  getUnit(x: number, y: number): Unit {
    return this.slots[this.indexOf(x, y)] || { heat: 0 };
  }

  setUnit(x: number, y: number, unit?: Unit | null): Unit | null {
    const index = this.indexOf(x, y);
    if (index >= 0) {
      const prev = this.slots[index];
      this.slots[index] = unit || Unit.create('inertial_dust', defaultInertialDustParams);
      return prev;
    }
    return null;
  }

  tick() {
    this.powerBuffer = 0;
    this.slots.forEach((unit, index) => {
      if (unit) {
        unit.proto.tick(unit, this.posOf(index), this);
      }
    })
    this.bufferedHeatMap = this.makeBufferedHeatmap();
    this.heatFlow();
    this.bufferedHeatMap = this.makeBufferedHeatmap();
    // console.log('tick')
  }

  heatFlow() {
    const dt = 0.1
    const deltaHeatmap: number[] = this.slots.map((unit, index) => {
      if (!unit) {
        return 0;
      }
      const pos = this.posOf(index);
      const ch = unit.heat;
      const { x, y } = pos;
      const neig = [
        this.getUnit(x - 1, y),
        this.getUnit(x + 1, y),
        this.getUnit(x, y - 1),
        this.getUnit(x, y + 1)
      ];
      return neig.filter(n => !!n).reduce((s, n) => s + (n.heat - ch) / 5 * dt, 0);
    })
    this.slots.forEach((unit, index) => {
      if (unit) {
        unit.heat = (unit.heat || 0) + deltaHeatmap[index];
      }
    })
  }

  produce(power: number) {
    this.powerBuffer += power;
  }

  toJson(): ReactorData {
    return {
      uid: this.uid,
      name: this.name,
      powerBuffer: this.powerBuffer,
      layout: this.layout,
      slots: this.slots.map(u => u.toJson()),
      heatmap: this.bufferedHeatMap,
    };
  }
}
