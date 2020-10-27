import { genUid } from '@/utils/number';
import { UnitData } from './interface/common-interfaces';
import { UnitProto } from './interface/server-interfaces';
import { Id, Uid } from './interface/types';

interface UnitFactoryType {
    prototypes: { [id: string]: UnitProto };
    register(proto: UnitProto): void;
    create(params: UnitParams, doSetup?: boolean): UnitData;
}

interface UnitParams {
    protoId: Id;
    uid?: Uid;
    heat?: number;
    mass?: number;
    duration?: number;
    [prop: string]: any;
}

const UnitFactory: UnitFactoryType = {
    prototypes: {},

    register(proto: UnitProto): void {
        this.prototypes[proto.id] = proto;
    },

    create(params: UnitParams, doSetup = true): UnitData {
        const ap: UnitProto = this.prototypes[params.protoId];
        const unit: UnitData = { 
            ...params,
            protoId: ap.id,
            uid: params.uid || genUid(),
            heat: params.heat || 0,
            mass: params.mass || 1,
            duration: params.duration || 1,
        };
        if (doSetup) {
            ap.setup(unit, params);
        }
        return unit;
    },
};

export default UnitFactory;

export {
    UnitFactoryType,
    UnitParams,
    UnitFactory,
}
