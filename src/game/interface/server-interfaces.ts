import { Id, IdNumberMap, Jsonfible, Tickable, Uid, Unique, Vector } from './types';
import Unit from '../Unit';
import { Layout, ReactorData } from './common-interfaces';

interface UnitProto {
    id: Id;
    setup(unit: Unit, params: IdNumberMap): void;
    tick(unit: Unit, position: Vector, reactor: Reactor): void;
}

abstract class Reactor extends Unique implements Tickable, Jsonfible<ReactorData> {
    abstract toJson(): ReactorData;

    abstract tick(dt?: number): void;
    
    abstract slots: Array<Unit>;

    abstract layout: Layout;

    abstract powerBuffer: number;

    abstract produce(dp: number): void;
}

interface UnitCtorParams {
    uid?: Uid;
    proto?: UnitProto;
    heat?: number;
    mass?: number;
    duration?: number;
}

interface UnitFactory {
    create(): Unit;
}

export {
    Reactor,
    Unit,
    UnitProto,
    Layout,

    UnitCtorParams,
    UnitFactory,
}