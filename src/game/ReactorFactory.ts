import { genUid } from '@/utils/number';
import { genName } from '@/utils/strings';
import { ReactorData, UnitData } from './interface/common-interfaces';
import { ReactorProto } from './interface/server-interfaces';
import { Id, Uid } from './interface/types';

interface ReactorFactoryType {
    prototypes: { [id: string]: ReactorProto };
    register(proto: ReactorProto): void;
    create(params: ReactorParams, doSetup?: boolean): ReactorData;
}

interface ReactorParams {
    protoId: Id;
    uid?: Uid;
    name?: string;
    powerBuffer?: number;
    slots?: Array<UnitData>;
    [prop: string]: any;
}

const ReactorFactory: ReactorFactoryType = {
    prototypes: {},

    register(proto: ReactorProto): void {
        this.prototypes[proto.id] = proto;
    },

    create(params: ReactorParams, doSetup = true): ReactorData {
        const ap: ReactorProto = this.prototypes[params.protoId];
        const reactor: ReactorData = { 
            ...params,
            protoId: ap.id,
            uid: params.uid || genUid(),
            name: params.name || genName(),
            powerBuffer: params.powerBuffer || 0,
            slots: params.slots || [],
        };
        if (doSetup) {
            ap.setup(reactor);
        }
        return reactor;
    },
};

export default ReactorFactory;

export {
    ReactorFactoryType,
    ReactorParams,
    ReactorFactory,
}