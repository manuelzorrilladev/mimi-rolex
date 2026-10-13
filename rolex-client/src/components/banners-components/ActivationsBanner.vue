<script setup>
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { ref } from "vue";
import { computed } from "vue";
import trackTokenService from "../../services/trackTokenService";
import { useRouter } from "vue-router";

const router = useRouter();

const sliderItems = [
  
  {
    src: "lady-datejust",
    link: {name:'rolex-coleccion-lady-datejust'},
    alt: "lady-datejust banner",
    title: "Lady Datejust Banner",
  },  
  
  {
    src: "accesorios",
    link: {name:'rolex-accesorios'},
    alt: "accesorios",
    title: "Accesorios Banner",
  },  
  {
    src: "oyster-story",
    link: {name:'rolex-oyster-story'},
    alt: "oyster-story",
    title: "Oyster Story Banner",
  },  

];


function trackClickEvent(slide) {
  trackTokenService.sendEvent(`${slide.title} Rolex route`, 'Click').then(()=>{
    router.push(slide.link)
  });
}

const currentSlide = ref(0);
</script>

<template>
  <section class="w-full flex flex-col items-center justify-center">
      <div class="relative z-10 flex justify-between items-center w-full">
        <font-awesome-icon
          :icon="['fas', 'chevron-left']"
          class="bg-rolex-grey-light h-4 w-2 px-3 py-2 cursor-pointer rounded-full duration-200 hover:bg-rolex-green hover:text-white md:block hidden absolute z-20 left-0 md:left-10"
          @click="currentSlide--"
        />
        <carousel
          :items-to-show="1"
          v-model="currentSlide"
          :wrapAround="true"
          :autoplay="3000"
          :transition="600"
          class="w-full "
        >
          <slide v-for="slide in sliderItems" :key="slide">
            <button @click="trackClickEvent(slide)" class="group">
              <img
                :src="`/assets/routes-assets/activations/${slide.src}-banner-desktop.webp`"
                :alt="slide.alt"
                class="w-full hidden md:block"
              />
              <img
                :src="`/assets/routes-assets/activations/${slide.src}-banner-mobile.webp`"
                :alt="slide.alt"
                class="w-full block md:hidden"
              />
            </button>
          </slide>
        </carousel>

        
    <div class="flex gap-2 justify-center w-full absolute -bottom-6 md:bottom-10">
      <div v-for="(item,index) in sliderItems" :key="item">
        <div
        class="duration-200  h-2 block rounded hover:bg-rolex-green active:bg-rolex-green"
        @click="currentSlide = index" :class="currentSlide == index?'w-14 bg-rolex-green':'w-4 bg-white'"
      ></div>
      </div>
      
    </div>

        <font-awesome-icon
          :icon="['fas', 'chevron-right']"
          class="bg-rolex-grey-light h-4 w-2 px-3 py-2 cursor-pointer rounded-full duration-200 hover:bg-rolex-green hover:text-white md:block hidden absolute z-10 right-6 md:right-10"
          @click="currentSlide++"
        />
      </div>

  </section>
</template>
