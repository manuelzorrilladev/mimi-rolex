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
    class="bg-rolex-brown-light-1 w-full h-106 flex flex-col items-center justify-center  cursor-pointer group"
  >
    <div class="flex justify-center items-center w-full h-72  overflow-hidden">
      <img
        :src="`${GLOBAL_OBJECT.STORAGE_URL}rolex-relojes-new/${item.modelo}-showcase.webp`"
        :alt="item.modelo"
        class=" h-full duration-200 ease-in-out group-hover:scale-110 "
      />
    </div>
    <div class="w-full md:min-w-72 py-1 px-6 h-36 ">
      <p
        class="font-helvetica font-bold text-[14px] leading-2 text-rolex-brown"
      >
        Rolex
      </p>
      <p class="font-helvetica font-bold text-[24px] text-rolex-brown">
        {{ item.nombre }}
      </p>
      <p class="font-helvetica font-light text-[14px] text-rolex-brown w-full">
        {{ item.cajaDelModelo }}
      </p>
      <div class="text-rolex-brown flex items-center gap-2">
        <h2 class="font-light">
          $ {{ item["rolex-details-v2"].precio.toLocaleString("us-US") }}
        </h2>
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
