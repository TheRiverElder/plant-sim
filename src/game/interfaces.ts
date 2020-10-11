import Reactor from './Reactor';
import ResourcePack from './Res';
import Unit from './Unit';
import UnitProto from './UnitProto';

type Uid = number;
type Id = string;

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

interface DeployAction {
    uid: Uid;
    ruid: Uid;
    tx: number;
    ty: number;
}

interface ResultReport {
    success: boolean;
    errors?: string[] | null;
}

interface GameInterface {
    getShopItemList(): ShopItem[];
    getInventory(): UnitData[];

    purchase(cart: PurchasementItem[]): boolean[];
    deploy(actions: DeployAction[]): ResultReport;

    _execute(line: string): any;
}

export {
    Reactor,
    ResourcePack,
    Unit,
    UnitProto,

    UnitData,
    UnitCtorData,

    Uid,
    ShopItem,
    PurchasementItem,
    DeployAction,
    ResultReport,
    GameInterface,
}