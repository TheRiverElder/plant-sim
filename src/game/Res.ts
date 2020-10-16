interface ResourcePackConfig {
    name: string;
    data: ResourceNamespace;
}

interface ResourceNamespace {
    [key: string]: ResourceNamespace | string;
}

class Res {
    static packs: ResourceNamespace = { "default": {} };
    
    static current: string;

    static register(pack: ResourcePackConfig) {
        Res.packs[pack.name] = pack.data;
    }

    static get(...keys: Array<string | null>): string {
        const nks = keys.map(s => s?.split('.') || []).flat();
        if (nks.every(e => !e.length)) {
            return '';
        }
        let namespace = Res.packs[Res.current];
        let index = 0;
        while (!!namespace && typeof namespace === 'object' && index < nks.length) {
            namespace = namespace[nks[index]];
            index++;
        }
        return typeof namespace === 'string' ? namespace : nks.join('.');
    }
}

export default Res;

export {
    ResourcePackConfig,
    ResourceNamespace,
}