<template>
    <div class="px-5">
        <v-container class="text-left">
            <v-select
                label="Reactor"
                :items="reactorList"
                item-text="name"
                item-value="uid"
                v-model="currentReactorUid"
            />

            <div v-if="reactor">
                <p>Listing State</p>

                <p>Power Buffer: {{ reactor.powerBuffer.toPrecision(4) }} Pu</p>
            </div>
        </v-container>

        <h3>Reactor Layout</h3>

        <ReactorLayout
            v-if="reactor"
            :layout="reactor.layout"
            :slots="reactor.slots"
            @click="select"
        />
        
        <h3>Heatmap</h3>

        <Heatmap
            ref="heatmap"
            v-if="reactor"
            :cell-width="32"
            :width="reactor.layout.width"
            :height="reactor.layout.height"
            :heatmap="reactor.heatmap"
            :max-value="1e5"
            :grid="true"
            @click="select"
        />

        <div v-if="listeningUnit && reactor">
            <span>Pos: ({{ (listeningIndex % reactor.layout.width) }}, {{ Math.floor(listeningIndex / reactor.layout.width) }}) Index: {{ listeningIndex }}</span>

            <UnitInfo :dense="true" :value="listeningUnit"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import game from '@/game/game';
import UnitInfo from '@/components/UnitInfo.vue';
import Heatmap from '@/components/Heatmap.vue';
import { iconOf } from '@/utils/resources';
import ReactorLayout from "@/components/ReactorLayout.vue";
import { ReactorData, UnitData } from '@/game/interface/common-interfaces';
import { Uid, Vector } from '@/game/interface/types';

interface ReactorMonitorData {
    reactorList: ReactorData[];
    currentReactorUid: number;
    reactor: ReactorData | null;
    listeningIndex: number;
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
            listeningIndex: -1,
            listeningUnit: null,
        };
    },

    watch: {
        currentReactorUid(uid: Uid) {
            this.reactor = this.reactorList.find(r => r.uid === uid) || null;
        },

        listeningIndex(index: number) {
            if (this.reactor) {
                this.listeningUnit = this.reactor.slots[index];
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

        select(index: number) {
            this.listeningIndex = index;
        },

        update() {
            this.reactorList = game.getReactorList();
            this.reactor = this.reactorList.find(r => r.uid === this.currentReactorUid) || null;
            if (this.listeningIndex >= 0 && this.reactor) {
                this.listeningUnit = this.reactor.slots[this.listeningIndex];
            } else {
                this.listeningUnit = null;
            }
            if (this.$refs.heatmap) {
                this.$refs.heatmap.update();
            }
        },
    },

    created() {
        this.currentReactorUid = this.reactorList[0]?.uid;
        pid = setInterval(this.update.bind(this), 1000);
    },
    
    mounted() {
        this.update();
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