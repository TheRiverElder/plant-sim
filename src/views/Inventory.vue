<template>
    <div class="fill d-flex flex-column">
        <v-container class="flex-grow-1">
            <UnitInfo
                v-for="item of inventory"
                :key="item.uid"
                :value="item"
                :dense="true"
                class="d-flex py-2 px-5 mt-3"
            />
        </v-container>

        <div class="d-flex justify-center align-center py-3 px-10 white">
            
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import game from '@/game/game';
import { UnitData } from '@/game/interfaces';
import { toEconomic } from '@/utils/number';
import UnitInfo from '@/components/UnitInfo.vue';

interface InventoryData {
    // visiblePropertyKeys: { 
    //     key: string; 
    //     color: string; 
    //     toValueStr: (value: number) => string;
    //     toProgress: (value: number) => number;
    // } [];
    inventory: UnitData[];
}

export default Vue.extend({
    name: 'Inventory',

    components: {
        UnitInfo,
    },

    data(): InventoryData {
        return {
            inventory: [],
        };
    },

    created() {
        this.inventory = game.getInventory();
    },
})
</script>