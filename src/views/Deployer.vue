<template>
    <div
        ref="deployer"
        class="fill px-2 overflow-hidden d-flex flex-column"
        @mousemove="mouseMoveHandler"
        @mouseleave="unhold"
    >
        <div class="py-2 flex-grow-0 flex-shrink-0 d-flex align-center">
            <v-select
                class="flex-grow-1 flex-shrink-1"
                label="Reactor"
                :items="reactorList"
                item-text="name"
                item-value="uid"
                :disabled="!!currentReactor"
                v-model="currentReactorUid"
                dense
                hide-details
            />

            <v-btn class="mx-2" color="warning" @click="reset">{{ textOf('reset') }}</v-btn>

            <v-btn color="primary" @click="deploy">
                <span v-text="textOf('deploy')" />
            </v-btn>
        </div>

        <ReactorLayout
            class="flex-shrink-0"
            v-if="currentReactor"
            :layout="currentReactor.layout"
            :slots="preview"
            @click="replace"
        />

        <v-divider/>

        <div class="flex-grow-1 overflow-auto">
            <UnitInfo
                v-for="(item, index) of inventory"
                :key="item.uid"
                class="d-flex py-2 px-5 mt-3"
                :value="item"
                :dense="true"
                :line="true"
                :icon-size="32"
                :disabled="holdingIndex === index"
                @click="hold(index)"
            />
        </div>

        <img
            v-if="holdingIndex >= 0"
            ref="holding"
            class="holding"
            width="64"
            height="64"
            contain
            :src="iconOf(inventory[holdingIndex].protoId)"
        />
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import game from "@/game/game";
import { UnitData, ReactorData } from "@/game/interface/common-interfaces";
import UnitInfo from "@/components/UnitInfo.vue";
import ReactorLayout from "@/components/ReactorLayout.vue";
import { iconOf, nameOf, textOf } from "@/utils/resources";
import { Uid } from '@/game/interface/types';

interface DeployerData {
    reactorList: ReactorData[];
    initiateInventory: Array<UnitData>;
    inventory: UnitData[];
    currentReactorUid: Uid;
    currentReactor: ReactorData | null;
    preview: Array<UnitData>;
    holdingIndex: number;
}

interface DeployerComputed {
    previewSlots: Array<UnitData>;
}

interface DeployerMethods {
    nameOf(id: string): string;
    textOf(id: string): string;
    iconOf(protoId: string): string;
    unhold(): void;
    hold(uid: Uid, event: MouseEvent): void;
    deploy(): void;
    mouseMoveHandler(event: MouseEvent): void;
    replace(index: number, event: MouseEvent): void;
    reset(): void;
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
            initiateInventory: [],
            inventory: [],
            currentReactorUid: -1,
            currentReactor: null,
            preview: [],
            holdingIndex: -1,
        };
    },

    watch: {
        currentReactorUid(uid: Uid) {
            const reactor = this.reactorList.find((r) => r.uid === uid) || null;
            this.currentReactor = reactor;
            this.reset();
        },
    },

    methods: {
        nameOf,
        textOf,

        iconOf(protoId: string): string {
            return iconOf(protoId || "");
        },

        unhold() {
            this.holdingIndex = -1;
        },

        hold(index: number) {
            this.holdingIndex = index;
            // event.stopPropagation();
        },

        deploy() {
            const reactor = this.currentReactor;
            if (!reactor) return;
            const result = game.deploy({
                reactorUid: this.currentReactorUid,
                slots: this.preview.map(s => s.uid).map((uid, i) =>
                    uid === reactor.slots[i].uid ? -1 : uid
                ),
            });
            if (result.success) {
                this.$router.push("/reactor-monitor");
            } else {
                console.log(result.errors);
            }
        },

        mouseMoveHandler(event: MouseEvent) {
            if (this.holdingIndex >= 0) {
                const h = (this.$refs.holding as Vue)?.$el as HTMLElement;
                if (h) {
                    const bounding = (this.$refs.deployer as HTMLDivElement).getBoundingClientRect();
                    h.style.left = event.clientX - bounding.left - 32 + "px";
                    h.style.top = event.clientY - bounding.top - 32 + "px";
                }
            }
        },

        replace(index: number, event: MouseEvent) {
            event.stopPropagation();
            let old = null;
            const newPreview = this.preview.slice();
            if (this.preview[index].protoId !== 'empty') {
                old = this.preview[index];
                if (this.holdingIndex < 0 && this.currentReactor) {
                    const prev = this.currentReactor.slots[index];
                    if (prev.protoId === 'empty') {
                        newPreview[index] = prev;
                    } else {
                        newPreview[index] = {
                            uid: 0,
                            protoId: 'empty',
                            heat: 0,
                            mass: 0,
                            duration: 1,
                        };
                    }
                }
            }
            if (this.holdingIndex >= 0) {
                newPreview[index] = this.inventory[this.holdingIndex];
                if (old) {
                    this.inventory.splice(this.holdingIndex, 1, old);
                } else {
                    this.inventory.splice(this.holdingIndex, 1);
                }
            } else if (old) {
                this.inventory.push(old);
            }
            this.preview = newPreview;
            this.holdingIndex = -1;
        },

        reset() {
            this.inventory = this.initiateInventory.slice();
            if (this.currentReactor) {
                this.preview = this.currentReactor.slots.slice();
            } else {
                this.preview = [];
            }
            this.holdingIndex = -1;
        },
    },

    created() {
        this.reactorList = game.getReactorList();
        this.initiateInventory = game.getInventory();
        this.reset();
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