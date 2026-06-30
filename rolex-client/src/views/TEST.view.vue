<script setup>
import axios from "axios";
import RolexTemplate from "./Rolex/RolexTemplate.view.vue";
import rolexDataService from "../services/rolexDataService";
import { onMounted, ref } from "vue";

const all = ref([]);
const isReady = ref(false);
const storageRoute = "http://localhost:3000/storage/rolex-relojes-new";
// showcase ,slider [1,3],headerImage[1,3]
function getAllRolex() {
  rolexDataService
    .getAll()
    .then((d) => {
      all.value = d.data;
      isReady.value = true;
    })
    .catch((e) => {
      console.log(e);
    });
}
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};
onMounted(() => {
  getAllRolex();
});
</script>

<template>
  <RolexTemplate>
    <template #content>
      <div v-if="isReady" class="grid grid-cols-3 gap-3">
        <div v-for="watch in all" class="flex border rounded p-3" @click="copyToClipboard(watch.modelo)">
          <img :src="`${storageRoute}/${watch.modelo}-showcase.webp`" alt="no" class="w-1/2">
          <div>
          
          <h1>Modelo: {{ watch.modelo }} </h1>
          <p class="text-xs italic">{{ watch.isRolexSelection? 'Rolex':'Personalizado' }}</p>

            <div>
            <p>Slider</p>
              <div class="flex" >
                <img v-for="item in 3"  :src="`${storageRoute}/${watch.modelo}-slider-${item}.webp`" alt="no" class="w-1/3">
              </div>
              <p>Headers</p>
              <div class="flex" >
                <img :src="`${storageRoute}/${watch['rolex-headers-v2'].imagen1}.webp`" alt="no" class="w-1/3">
                <img :src="`${storageRoute}/${watch['rolex-headers-v2'].imagen2}.webp`" alt="no" class="w-1/3">
                <img :src="`${storageRoute}/${watch['rolex-headers-v2'].imagen3}.webp`" alt="no" class="w-1/3">
              </div>
            
            
            </div>
          </div>

        </div>
      </div>
    </template>
  </RolexTemplate>
</template>
