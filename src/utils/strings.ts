import { rand } from './number';

function genName(minLen = 2, maxLen = 5): string {
    return String.fromCharCode(...Array(rand(minLen, maxLen)).fill('a').map((_, i) => (i ? 'a' : 'A').charCodeAt(0) + Math.floor(Math.random() * 26)));
}

export {
    genName,
}