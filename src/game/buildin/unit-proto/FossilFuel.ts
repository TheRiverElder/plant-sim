import { UnitData } from '@/game/interface/common-interfaces';
import { UnitParams, UnitProto } from '@/game/interface/server-interfaces';
import { Id } from '@/game/interface/types';

interface FossilFuelConfig {
    id?: Id;
    initialMass: number;
    consumingRate: number; // mass consumed per tick
    heatRatio: number; // Mass to heat
    remainsRatio: number; // the remander of the consuming
}

export default class FossilFuel implements UnitProto {
    id: Id;
    config: FossilFuelConfig;

    constructor (config: FossilFuelConfig) {
      this.id = config.id || 'fossil_fuel';
      this.config = config;
    }

    setup (unit: UnitData): void {
      unit.fuelMass = this.config.initialMass;
    }

    tick (unit: UnitData): void {
      const consumedFuel = Math.min(this.config.consumingRate, unit.fuelMass);
      const remainderMass = consumedFuel * this.config.remainsRatio;
      unit.fuelMass -= consumedFuel;
      unit.mass = unit.mass - consumedFuel + remainderMass;
      // reactor.change('heat', consumedFuel * this.config.heatRatio);
      unit.heat += consumedFuel * this.config.heatRatio;
      unit.duration = unit.fuelMass / this.config.initialMass;
    }

    toData(unit: UnitData): UnitParams {
      return unit;
    }
}
