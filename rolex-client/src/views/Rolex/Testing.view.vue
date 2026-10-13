<script setup>

import "vue3-carousel/dist/carousel.css";
import RolexTemplate from "./RolexTemplate.view.vue";
import rolexDataService from "../../services/rolexDataService";
import { onMounted, ref } from "vue";


const isReady = ref(false)
const state = ref([])


onMounted(()=>{
  rolexDataService.getAllForTest().then((d)=>{
    state.value = d.data
    isReady.value = true
  })
})
// nombre, get
</script>

<template>
  <div id="new-models">
    <RolexTemplate>
      <template #content>
        <!-- <div v-if="isReady" class="grid grid-cols-4">
          <div  v-for="item in state.data" :key="item.id" class="border border-black">
            <h2>{{item.info.id}} - {{ item.info.modelo }}</h2>
              <img :src="item.main" class="w-24">
           <p>Slider</p>
              <img v-for="img in item.slider" :key="img" :src="img" class="w-24">

            <div class="flex">

              <h2>Desktop</h2>
              <img v-for="img in item.headers.desktop" :key="img" :src="img" class="w-24">
            </div>
            <div class="flex">
              <h2>Mobile</h2>
              <img v-for="img in item.headers.mobile" :key="img" :src="img" class="w-24">

            </div>
        
          </div>
        </div> -->
        <h2>TestingRoute</h2>
        {{ state }}
     
      </template>
    </RolexTemplate>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.appear-enter-active,
.appear-leave-active {
  transition: 0.3s ease-in-out;
  height: 170px;
}

.appear-enter-from,
.appear-leave-to {
  height: 0px;
}
</style>
