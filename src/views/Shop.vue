<template>
    <div class="overflow-hidden fill d-flex flex-column">
        <v-container class="overflow-auto flex-grow-1">
            <v-row
                class="px-2"
                v-for="(item, index) of items"
                :key="item.uid"
            >
                <v-card class="fill-x d-flex py-2 px-5 mt-3">
                    <img
                        class="flex-grow-0 my-2 mr-3"
                        width="64"
                        height="64"
                        contain
                        :src="iconOf(item.protoId)"
                    />

                    <div class="flex-grow-1 d-flex flex-column">
                        <h3 class="my-2">{{ nameOf(item.protoId) }}</h3>
                    </div>

                    <div class="price-wrapper flex-shrink-0 fit-height align-self-end d-flex flex-column align-end pb-2">
                        <v-chip class="fill-x mb-3 align-self-start d-flex">
                            <span>{{ textOf('price') }}</span> 
                            
                            <v-spacer/>

                            <span>{{ item.price | toEco }}</span>
                        </v-chip>
                        
                        <div class="price-input-wrapper">
                            <NumberInput
                                v-model="counts[index]"
                            />
                        </div>
                    </div>
                </v-card>

                <span class="text-left text-subtitle-1 grey--text px-5">{{ descOf(item.protoId) }}</span>

                <v-divider/>
            </v-row>
        </v-container>

        <div class="d-flex justify-center align-center py-3 px-10 white">
            <h1>{{ totalPrice | toEco }}</h1>

            <v-spacer/>

            <v-btn 
                color="primary" 
                rounded
                :disabled="!totalPrice" 
                @click="purchase"
            >Purchase</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import game from "@/game/game";
import { ShopItem } from "@/game/interfaces";
import Vue from "vue";
import { nameOf, iconOf, descOf, textOf } from "../utils/resources";
import { toEconomic } from '../utils/number';
import NumberInput from '@/components/NumberInput.vue';

interface ShopData {
    items: ShopItem[];
    counts: number[];
}

export default Vue.extend({
    components: {
        NumberInput,
    },

    data(): ShopData {
        return {
            items: [],
            counts: [],
        };
    },

    computed: {
        totalPrice(): number {
            return this.items.reduce((s: number, { price }: ShopItem, i: number) => s + price * this.counts[i], 0);
        },
    },

    methods: {
        nameOf,
        descOf,
        iconOf,
        textOf,

        toEconomic,

        purchase() {
            const r = confirm(`R U sure to buy this(these) items (Cost ${toEconomic(this.totalPrice)})?`);
            if (r) {
                const cart = [];
                for (let i = 0; i < this.items.length; i++) {
                    const count = this.counts[i];
                    if (count > 0) {
                        cart.push({
                            uid: this.items[i].uid,
                            count,
                        });
                    }
                }
                game.purchase(cart);
                this.$router.push('/inventory');
            }
        },
    },

    created() {
        this.items = game.getShopItemList();
        this.counts = Array(this.items.length).fill(0);
    },
});
</script>

<style scoped>
.price-wrapper {
    width: 8em;
}
.price-input-wrapper {
    width: 6em;
}
.desc {
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>