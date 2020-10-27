import { Id, IdNumberMap, Jsonfible, Uid, Vector } from './types';
import { Layout, ReactorData, UnitData } from './common-interfaces';

interface UnitProto {
    id: Id;
    setup(unit: UnitData, params: IdNumberMap): void;
    tick(unit: UnitData, position: Vector, reactor: ReactorData): void;
    toData(unit: UnitData): UnitParams;
}

interface ReactorProto extends Jsonfible<ReactorData, ReactorData> {
    id: Id;
    produce(reactor: ReactorData, dp: number): void;
    setup(reactor: ReactorData): void;
    tick(reactor: ReactorData): void;
    toData(reactor: ReactorData): ReactorParams;
}

interface UnitParams {
    uid?: Uid;
    protoId: Id;
    heat?: number;
    mass?: number;
    duration?: number;
    [prop: string]: any;
}

interface ReactorParams {
    uid?: Uid;
    protoId: Id;
    name?: string;
    powerBuffer?: number;
    slots?: Array<UnitData>;
    [prop: string]: any;
}

export {
    ReactorProto,
    UnitProto,

    UnitParams,
    ReactorParams,
}