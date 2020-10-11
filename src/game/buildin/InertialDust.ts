import Unit from '../Unit'
import UnitProto from '../UnitProto'

export default class InertialDust implements UnitProto {
    id = 'inertial_dust';
    density = 1;

    setup (unit: Unit): void {
      unit.mass = 5e3
      unit.heat = 0
    }

    tick (): void {
      // console.log('bbb')
    }
}
