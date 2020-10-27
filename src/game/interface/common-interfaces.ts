import ResourcePack from '../Res';
import { UnitParams } from './server-interfaces';
import { Id, Uid, Vector } from './types';

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

interface BaseTag {
    uid: Uid;
    protoId: Id;
    [prop: string]: any;
}

interface UnitData extends BaseTag {
    heat: number;
    mass: number;
    duration: number;
}

interface ReactorData extends BaseTag {
    name: string;
    powerBuffer: number;
    slots: Array<UnitData>;
    layout?: Layout;
    heatmap?: number[][];
}

interface ShopItem {
    uid: Uid;
    price: number;
    params: UnitParams;
}

interface ServerInterface {
    getShopItemList(): Array<ShopItem>;
    getReactorList(): Array<ReactorData>;
    getInventory(): Array<UnitData>;
    getProfile(): Profile;

    purchase(cart: PurchasementItem[]): ResultReport;
    deploy(scheme: DeployScheme): ResultReport;

    online(): void;
    offline(): void;

    _execute(line: string): any;
}

export {
    ResourcePack,

    BaseTag,
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