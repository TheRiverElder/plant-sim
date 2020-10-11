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

    static get(...keys: string[]) {
        keys = keys.map(s => s.split('.')).flat();
        let namespace = Res.packs[Res.current];
        let index = 0;
        while (!!namespace && typeof namespace === 'object' && index < keys.length) {
            namespace = namespace[keys[index]];
            index++;
        }
        return typeof namespace === 'string' ? namespace : keys.join('.');
    }
}

export default Res;

export {
    ResourcePackConfig,
    ResourceNamespace,
}