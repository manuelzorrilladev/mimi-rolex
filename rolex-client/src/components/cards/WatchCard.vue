<script setup>
import GLOBAL_OBJECT from "../../utils/globaj";

defineProps({
  item: Object,
  collection: String,
});

function addComma(price) {
  return `${price.slice(0, price.length - 3)},${price.slice(
    price.length - 3,
    price.length,
  )}`;
}

// {name:'relojes-rolex', params:{collectionName:collection,id:item.modelo}}
</script>

<template>
  <router-link
    :to="`/rolex/${collection}-${item.modelo}`"
    class="bg-rolex-brown-light-1 h-full flex flex-col items-center justify-center py-0 cursor-pointer group"
  >
    <img
      :src="`${GLOBAL_OBJECT.STORAGE_URL}rolex-relojes-new/${item.modelo}-showcase.webp`"
      :alt="item.modelo"
      class="w-full md:w-1/2 lg:w-[55%] xl:w-[60%] duration-200 ease-in-out group-hover:scale-110"
    />
    <div class="w-9/12">
      <p class="font-helvetica font-bold text-[14px]">Rolex</p>
      <p class="font-helvetica font-bold text-[24px]">{{ item.nombre }}</p>
      <p class="font-helvetica font-light text-[14px] text-black">
        {{ item.cajaDelModelo }}
      </p>
      <div class="text-black flex items-center gap-2">
        <h2 class="font-light">
          $ {{ item["rolex-details-v2"].precio.toLocaleString("us-US") }}
        </h2>
      
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
