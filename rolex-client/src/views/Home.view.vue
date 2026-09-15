<script setup>
import { useElementVisibility } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import POSBanner from '../components/banners-components/POSBanner.vue';
import trackTokenService from "../services/trackTokenService.js";


const router = useRouter();
const target = useTemplateRef("target");
const targetIsVisible = useElementVisibility(target);

const links = [
  "/rolex/deepsea",
  "/rolex/accesorios",
  "/novedades/tudor"
];

const counter = ref(0);
const IMAGE_QUANTITY = links.length;
let carouselInterval = null;

const startCarousel = () => {
  stopCarousel();
  carouselInterval = setInterval(() => {
    counter.value = (counter.value + 1) % IMAGE_QUANTITY;
  }, 5000);
};

const stopCarousel = () => { 
  if (carouselInterval) clearInterval(carouselInterval); 
};

const changeCounter = (direction) => {
  if (direction === 'r') {
    counter.value = (counter.value + 1) % IMAGE_QUANTITY;
  } else {
    counter.value = (counter.value - 1 + IMAGE_QUANTITY) % IMAGE_QUANTITY;
  }
};

onMounted(startCarousel);
onUnmounted(stopCarousel); 

const checkClick = (pos) => router.push(links[pos]);
function trackClickEvent(name,pos) {
  trackTokenService.sendEvent(name, 'Click');
  checkClick(pos)
}
const trackStyle = computed(() => ({
  transform: `translateX(-${counter.value * 100}%)`
}));
</script>

