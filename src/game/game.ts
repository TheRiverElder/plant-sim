import { genUid } from '@/utils/number';
import initialize from './buildin';
import { DeployAction, GameInterface, PurchasementItem, Reactor, ResultReport, ShopItem, Uid, Unit, UnitData } from './interfaces';

interface DataType {
    reactors: Reactor[];
    inventory: Unit[];
    shop: ShopItem[];
}

function initializeData(): DataType {
    initialize();
    return {
        reactors: [],
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
    };
}

const data: DataType = initializeData();

const COMMANDS: {[head: string]: (params: string[], game: GameInterface) => any} = {
    "deploy": (params: string[], game: GameInterface) => {
        const [uid, ruid, tx, ty] = params.map(Number);
        game.deploy([{ uid, ruid, tx, ty }]);
    },
    "purchase": (params: string[], game: GameInterface) => {
        const cart = params.map(Number).map(uid => ({ uid, count: 1 }));
        game.purchase(cart);
    },
};

const localGameInterface: GameInterface = {
    getShopItemList(): ShopItem[] {
        return data.shop.map((si) => Object.assign({}, si));
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

    deploy(actions: DeployAction[]): ResultReport {
        for (let index = 0; index < actions.length; index++) {
            const { uid, ruid, tx, ty } = actions[index];
            const unit = data.inventory.find(u => u.uid === uid);
            const reactor = data.reactors.find(r => r.uid === ruid);
            if (reactor) {
                reactor.setUnit(tx, ty, unit);
            }
        }
        return { success: true };
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