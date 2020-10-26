import { genUid } from '@/utils/number';

type Uid = number;
type Id = string;

type UidMap<T> = { [uid: number]: T }

type IdNumberMap = { [id: string]: number };

type Vector = { x: number; y: number };

interface Tickable {
    tick(dt?: number): void;
}

class Unique {
    uid: Uid;

    constructor(uid?: Uid) {
      this.uid = uid || genUid();
    }
}

interface Jsonfible<T> {
    toJson(): T;
}

export {
    Uid,
    Id,
    UidMap,
    IdNumberMap,
    Vector,
    Tickable,
    Unique,
    Jsonfible,
}