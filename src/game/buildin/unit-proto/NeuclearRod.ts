import { ReactorData, UnitData } from '@/game/interface/common-interfaces';
import { UnitProto, UnitParams } from '@/game/interface/server-interfaces';
import { Vector } from '@/game/interface/types';

interface NeuclearRodConfig {
    halfLife: number;
    heatRatio: number;
    initialAbundance: number;
}

export default class NeuclearRod implements UnitProto {
    id = 'neuclear_rod';
    config: NeuclearRodConfig;

    constructor(config: NeuclearRodConfig) {
        this.config = config;
    }

    setup (unit: UnitData): void {
        unit.neuclearMass = unit.mass * this.config.initialAbundance;
        unit.inertialMass = unit.mass - unit.neuclearMass;
    }

    tick (unit: UnitData, position: Vector, reactor: ReactorData): void {
        const prevNeuclearMass = unit.neuclearMass;
        unit.neuclearMass *= Math.pow(0.5, 0.1 / this.config.halfLife)
        const consumedMass = prevNeuclearMass - unit.neuclearMass;
        unit.heat += consumedMass * this.config.heatRatio;
        unit.mass = unit.inertialMass + unit.neuclearMass;
        unit.duration = unit.neuclearMass / (this.config.initialAbundance * unit.inertialMass / (1 - this.config.initialAbundance));
    }

    toData(unit: UnitData): UnitParams {
        return unit;
    }
}