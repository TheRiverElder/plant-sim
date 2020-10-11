<template>
    <div class="fill d-flex flex-column">
        <v-container class="flex-grow-1">
            <v-card
                v-for="item of inventory"
                :key="item.uid"
                class="d-flex py-2 px-5 mt-3"
            >
                <v-img
                    class="flex-grow-0 my-2 mr-3"
                    width="128"
                    height="128"
                    contain
                    :src="iconOf(item.protoId)"
                />

                <div class="flex-grow-1 text-left d-flex flex-column">
                    <h4 class="my-2">{{ nameOf(item.protoId) }}</h4>

                    <span class="text-subtitle-1 grey--text px-5">{{ descOf(item.protoId) }}</span>

                    <v-progress-linear 
                        v-for="pair of propertiesOf(item)"
                        :key="pair.key"
                        :color="pair.color"
                        :value="pair.progress"
                        :height="25"
                        striped
                    >
                        <strong>{{ textOf(pair.key) }}: {{ pair.valueStr }}</strong>
                    </v-progress-linear>
                </div>
            </v-card>
        </v-container>

        <div class="d-flex justify-center align-center py-3 px-10 white">
            
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import game from '@/game/game';
import { UnitData } from '@/game/interfaces';
import { nameOf, iconOf, descOf, textOf } from "../utils/resources";
import { toEconomic } from '@/utils/number';

interface InventoryData {
    visiblePropertyKeys: { 
        key: string; 
        color: string; 
        toValueStr: (value: number) => string;
        toProgress: (value: number) => number;
    } [];
    inventory: UnitData[];
}

export default Vue.extend({
    name: 'Inventory',

    data(): InventoryData {
        return {
            visiblePropertyKeys: [
                { 
                    key: 'heat', 
                    color: 'red', 
                    toValueStr: String, 
                    toProgress: v => v / 1e4,
                }, 
                { 
                    key: 'mass', 
                    color: 'yellow', 
                    toValueStr: String, 
                    toProgress: v => v / 1e4,
                }, 
                { 
                    key: 'duration', 
                    color: 'green', 
                    toValueStr: value => (value * 100).toFixed(2) + '%', 
                    toProgress: v => v * 100,
                }, 
            ],
            inventory: [],
        };
    },

    methods: {
        nameOf,
        descOf,
        iconOf,
        textOf,

        propertiesOf(unit: UnitData) {
            return this.visiblePropertyKeys.map(({ key, color, toValueStr, toProgress }) => ({ 
                key, 
                color, 
                value: unit[key] || 0,
                valueStr: toValueStr(unit[key]),
                progress: toProgress(unit[key])
            }));
        }
    },

    created() {
        this.inventory = game.getInventory();
    },
})
</script>