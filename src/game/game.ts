import { genUid } from '@/utils/number';
import { genName } from '@/utils/strings';
import initialize from './buildin';
import { DeployScheme, GameInterface, Profile, PurchasementItem, Reactor, ReactorData, ResultReport, ShopItem, Uid, UidMap, Unit, UnitData } from './interfaces';

interface DataType {
    reactors: Reactor[];
    inventory: Unit[];
    shop: ShopItem[];
    period: number;
    lastModified: number;
    ownerName: string;
    account: number;
}

function initializeData(): DataType {
    initialize();
    return {
        reactors: [
            new Reactor({
                width: 9,
                height: 7,
                wallTemparature: 300,
                name: genName(),
            }),
        ],
        inventory: [],
        shop: [
            {
                uid: genUid(),
                price: 1000,
                protoId: 'inertial_dust',
                ctorParams: {
                    heat: 0,
                    mass: 10000,
                    duration: 1,
                },
            },
            {
                uid: genUid(),
                price: 2500,
                protoId: 'fuel',
                ctorParams: {
                    heat: 0,
                    mass: 30000,
                    duration: 1,
                },
            },
            {
                uid: genUid(),
                price: 360000,
                protoId: 'thermal_generator',
                ctorParams: {
                    heat: 0,
                    mass: 5000,
                    duration: 1,
                },
            },
        ],
        period: 1000,
        lastModified: Date.now(),
        ownerName: genName(),
        account: 5e5,
    };
}

// function save(): void {
//     localStorage.setItem('plant-sim-data', JSON.stringify(data));
// }

const data: DataType = initializeData();

const COMMANDS: {[head: string]: (params: string[], game: GameInterface) => any} = {
    "purchase": (params: string[], game: GameInterface) => {
        const cart = params.map(Number).map(uid => ({ uid, count: 1 }));
        game.purchase(cart);
    },
};

function tick() {
    data.reactors.forEach(r => r.tick());
    data.account += Math.floor(data.reactors.reduce((s, r) => s + r.power, 0));
    data.lastModified += data.period;
}

let pid = -1;

const localGameInterface: GameInterface = {
    getShopItemList(): ShopItem[] {
        return data.shop.map((si) => Object.assign({}, si));
    },

    getReactorList(): ReactorData[] {
        return data.reactors.map(r => r.getData());
    },

    getInventory(): UnitData[] {
        return data.inventory.map(u => u.getData());
    },

    purchase(cart: PurchasementItem[]): ResultReport {
        const cache: Array<Unit> = [];
        const errors = [];
        let sum = 0;
        for (let i = 0; i < cart.length && sum <= data.account; i++) {
            const { uid, count } = cart[i];
            const item = data.shop.find(i => i.uid === uid);
            if (item) {
                for (let i = 0; i < count; i++) {
                    const unit = Unit.of(item.protoId, item.ctorParams);
                    cache.push(unit);
                }
                sum += item.price * count;
            } else {
                errors.push(uid);
            }
        }

        if (errors.length || sum > data.account) {
            return {
                success: false,
                errors: [
                    errors.length ? 'Cannot find item(s): ' + errors.join(', ') : '',
                    sum > data.account ? `Not enough money: C.${sum}/C.${data.account}` : '',
                ].filter(s => s.length)
            };
        } else {
            cache.forEach(u => data.inventory.push(u));
            data.account -= sum;
            return { success: true };
        }
    },

    deploy(scheme: DeployScheme): ResultReport {
        // Check reactor exist
        const reactor = data.reactors.find(r => r.uid === scheme.reactorUid);
        if (!reactor) {
            return {
                success: false,
                errors: ['Reactor not found: #' + scheme.reactorUid]
            }
        }

        // Check duplicated item uid
        const uidSet = new Set<Uid>();
        const duplicatedUidSet = new Set<Uid>();
        for (const uid of scheme.slots) {
            if (uid > 0) {
                if (uidSet.has(uid)) {
                    duplicatedUidSet.add(uid);
                }
                uidSet.add(uid);
            }
        }
        if (duplicatedUidSet.size > 0) {
            return {
                success: false,
                errors: ['Duplicated items: ' + [...duplicatedUidSet].map((uid: Uid) => ('#' + uid)).join(', ')]
            }
        }

        // Extract items and find non-exist items
        const units: UidMap<Unit> = {};
        uidSet.delete(-1);
        for (let index = 0; index < data.inventory.length && uidSet.size > 0;) {
            const unit = data.inventory[index];
            if (uidSet.has(unit.uid)) {
                units[unit.uid] = unit;
                data.inventory.splice(index, 1);
                uidSet.delete(unit.uid);
            } else {
                index++;
            }
        }
        if (uidSet.size > 0) {
            Object.values(units).forEach(unit => data.inventory.push(unit));
            return {
                success: false,
                errors: ['Item(s) not found: ' + [...uidSet].map((uid: Uid) => ('#' + uid)).join(', ')]
            }
        }

        // Execute transition
        for (let index = 0; index < scheme.slots.length; index++) {
            const uid = scheme.slots[index];
            if (uid >= 0) {
                data.inventory.push(reactor.slots[index]);
                reactor.slots[index] = units[uid];
            }
        }
        return { success: true };
    },

    online(): void {
        const onlineTime = Date.now();
        while (onlineTime - data.lastModified >= data.period) {
            tick();
        }

        if (pid < 0) {
            pid = setInterval(() => {
                const now = Date.now();
                tick();
                data.lastModified = now;
            }, data.period);
        }
    },

    offline(): void {
        if (pid >= 0) {
            clearInterval(pid);
            pid = -1;
        }
    },

    _execute(line: string) {
        const [head, ...params] = line.split(/\s+/).filter(s => !!s.length);
        const command = COMMANDS[head];
        if (command) {
            command(params, this);
        }
    },

    getProfile(): Profile {
        return {
            name: data.ownerName,
            reactorCount: data.reactors.length,
            account: data.account,
        };
    },
};

const game = localGameInterface;

export default game;