import ResourcePack from '../Res';
import { UnitCtorParams } from './server-interfaces';
import { Id, IdNumberMap, Uid, Vector } from './types';

interface Layout {
    width: number;
    height: number;
    slots: Array<Vector>;
}

interface PurchasementItem {
    uid: Uid;
    count: number;
}

interface DeployScheme {
    reactorUid: Uid;
    slots: Array<number>;
}

interface ResultReport {
    success: boolean;
    errors?: string[] | null;
}

interface Profile {
    name: string;
    reactorCount: number;
    account: number;
}

interface UnitData {
    uid: Uid;
    heat: number;
    mass: number;
    duration: number;
    protoId: Id;
    data: IdNumberMap;
}

interface ReactorData {
    uid: Uid;
    name: string;
    powerBuffer: number;
    slots: UnitData[];
    layout: Layout;
    heatmap?: number[][];
}

interface ShopItem {
    uid: Uid;
    price: number;
    protoId: string;
    params: UnitCtorParams;
}

interface ServerInterface {
    getShopItemList(): ShopItem[];
    getReactorList(): ReactorData[];
    getInventory(): UnitData[];
    getProfile(): Profile;

    purchase(cart: PurchasementItem[]): ResultReport;
    deploy(scheme: DeployScheme): ResultReport;

    online(): void;
    offline(): void;

    _execute(line: string): any;
}

export {
    ResourcePack,

    UnitData,
    ReactorData,
    Profile,
    ShopItem,
    PurchasementItem,
    DeployScheme,
    ResultReport,
    Layout,
    ServerInterface,
}