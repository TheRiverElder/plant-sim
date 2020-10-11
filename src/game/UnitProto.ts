import { Identifible, Vector } from './types'
import Unit from './Unit'
import Reactor from './Reactor'

export default interface UnitProto {
    id: string;
    setup(unit: Unit): void;
    tick(unit: Unit, position: Vector, reactor: Reactor): void;
}
