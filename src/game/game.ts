import { genUid } from '@/utils/number';
import initialize from './buildin';
import { DeployScheme, GameInterface, PurchasementItem, Reactor, ReactorData, ResultReport, ShopItem, Uid, UidMap, Unit, UnitData } from './interfaces';

interface DataType {
    reactors: Reactor[];
    inventory: Unit[];
    shop: ShopItem[];
    period: number;
    lastModified: number;
}

function initializeData(): DataType {
    initialize();
    return {
        reactors: [
            new Reactor({
                width: 9,
                height: 7,
                wallTemparature: 300,
                name: String.fromCharCode(...Array(2 + Math.floor(Math.random() * 5)).fill('a').map((_, i) => (i ? 'a' : 'A').charCodeAt(0) + Math.floor(Math.random() * 26)))
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
    };
}

const data: DataType = initializeData();

const COMMANDS: {[head: string]: (params: string[], game: GameInterface) => any} = {
    "purchase": (params: string[], game: GameInterface) => {
        const cart = params.map(Number).map(uid => ({ uid, count: 1 }));
        game.purchase(cart);
    },
};

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

    purchase(cart: PurchasementItem[]): boolean[] {
        const result: boolean[] = Array(cart.length).fill(false);

        let index = 0;
        for (const { uid, count } of cart) {
            const item = data.shop.find(i => i.uid === uid);
            result[index] = !!item;
            if (item) {
                for (let i = 0; i < count; i++) {
                    const unit = Unit.of(item.protoId, item.ctorParams);
                    data.inventory.push(unit);
                }
            }
            index++;
        }

        return result;
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
            data.reactors.forEach(r => r.tick());
            data.lastModified += data.period;
        }

        if (pid < 0) {
            pid = setInterval(() => {
                const now = Date.now();
                data.reactors.forEach(r => r.tick());
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
    }
};

const game = localGameInterface;

export default game;