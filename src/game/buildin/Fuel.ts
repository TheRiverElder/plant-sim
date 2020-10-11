import Reactor from '../Reactor'
import { Vector } from '../types'
import Unit from '../Unit'
import UnitProto from '../UnitProto'

interface FuelConfig {
    initialMass: number;
    consumingRate: number; // mass consumed per tick
    heatRatio: number; // Mass to heat
    remainsRatio: number; // the remander of the consuming
}

export default class Fuel implements UnitProto {
    id = 'fuel';
    density = 1;

    config: FuelConfig;

    constructor (config: FuelConfig) {
      this.config = config
    }

    setup (unit: Unit): void {
      unit.mass = unit.fuelMass = this.config.initialMass
      unit.duration = 1
    }

    tick (unit: Unit): void {
      const consumedFuel = Math.min(this.config.consumingRate, unit.fuelMass)
      const remainderMass = consumedFuel * this.config.remainsRatio
      unit.fuelMass -= consumedFuel
      unit.mass = unit.mass - consumedFuel + remainderMass
      // reactor.change('heat', consumedFuel * this.config.heatRatio);
      unit.heat += consumedFuel * this.config.heatRatio
      unit.duration = unit.fuelMass / this.config.initialMass
    }
}
