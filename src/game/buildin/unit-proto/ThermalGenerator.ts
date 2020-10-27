import { ReactorData, UnitData } from '@/game/interface/common-interfaces';
import { UnitParams, UnitProto } from '@/game/interface/server-interfaces';
import { Id, Vector } from '@/game/interface/types';
import ReactorFactory from '@/game/ReactorFactory';

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

  setup(unit: UnitData): void {
    unit.heat = 0;
    unit.mass = this.config.initialMass;
  }

  tick(unit: UnitData, position: Vector, reactor: ReactorData): void {
    unit.duration = Math.min(Math.max(0, 1 - (unit.heat - this.config.damagingThreshold) / this.config.damageScale), 1);
    const preparedHeat = unit.heat - this.config.workingThreshold
    const deltaHeat =
      preparedHeat >= 0
        ? preparedHeat * Math.atan(preparedHeat) / Math.PI * 2 * unit.duration
        : 0;
    unit.heat -= deltaHeat;
    ReactorFactory.prototypes[reactor.protoId].produce(reactor, deltaHeat * this.config.energyRatio);
  }

  toData(unit: UnitData): UnitParams {
    return unit;
  }
}
