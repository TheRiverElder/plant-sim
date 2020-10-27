import { ReactorParams, ReactorProto } from '@/game/interface/server-interfaces';
import UnitFactory from '@/game/UnitFactory';
import { ReactorData, UnitData } from '../../interface/common-interfaces';

const defaultInertialDustParams = {
  protoId: 'empty',
  mass: 10000,
};

export default class MatrixReactor implements ReactorProto {
  id = "matrix_reactor";

  setup(reactor: ReactorData): void {
    reactor.width = reactor.width || 1;
    reactor.height = reactor.height || 1;
    reactor.wallTemparature = reactor.wallTemparature || 30;
    reactor.slots = Array(reactor.width * reactor.height)
      .fill(0)
      .map(() => UnitFactory.create(defaultInertialDustParams, true));
  }

  makeBufferedHeatmap(reactor: ReactorData): Array<Array<number>> {
    return [
      Array(reactor.width + 2).fill(reactor.wallTemparature),
      ...Array.from(Array(reactor.height), (v, r) => [
        reactor.wallTemparature,
        ...reactor.slots.slice(r * reactor.width, (r + 1) * reactor.width).map(u => u.heat),
        reactor.wallTemparature
      ]),
      Array(reactor.width + 2).fill(reactor.wallTemparature),
    ];
  }

  tick(reactor: ReactorData) {
    reactor.powerBuffer = 0;
    reactor.slots.forEach((unit, index) => {
      if (unit) {
        UnitFactory.prototypes[unit.protoId].tick(unit, { x: index % reactor.width, y: Math.floor(index / reactor.width) }, reactor);
      }
    })
    this.heatFlow(reactor.slots, reactor.width as number, reactor.height as number);
    // console.log('tick')
  }

  heatFlow(slots: Array<UnitData>, width: number, height: number) {
    const dt = 0.1
    const deltaHeatmap: number[] = slots.map((unit, index) => {
      if (!unit) {
        return 0;
      }
      const pos = { x: index % width, y: Math.floor(index / width) };
      const ch = unit.heat;
      const { x, y } = pos;
      const neig = [
        this.getUnit(slots, width, height, x, y + 1),
        this.getUnit(slots, width, height, x, y - 1),
        this.getUnit(slots, width, height, x + 1, y),
        this.getUnit(slots, width, height, x - 1, y),
      ];
      return neig.filter(n => !!n).reduce((s, n) => s + ((n as UnitData).heat - ch) / 5 * dt, 0);
    })
    slots.forEach((unit, index) => {
      if (unit) {
        unit.heat = (unit.heat || 0) + deltaHeatmap[index];
      }
    })
  }

  getUnit(slots: Array<UnitData>, width: number, height: number, x: number, y: number): UnitData | null {
    return (x < 0 || y < 0 || x >= width || y >= height) ? null : slots[y * width + x];
  }

  produce(reactor: ReactorData, power: number) {
    reactor.powerBuffer += power;
  }

  toJson(reactor: ReactorData): ReactorData {
    const width: number = reactor.width;
    const height: number = reactor.height;
    return {
      protoId: this.id,
      uid: reactor.uid,
      name: reactor.name,
      powerBuffer: reactor.powerBuffer,
      layout: {
        width,
        height,
        slots: Array(width * height).fill(0).map((_, i) => ({ x: i % width + 0.5, y: Math.floor(i / width) + 0.5 })),
      },
      slots: reactor.slots,
      heatmap: this.makeBufferedHeatmap(reactor),
    };
  }

  toData(reactor: ReactorData): ReactorParams {
    return {
      protoId: this.id,
      uid: reactor.uid,
      name: reactor.name,
      powerBuffer: reactor.powerBuffer,
      slots: reactor.slots,
      width: reactor.width,
      height: reactor.height,
    };
  }
}
