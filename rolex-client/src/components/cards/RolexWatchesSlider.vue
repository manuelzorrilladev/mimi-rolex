<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { filename } from "pathe/utils";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";
import WatchCard from '../cards/WatchCard.vue';
import rolexDataService from "../../services/rolexDataService.js";
import Button from '../global-components/Button.vue';
const route = useRoute();
const { width } = useWindowSize();
const isDesktop = computed(() => {
  return width.value >= 1024 ? true : false;
});
const isReady = ref(false)

const currentSlide = ref(0);
const breakpoints = {
  300: {
    itemsToShow: 2,
    snapAlign: "center",
  },
  1024: {
    // 1024 and up
    itemsToShow: 4,
    snapAlign: "start",
  },
};



const carouselNavigation = computed(() => {
  return isDesktop.value
    ? sliderInfo.value.length - 4
    : sliderInfo.value.length - 2;
});

const sliderInfo = ref([])

function updateSlide(dir) {
  if (dir === "next") {
    if (
      currentSlide.value <
      sliderInfo.value.length - (isDesktop.value ? 4 : 2)
    ) {
      currentSlide.value++;
    } else {
      currentSlide.value = 0;
    }
  } else {
    if (currentSlide.value > 0) {
      currentSlide.value--;
    } else {
      currentSlide.value = sliderInfo.value.length - (isDesktop.value ? 4 : 2);
    }
  }
}

function getQuery(){
    rolexDataService.get10RandomRolex()
    .then((d)=>{
        sliderInfo.value = d.data
        isReady.value = true 
    }).catch((e)=>{
        console.log(e);
    })
}
onMounted(getQuery)

onUnmounted(()=>{
  isReady.value = false
})

setInterval(() => {
  // updateSlide("next");
}, 5000);
</script>

<template>
  <section
   v-if="isReady && sliderInfo.length > 0"
    class="py-8 w-full flex flex-col items-center justify-center "
  > 

    <h2 class="font-bold mb-4 w-10/12 text-4xl font-helvetica text-rolex-brown ">
      Nuestra selección Rolex
    </h2>
    
    <div
      id="carousel"
      class="w-full md:w-11/12 flex items-center justify-center gap-4"
      v-if="isReady"
    >
      <carousel
        :items-to-show="isDesktop ? 4 : 2"
        :snap-align="'start'"
        v-model="currentSlide"
        :itemsToScroll="2"
        :transition="600"
        class="w-11/12 md:w-full"
      >
        <slide v-for="slide in sliderInfo" :key="slide">
           <WatchCard
            :item="slide"
            :collection="slide['Rolex-collection'].idName"
            class="mx-2 "
          />
        </slide>
      </carousel>
    </div>

    <div v-if="isDesktop " class="flex gap-2 my-4">
      <div
        v-for="(item, index) in carouselNavigation"
        :key="item"
        class="h-6 flex items-center"
        @click="currentSlide = index"
      >
        <div
          class="duration-200 h-1 block rounded-sm hover:bg-rolex-green active:bg-rolex-green"
          :class="
            currentSlide == index
              ? 'w-14 bg-rolex-green'
              : 'w-6 bg-rolex-grey-light'
          "
        ></div>
      </div>
    </div>
    <Button :link="{name:'filters'}">Ver más</Button>
  </section>
</template>

<style scoped></style>
