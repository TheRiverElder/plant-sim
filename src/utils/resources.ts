import Res from '@/game/Res';

function textOf(id: string) {
    return Res.get('text', id);
}

function nameOf(id: string) {
    return Res.get('name', id);
}

function descOf(id: string) {
    return Res.get('desc', id);
}

function iconOf(id: string) {
    return Res.get('icon', id);
}

export {
    textOf,
    nameOf,
    descOf,
    iconOf,
}