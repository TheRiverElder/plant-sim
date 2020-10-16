import { Uid, UidMap } from "@/game/interfaces";

function makeUidMap<T extends { uid: Uid }>(arr: Array<T>): UidMap<T> {
    return arr.reduce((p: UidMap<T>, v: T) => {
        p[v.uid] = v;
        return p;
    }, {});
}

export {
    makeUidMap,
}