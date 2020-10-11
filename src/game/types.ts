import { genUid } from '@/utils/number';
import { Uid } from './interfaces';

type IdNumberMap = {[id: string]: number};

interface Tickable {
    tick(): void;
}

class Identifible {
    uid: Uid;

    constructor(uid = genUid()) {
      this.uid = uid;
    }
}

type Vector = {x: number; y: number};

export {
  IdNumberMap,
  Tickable,
  Vector,
  Identifible
}
