import { ReactorParams, ReactorProto } from '@/game/interface/server-interfaces';
import UnitFactory from '@/game/UnitFactory';
import { ReactorData } from '../../interface/common-interfaces';

const defaultInertialDustParams = {
    protoId: 'empty',
    mass: 10000,
};

export default class CoilReactor implements ReactorProto {
    id = "coil_reactor";

    setup(reactor: ReactorData): void {
        reactor.accrssary = reactor.accrssary || 8;
        reactor.wallTemparature = reactor.wallTemparature || 30;
        reactor.slots = Array(reactor.accrssary + 1)
            .fill(0)
            .map(() => UnitFactory.create(defaultInertialDustParams, true));
    }

    tick(reactor: ReactorData) {
        reactor.powerBuffer = 0;
        reactor.slots.forEach((unit, index) => {
            if (unit) {
                UnitFactory.prototypes[unit.protoId].tick(unit, { x: index % reactor.width, y: Math.floor(index / reactor.width) }, reactor);
            }
        })
    }

    produce(reactor: ReactorData, power: number) {
        reactor.powerBuffer += power;
    }

    toJson(reactor: ReactorData): ReactorData {
        const accrssary: number = reactor.accrssary;
        return {
            protoId: this.id,
            uid: reactor.uid,
            name: reactor.name,
            powerBuffer: reactor.powerBuffer,
            layout: {
                width: 9,
                height: 7,
                slots: Array(accrssary).fill(0).map((_, i) => {
                    const angle = i * 2 * Math.PI / accrssary;
                    return {
                        x: 4.5 + 2 * Math.cos(angle), 
                        y: 3.5 + 2 * Math.sin(angle),
                    };
                }).concat([{ x: 4.5, y: 3.5 }]),
            },
            slots: reactor.slots,
            heatmap: [[]],
        };
    }

    toData(reactor: ReactorData): ReactorParams {
        return {
            protoId: this.id,
            uid: reactor.uid,
            name: reactor.name,
            powerBuffer: reactor.powerBuffer,
            slots: reactor.slots,
            accrssary: reactor.accrssary,
        };
    }
}
