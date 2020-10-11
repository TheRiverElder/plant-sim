let counter = Date.now();
function genUid() {
    return counter++;
}

function toEconomic(num: number, symbol = 'C.') {
    if (!Number.isInteger(num)) {
        return num.toFixed(3);
    }
    const str = String(num);
    const arr: string[] = [];
    for (let i = str.length; i > 0; i -= 3) {
        arr.push(str.slice(Math.max(0, i - 3), i));
    }
    return symbol + arr.reverse().filter(s => s.length).join(',');
}

export {
    genUid,
    toEconomic,
}