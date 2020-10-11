import InertialDust from './buildin/InertialDust';
import { Uid, UnitData, UnitCtorData } from './interfaces';
import { Identifible } from './types';
import UnitProto from './UnitProto';

interface UnitCtorParams {
    heat: number;
    mass: number;
    duration: number;
    proto: UnitProto;
    id?: Uid;
    [prop: string]: any;
}

export default class Unit extends Identifible {
    private static prototypes: { [id: string]: UnitProto } = {};
    public static protoOf(id: string) {
        return Unit.prototypes[id];
    }

    public static getAllPrototypes() {
        return Object.values(Unit.prototypes);
    }

    public static register(proto: UnitProto) {
        Unit.prototypes[proto.id] = proto
    }

    public static of(proto: UnitProto | string, data: UnitCtorData): Unit {
        if (typeof proto === 'string') {
            proto = Unit.prototypes[proto];
        }
        const params: UnitCtorParams = {
            proto: proto || new InertialDust(),
            ...data,
        }
        const unit = new Unit(params);
        unit.proto.setup(unit);
        return unit;
    }

    heat = 0;
    mass = 0;
    duration = 1;
    proto: UnitProto;
    [prop: string]: any;

    constructor(data: UnitCtorParams) {
        super(data?.uid);
        this.proto = data.proto;
        Object.assign(this, data);
    }

    getData(): UnitData {
        const { uid, heat, mass, duration, proto, ...restData } = this;
        return {
            uid,
            heat,
            mass,
            duration,
            protoId: proto.id,
            ...restData,
        }
    }
}