<template>
  <div id="main-content" class="font-montserrat">
    <!-- Carousel Hero Header -->
    <div class="relative z-0 h-[480px] md:h-[650px] w-full pb-20 overflow-hidden">
      
      <div 
        class="flex duration-500 ease-in-out h-full cursor-pointer" 
        :style="trackStyle"
        @mouseenter="stopCarousel" 
        @mouseleave="startCarousel"
      >
        <div 
          v-for="(link, index) in links" 
          :key="index" 
          class="min-w-full h-full" 
          @click="trackClickEvent(`Carrusel de inicio pos #${index}`, index)"
        >
          <picture>
            <source 
              media="(min-width: 768px)" 
              :srcset="`/assets/routes-assets/headers/${index + 1}-desktop.webp`" 
            />
            <img 
              :src="`/assets/routes-assets/headers/${index + 1}-mobile.webp`" 
              :alt="`Rolex Header ${index + 1}`"
              width="1920"
              height="650"
              class="w-full h-full object-cover"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              :loading="index === 0 ? 'eager' : 'lazy'" 
            />
          </picture>
        </div>
      </div>

      <!-- Chevron Controis con SVG inline nativo para eliminar el bundle de FontAwesome -->
      <button 
        aria-label="Previous" 
        @click="changeCounter('l')"
        class="absolute top-[45%] left-2 md:left-10 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 md:bg-main-green hover:bg-white duration-200"
      >
        <svg class="w-5 h-5 text-rolex-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        aria-label="Next" 
        @click="changeCounter('r')"
        class="absolute top-[45%] right-2 md:right-10 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 md:bg-main-green hover:bg-white duration-200"
      >
        <svg class="w-5 h-5 text-rolex-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Sección Principal -->
    <main class="pt-14">
      <section>
        <div id="joyeria" class="mt-8 flex flex-col items-center justify-start pt-10 mb-20 text-neutral-600">
          <div class="mb-4 flex flex-col md:flex-row items-center justify-center w-full">
            <span class="block h-px w-1/3 md:w-1/6 bg-neutral-300"></span>
            <h1 class="text-center text-2xl md:text-3xl tracking-widest mx-4 my-4 font-medium uppercase">
              Presente en tus momentos especiales
            </h1>
            <span class="block h-px w-1/3 md:w-1/6 bg-neutral-300"></span>
          </div>
        </div>

        <div ref="target">
          <div v-if="targetIsVisible" id="home-section" class="flex flex-col md:flex-row items-center justify-evenly gap-10 text-neutral-700 w-full px-4">
            <div class="w-full md:w-1/3 overflow-hidden">
              <img 
                class="w-full duration-500 hover:scale-105" 
                loading="lazy"
                width="600"
                height="600"
                src="/assets/routes-assets/Home/home-1.webp" 
                alt="Colección Joyería" 
              />
            </div>
            <div class="w-full md:w-1/3 text-center">
              <h2 class="my-4 text-3xl uppercase">Una joya que te complementa</h2>
              <p class="mb-8 text-xl">Descubre un mundo de opciones en joyería para ti.</p>
              <router-link to="/joyeria" class="inline-block bg-neutral-500 px-8 py-4 rounded-lg text-white shadow-lg hover:bg-neutral-600 transition-colors">
                DESCUBRIR
              </router-link>
            </div>
          </div>

          <POSBanner v-if="targetIsVisible" class="mt-36 mb-10" />

          <div 
            id="home-section-2"
            class="flex flex-col md:flex-row-reverse items-center justify-evenly gap-8 h-screen text-neutral-700"
          >
            <img 
              class="w-3/4 md:w-1/3 duration-500 hover:scale-110" 
              loading="lazy"
              width="600"
              height="600"
              src="/assets/routes-assets/Home/home-2.webp"
              alt="brazaletes-oro" 
            />
            <div class="w-3/4 md:w-1/3 text-center">
              <h2 class="text-3xl">NUEVA COLECCIÓN</h2>
              <p class="my-6 text-xl">
                Encuentra aquí nuestras nuevas esclavas en ORO 18KT.
              </p>
              <p class="text-xl">¡Hay una perfecta para ti!</p>
            </div>
          </div>

          <div id="relojes">
            <div class="flex flex-col md:flex-row items-center justify-center w-full">
              <span class="block h-px w-1/3 md:w-1/6 bg-neutral-300"></span>
              <h2 class="text-center text-3xl tracking-widest mx-4 font-medium text-neutral-700 uppercase">
                PRESENTE EN TUS MOMENTOS ESPECIALES
              </h2>
              <span class="block h-px w-1/3 md:w-1/6 bg-neutral-300"></span>
            </div>

            <div class="flex flex-col md:flex-row w-full md:justify-center overflow-x-hidden text-neutral-700 mb-10">
              <div class="flex flex-col items-center justify-center">
                <router-link :to="{ name: 'reloj', params: { id: 'tudor' } }">
                  <img 
                    src="/assets/routes-assets/Home/tudor-1.webp" 
                    alt="tudor-black-bay-gmt"
                    loading="lazy"
                    width="384"
                    height="384"
                    class="duration-500 hover:scale-110 w-96 pb-4" 
                  />
                </router-link>
                <h3 class="text-xl font-light">1926</h3>
                <h3 class="text-xl font-light">TUDOR</h3>
              </div>

              <div class="flex flex-col items-center justify-center">
                <router-link :to="{ name: 'reloj', params: { id: 'longines' } }">
                  <img 
                    src="/assets/routes-assets/Home/tudor-2.webp" 
                    alt="longiness-hydrocontest"
                    loading="lazy"
                    width="384"
                    height="384"
                    class="duration-500 hover:scale-110 w-96 pb-4" 
                  />
                </router-link>
                <h3 class="text-xl font-light">Black Bay 58 18K</h3>
                <h3 class="text-xl font-light">TUDOR</h3>
              </div>

              <div class="flex flex-col items-center justify-center">
                <router-link :to="{ name: 'reloj', params: { id: 'victorinox' } }">
                  <img 
                    src="/assets/routes-assets/Home/tudor-3.webp" 
                    alt="victorinox-maverick-sport"
                    loading="lazy"
                    width="384"
                    height="384"
                    class="duration-500 hover:scale-110 w-96 pb-4" 
                  />
                </router-link>
                <h3 class="text-xl font-light">Pelagos FXD</h3>
                <h3 class="text-xl font-light">TUDOR</h3>
              </div>
            </div>
          </div>

          <!-- Banner SailGP resuelto con HTML5 Picture (Sin JavaScript/useWindowSize) -->
          <div class="py-10 w-full flex justify-center">
            <router-link :to="{ name: 'world-of-rolex-article-11' }" class="w-[90%]" aria-label="World of Rolex">
              <picture>
                <source 
                  media="(min-width: 768px)" 
                  srcset="/assets/routes-assets/activations/sailgp-championship-banner-desktop.webp" 
                />
                <img 
                  src="/assets/routes-assets/activations/sailgp-championship-banner-mobile.webp" 
                  alt="SailGP Championship Rolex Banner" 
                  loading="lazy" 
                  width="1200" 
                  height="400" 
                  class="w-full h-auto"
                />
              </picture>
            </router-link>
          </div>

          <!-- Banner Graduación oculto/visible con Tailwind puro (Sin JavaScript) -->
          <img 
            src="/assets/routes-assets/Home/banner-graduate.webp" 
            alt="banner-graduacion" 
            loading="lazy"
            width="1400"
            height="400"
            class="hidden md:block w-full h-auto" 
          />
        </div>
      </section>
    </main>
  </div>
</template>