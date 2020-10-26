import { Reactor, Unit, UnitProto } from '@/game/interface/server-interfaces';
import { Id, Vector } from '@/game/interface/types';

interface ThermalGeneratorConfig {
  id?: Id;
  initialMass: number;
  energyRatio: number;
  damagingThreshold: number;
  workingThreshold: number;
  damageScale: number;
}

export default class ThermalGenerator implements UnitProto {
  id = 'thermal_generator';
  config: ThermalGeneratorConfig;

  constructor(config: ThermalGeneratorConfig) {
    this.id = config.id || 'thermal_generator';
    this.config = config;
  }

  setup(unit: Unit): void {
    unit.heat = 0;
    unit.mass = this.config.initialMass;
  }

  tick(unit: Unit, position: Vector, reactor: Reactor): void {
    unit.duration = Math.min(Math.max(0, 1 - Math.atan((unit.heat - this.config.damagingThreshold) / this.config.damageScale) / Math.PI * 2), 1);
    const preparedHeat = unit.heat - this.config.workingThreshold
    const deltaHeat =
      preparedHeat >= 0
        ? preparedHeat * Math.atan(preparedHeat) / Math.PI * 2 * unit.duration
        : 0;
    unit.heat -= deltaHeat;
    reactor.produce(deltaHeat * this.config.energyRatio);
  }
}
