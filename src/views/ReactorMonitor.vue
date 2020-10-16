<template>
    <div class="fill d-flex px-5">
        <v-container class="info-panel">
            <v-select
                label="Reactor"
                :items="reactorList"
                item-text="name"
                item-value="uid"
                v-model="currentReactorUid"
            />

            <p>Listing State</p>

            <p>Total Power: {{ reactor.power.toPrecision(2) }} Pu</p>

            <p>PowerRate: {{ reactor.powerRate.toPrecision(4) }} Pu/t</p>

            <div v-if="listeningUnit">
                <span>Pos: ({{ listeningPos.x }}, {{ listeningPos.y }})</span>

                <UnitInfo :dense="true" :value="listeningUnit"/>
            </div>
        </v-container>

        <div class="flex-grow-1 center-container flex-column">
            <div class="center-container">
                <ReactorLayout
                    v-if="reactor"
                    :width="reactor.width"
                    :height="reactor.height"
                    :slots="reactor.slots"
                    @click="select"
                />
            </div>

            <Heatmap
                ref="heatmap"
                v-if="reactor"
                :cell-width="32"
                :width="reactor.width"
                :height="reactor.height"
                :heatmap="reactor.heatmap"
                :max-value="1e5"
                :grid="true"
                @click="select"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import game from '@/game/game';
import { Uid, UnitData, ReactorData, UidMap } from '@/game/interfaces';
import UnitInfo from '@/components/UnitInfo.vue';
import Heatmap from '@/components/Heatmap.vue';
import { iconOf } from '@/utils/resources';
import { makeUidMap } from '@/utils/arrays';
import ReactorLayout from "@/components/ReactorLayout.vue";
import { Vector } from '@/game/types';

interface ReactorMonitorData {
    reactorList: ReactorData[];
    currentReactorUid: number;
    reactor: ReactorData | null;
    listeningPos: Vector | null;
    listeningUnit: UnitData | null;
}

let pid: number | null = null;

export default Vue.extend({
    name: 'ReactorMonitor',

    components: {
        UnitInfo,
        Heatmap,
        ReactorLayout,
    },

    data(): ReactorMonitorData {
        return {
            reactorList: [],
            currentReactorUid: -1,
            reactor: null,
            listeningPos: null,
            listeningUnit: null,
        };
    },

    watch: {
        currentReactorUid(uid: Uid) {
            this.reactor = this.reactorList.find(r => r.uid === uid) || null;
        },

        listeningPos(pos: Vector) {
            if (this.reactor) {
                this.listeningUnit = this.reactor.slots[this.reactor.width * pos.y + pos.x];
            } else {
                this.listeningUnit = null;
            }
        },
    },

    methods: {
        unitAt(x: number, y: number) {
            const reactor = this.reactor;
            return reactor ? reactor.slots[reactor.width * y + x] : null;
        },

        iconOf(unit?: UnitData): string {
            return iconOf(unit?.protoId || '');
        },

        select(pos: Vector) {
            this.listeningPos = pos;
        },

        update() {
            this.reactorList = game.getReactorList();
            this.reactor = this.reactorList.find(r => r.uid === this.currentReactorUid) || null;
            if (this.listeningPos && this.reactor) {
                this.listeningUnit = this.reactor.slots[this.reactor.width * this.listeningPos.y + this.listeningPos.x];
            } else {
                this.listeningUnit = null;
            }
            if (this.$refs.heatmap) {
                this.$refs.heatmap.update();
            }
        },
    },

    created() {
        this.update();
        this.currentReactorUid = this.reactorList[0]?.uid;
        pid = setInterval(this.update.bind(this), 1000);
    },
    
    beforeDestroy() {
        clearInterval(pid as number);
    },
})
</script>

<style scoped>
.info-panel {
    width: 30%;
}
</style>