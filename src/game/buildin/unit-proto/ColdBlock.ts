import { UnitData } from '@/game/interface/common-interfaces';
import { UnitParams, UnitProto } from '@/game/interface/server-interfaces';

interface ColdBlockConfig {
    halfLife: number;
}

export default class ColdBlock implements UnitProto {
    id = 'cold_block';
    config: ColdBlockConfig;

    constructor(config: ColdBlockConfig) {
        this.config = config;
    }

    setup (): void {
        // nothing
    }

    tick (unit: UnitData): void {
        unit.heat *= Math.pow(0.5, 0.1 / this.config.halfLife);
    }

    toData(unit: UnitData): UnitParams {
        return unit;
    }
}
