import { UnitData } from '@/game/interface/common-interfaces';
import { UnitParams, UnitProto } from '@/game/interface/server-interfaces';

export default class Empty implements UnitProto {
    id = 'empty';

    setup (unit: UnitData): void {
      unit.mass = 5e3;
      unit.heat = 0;
    }

    tick (): void {
      // console.log('bbb')
    }

    toData(unit: UnitData): UnitParams {
      return unit;
    }
}
