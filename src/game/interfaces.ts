import Reactor from './Reactor';
import ResourcePack from './Res';
import Unit from './Unit';
import UnitProto from './UnitProto';

type Uid = number;
type Id = string;

type UidMap<T> = { [uid: number]: T}

interface UnitCtorData {
    heat: number;
    mass: number;
    duration: number;
    id?: Uid;
    [prop: string]: any;
}

interface ShopItem {
    uid: Uid;
    price: number;
    protoId: string;
    ctorParams: UnitCtorData;
}

interface PurchasementItem {
    uid: Uid;
    count: number;
}

interface UnitData {
    uid: Uid;
    heat: number;
    mass: number;
    duration: number;
    protoId: Id;
    [prop: string]: any;
}

interface ReactorData {
    uid: Uid;
    name: string;
    width: number;
    height: number;
    power: number;
    powerRate: number;
    slots: UnitData[];
    heatmap?: number[][];
}

interface DeployScheme {
    reactorUid: Uid;
    slots: Array<number>;
}

interface ResultReport {
    success: boolean;
    errors?: string[] | null;
}

interface GameInterface {
    getShopItemList(): ShopItem[];
    getReactorList(): ReactorData[];
    getInventory(): UnitData[];

    purchase(cart: PurchasementItem[]): boolean[];
    deploy(scheme: DeployScheme): ResultReport;

    online(): void;
    offline(): void;

    _execute(line: string): any;
}

export {
    Reactor,
    ResourcePack,
    Unit,
    UnitProto,

    UnitData,
    ReactorData,
    UnitCtorData,

    Uid,
    UidMap,
    ShopItem,
    PurchasementItem,
    DeployScheme,
    ResultReport,
    GameInterface,
}