<template>
    <div
        ref="deployer"
        class="fill d-flex"
        @mousemove="mouseMoveHandler"
        @mouseup="unhold"
        @mouseleave="unhold"
    >
        <v-container class="fill-y d-flex flex-column left pl-5 pt-2">
            <v-row class="flex-grow-0">
                <v-col cols="4">
                    <v-select
                        label="Reactor"
                        :items="reactorList"
                        item-text="name"
                        item-value="uid"
                        :disabled="!!currentReactor"
                        v-model="currentReactorUid"
                    />
                </v-col>

                <v-spacer/>

                <v-col cols="4">
                    <v-checkbox
                        label="Removal"
                        v-model="removal"
                    />
                </v-col>
            </v-row>

            <div v-if="currentReactor" class="center-container flex-grow-1">
                <ReactorLayout
                    :width="currentReactor.width"
                    :height="currentReactor.height"
                    :slots="previewSlots"
                    :items-map="itemsMap"
                    :cell-width="64"
                    @mouseup="replace"
                />
            </div>

            <v-btn @click="deploy">
                {{ textOf("deploy") }}
                <v-icon>mdi-right-arrow</v-icon>
            </v-btn>
        </v-container>

        <v-container class="right fill-y overflow-auto">
            <UnitInfo
                v-for="item of inventory"
                :key="item.uid"
                class="d-flex py-2 px-5 mt-3"
                :value="item"
                :dense="true"
                :disabled="occupyCounters[item.uid] > 0"
                @mousedown="hold"
            />
        </v-container>

        <v-img
            v-if="holding >= 0"
            ref="holding"
            class="holding"
            width="64"
            height="64"
            contain
            :src="iconOf(itemsMap[holding].protoId)"
        />
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import game from "@/game/game";
import {
    Uid,
    UnitData,
    ReactorData, 
    UidMap,
} from "@/game/interfaces";
import UnitInfo from "@/components/UnitInfo.vue";
import ReactorLayout from "@/components/ReactorLayout.vue";
import { iconOf, nameOf, textOf } from "@/utils/resources";
import { makeUidMap } from "@/utils/arrays";
import { Vector } from "@/game/types";

interface DeployerData {
    reactorList: ReactorData[];
    inventory: UnitData[];
    itemsMap: { [uid: number]: UnitData };
    currentReactorUid: Uid;
    currentReactor: ReactorData | null;
    preview: Array<Uid>;
    holding: Uid;
    occupyCounters: UidMap<number>;
    removal: boolean;
}

interface DeployerComputed {
    previewSlots: Array<UnitData>;
}

interface DeployerMethods {
    nameOf(id: string): string;
    textOf(id: string): string;
    iconOf(protoId: string): string ;
    unhold(): void;
    hold(uid: Uid, event: MouseEvent): void;
    deploy(): void;
    mouseMoveHandler(event: MouseEvent): void;
    replace(pos: Vector): void;
}

export default Vue.extend<DeployerData, DeployerMethods, DeployerComputed, {}>({
    name: "Deployer",

    components: {
        UnitInfo,
        ReactorLayout,
    },

    data(): DeployerData {
        return {
            reactorList: [],
            inventory: [],
            itemsMap: {},
            currentReactorUid: -1,
            currentReactor: null,
            preview: [],
            holding: -1,
            occupyCounters: {},
            removal: false,
        };
    },

    watch: {
        currentReactorUid(uid: Uid) {
            const reactor = this.reactorList.find((r) => r.uid === uid) || null;
            this.currentReactor = reactor;
            if (reactor) {
                this.preview = reactor.slots.map((u) => u.uid);
                this.occupyCounters = Object.fromEntries(this.inventory.map(u => [u.uid, 0]));
            }
        },
    },

    computed: {
        previewSlots() {
            const reactor = this.currentReactor;
            return reactor ? this.preview.map((uid: Uid, i: number) => this.itemsMap[uid] || reactor.slots[i]) : [];
        }
    },

    methods: {
        nameOf,
        textOf,

        iconOf(protoId: string): string {
            return iconOf(protoId || "");
        },

        unhold() {
            this.holding = -1;
        },

        hold(uid: Uid, event: MouseEvent) {
            if (!this.occupyCounters[uid]) {
                this.holding = uid;
            }
            event.stopPropagation();
        },

        deploy() {
            const reactor = this.currentReactor;
            if (!reactor) return;
            const result = game.deploy({
                reactorUid: this.currentReactorUid,
                slots: this.preview.map((uid, i) => uid === reactor.slots[i].uid ? -1 : uid),
            });
            if (result.success) {
                this.$router.push("/reactor-monitor");
            } else {
                console.log(result.errors);
            }
        },

        mouseMoveHandler(event: MouseEvent) {
            if (this.holding >= 0) {
                const h = (this.$refs.holding as Vue)?.$el as HTMLElement;
                if (h) {
                    const bounding = (this.$refs.deployer as HTMLDivElement).getBoundingClientRect();
                    h.style.left = (event.clientX - bounding.left - 32) + "px";
                    h.style.top = (event.clientY - bounding.top - 32) + "px";
                }
            }
        },

        replace({ x, y }: Vector) {
            const index = y * (this.currentReactor?.width || 0) + x;
            if (!this.removal) {
                if (this.holding >= 0) {
                    if (this.preview[index] >= 0) {
                        this.occupyCounters[this.preview[index]]--;
                    }
                    this.preview = this.preview.slice();
                    this.preview[index] = this.holding;
                    this.occupyCounters[this.holding]++;
                    this.holding = -1;
                }
            } else {
                if (this.preview[index] >= 0) {
                    this.occupyCounters[this.preview[index]]--;
                }
                this.preview = this.preview.slice();
                this.preview[index] = -1;
            }
        },
    },

    created() {
        this.reactorList = game.getReactorList();
        this.inventory = game.getInventory();
        this.itemsMap = makeUidMap(this.inventory);
    },
});
</script>

<style scoped>
.left {
    flex: 8;
}
.right {
    flex: 4;
}
.holding {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
}
</style>