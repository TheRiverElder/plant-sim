import { Unit, UnitProto } from '@/game/interface/server-interfaces';

export default class Empty implements UnitProto {
    id = 'empty';

    setup (unit: Unit): void {
      unit.mass = 5e3;
      unit.heat = 0;
    }

    tick (): void {
      // console.log('bbb')
    }
}
