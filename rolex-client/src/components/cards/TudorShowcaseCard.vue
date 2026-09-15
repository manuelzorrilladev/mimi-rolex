<script setup>
import { ref } from 'vue';
import GLOBAL_OBJECT from '../../utils/globaj';

const {items}= defineProps(['items'])

function formatToUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
function replaceBadChar(str){
  return str.replace('/','_')
}
</script>

<template>
    <RouterLink :to="{ name: 'relojProducto', params: { id: items.serie } }" class="font-tudor font-black text-center ">
      <img :src="`${GLOBAL_OBJECT.STORAGE_URL}store-products/${replaceBadChar(items.serie)}-1.webp`" :alt="`${items.serie}`" class="py-8 bg-neutral-100" >
        <h2 class="font-tudor-title text-sm md:text-md">TUDOR </h2>
        <h2 class="font-light text-neutral-800 text-xs">{{items.serie}}</h2>
        <h2 class="uppercase  md:text-xl font-tudor-title">{{ items.nombre }}</h2>
        <h2 class="font-light">{{ formatToUSD(items.precio) }}</h2>
    </RouterLink>
</template>

<style scoped></style>
