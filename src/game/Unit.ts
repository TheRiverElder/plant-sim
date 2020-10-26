import Empty from './buildin/unit-proto/Empty';
import { UnitData } from './interface/common-interfaces';
import { UnitCtorParams, UnitProto } from './interface/server-interfaces';
import { Id, IdNumberMap, Jsonfible, Unique } from './interface/types';

export default class Unit extends Unique implements Jsonfible<UnitData> {
    private static prototypes: { [id: string]: UnitProto } = {};

    public static protoOf(id: Id) {
        return Unit.prototypes[id];
    }

    public static getAllPrototypes() {
        return Object.values(Unit.prototypes);
    }

    public static register(proto: UnitProto) {
        Unit.prototypes[proto.id] = proto
    }

    public static create(proto: UnitProto | string, params: UnitCtorParams, unitParams: IdNumberMap = {}): Unit {
        if (typeof proto === 'string') {
            proto = Unit.prototypes[proto];
        }
        const unit = new Unit({ ...params, proto });
        unit.proto.setup(unit, unitParams);
        return unit;
    }

    proto: UnitProto;
    heat = 0;
    mass = 0;
    duration = 1;
    data: IdNumberMap = {};

    constructor({ uid, proto, heat, mass, duration }: UnitCtorParams) {
        super(uid);
        this.proto = proto || new Empty();
        this.heat = heat || 0;
        this.mass = mass || 5e3;
        this.duration = duration || 1;
    }

    toJson(): UnitData {
        const { uid, heat, mass, duration, proto, data } = this;
        return {
            uid,
            heat,
            mass,
            duration,
            protoId: proto.id,
            data,
        }
    }
}
