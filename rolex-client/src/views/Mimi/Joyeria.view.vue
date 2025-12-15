<script setup>
import { useWindowSize } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import jewels from "../../data/jewels.json";

const INITIAL_ITEMS_TO_SHOW = 4;
const pieces = computed(() => jewels.pieces.slice(0, 15));

const rings = computed(() =>
  jewels.pieces.filter((item) => item.coleccion.includes("graduacion"))
);
const { width } = useWindowSize();

const allCollection = ref(7);
const itemCounter = ref(0);
const itemCounter2 = ref(0);
const itemsToShow = ref(4);
const sectionCheck = ref(0);

const maxCapacity = computed(() => {
  if (Math.floor(width.value / 298) > INITIAL_ITEMS_TO_SHOW) {
    return INITIAL_ITEMS_TO_SHOW;
  }
  return Math.floor(width.value / 298);
});

const visibleArea = computed(() => {
  return itemsToShow.value * 298;
});

const sliderStyle = computed(() => {
  return `transform:translateX(-${itemCounter.value * 298}px)`;
});
const sliderStyle2 = computed(() => {
  return `transform:translateX(-${itemCounter2.value * 298}px)`;
});
const fullSize = computed(() => {
  return `width: ${visibleArea.value}px !important`;
});

function checkIfFits() {
  if (maxCapacity.value <= INITIAL_ITEMS_TO_SHOW) {
    itemsToShow.value = maxCapacity.value;
  }
}

function move(dir, instance) {
  if (instance) {
    if (dir == "r") {
      itemCounter2.value = itemCounter2.value + 1;
      return;
    }
    itemCounter2.value = itemCounter2.value - 1;
  } else {
    if (dir == "r") {
      itemCounter.value = itemCounter.value + 1;
      return;
    }
    itemCounter.value = itemCounter.value - 1;
  }
}

function changeCheck() {
  if (sectionCheck.value == 3) {
    sectionCheck.value = 0;
    return;
  }
  sectionCheck.value = sectionCheck.value + 1;
}
function toggleSection(pos) {
  if (pos == sectionCheck.value) {
    return true;
  }
  return false;
}

watch(width, () => {
  checkIfFits();
});

onMounted(() => {
  checkIfFits();
  setInterval(changeCheck, 5000);
});
</script>

<template>
  <div id="joyeria">
    <section class="relative">
      <div class="w-full">
        <img
          src="/assets/routes-assets/joyeria/banner-2.webp"
          alt=""
          class="w-full hidden md:block"
        />
        <img
          src="/assets/routes-assets/joyeria/banner-2-mobile.webp"
          alt=""
          class="w-full md:hidden"
        />
      </div>
      <header class="absolute top-8 text-white text-shadow-2xs w-full">
        <h2
          class="font-mimi-head text-center text-2xl md:text-4xl text-shadow-lg text-shadow-neutral-600"
        >
          Forjando recuerdos, para toda la vida
        </h2>
      </header>
    </section>
    <section class="w-full flex justify-center relative h-[300px] bg-gray-100">
      <div
        class="flex justify-start gap-[18px] h-[350px] px-2 pt-20 bg-transparent -translate-y-20 overflow-hidden"
        :style="fullSize"
      >
        <div
          v-for="value in allCollection"
          :style="sliderStyle"
          class="bg-white rounded-lg shadow-lg px-8 py-3 min-w-[280px] w-[280px] h-[280px] -translate-y-10 hover:-translate-y-20 duration-300"
        >
          <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
          <h2 class="font-bold text-xl text-neutral-700">Nacimiento</h2>
          <div class="w-full flex justify-center py-3">
            <img
              :src="`/assets/routes-assets/joyeria/img-${value}.webp`"
              alt=""
              class="w-2/3"
            />
          </div>
          <button
            class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat"
          >
            Ver colección
          </button>
        </div>
      </div>
      <button
        v-if="itemCounter <= allCollection - itemsToShow - 1"
        class="absolute top-2/5 right-4 md:right-20 w-14 h-14 -translate-y-8 text-rolex-brown text-xl bg-white rounded-full p-3 shadow-lg hover:shadow-xl duration-300 cursor-pointer border border-white hover:bg-rolex-brown hover:text-white flex justify-center items-center"
        @click="move('r')"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </button>
      <button
        v-if="itemCounter > 0"
        class="absolute top-2/5 left-4 md:left-20 w-14 h-14 -translate-y-8 text-rolex-brown text-xl bg-white rounded-full p-3 shadow-lg hover:shadow-xl duration-300 cursor-pointer border border-white hover:bg-rolex-brown hover:text-white flex justify-center items-center"
        @click="move('l')"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
      </button>
    </section>
    <section
      class="bg-gray-100 flex flex-col md:flex-row items-center justify-around pb-14 gap-4 md:gap-0"
    >
      <div class="flex justify-center w-full md:w-1/2">
        <header class="w-10/12 md:w-2/3">
          <h2 class="font-mimi-head md:w-2/3 text-4xl text-shadow-lg">
            Primer Brillo: Joyas para Celebrar la Bienvenida
          </h2>
          <p class="font-montserrat md:w-2/3">
            El nacimiento de un bebé y su bautizo son hitos puros e
            inolvidables. En MIMI JOYERÍA, encontrarás piezas delicadas y
            seguras, ideales para conmemorar este nuevo comienzo.
          </p>
        </header>
      </div>
      <div class="w-10/12 md:w-1/2 flex justify-center relative">
        <div class="bg-white rounded-lg shadow-lg px-8 py-3 md:w-1/2">
          <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
          <h2 class="font-bold text-xl text-neutral-700">Nacimiento</h2>
          <div class="w-full overflow-hidden">
            <img
              src="https://mimijoyeria.com/storage/store-products/zarcillo-8294-2.webp"
              alt=""
              class="scale-200"
            />
          </div>

          <h4 class="text-sm font-light text-neutral-700">Oro 18K</h4>

          <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
        </div>
        <Transition name="fade">
          <div
            v-if="toggleSection(1)"
            class="bg-white rounded-lg shadow-lg px-8 py-3 md:w-1/2 absolute z-10"
          >
            <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
            <h2 class="font-bold text-xl text-neutral-700">Nacimiento</h2>
            <div class="w-full overflow-hidden">
              <img
                src="https://mimijoyeria.com/storage/store-products/zarcillo-8296-2.webp"
                alt=""
                class="scale-200"
              />
            </div>

            <h4 class="text-sm font-light text-neutral-700">Oro 18K</h4>

            <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
          </div>
        </Transition>
        <Transition name="fade">
          <div
            v-if="toggleSection(2)"
            class="bg-white rounded-lg shadow-lg px-8 py-3 md:w-1/2 absolute z-10"
          >
            <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
            <h2 class="font-bold text-xl text-neutral-700">Nacimiento</h2>
            <div class="w-full overflow-hidden">
              <img
                src="https://mimijoyeria.com/storage/store-products/zarcillo-8301-2.webp"
                alt=""
                class="scale-200"
              />
            </div>

            <h4 class="text-sm font-light text-neutral-700">Oro 18K</h4>

            <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
          </div>
        </Transition>
        <Transition name="fade">
          <div
            v-if="toggleSection(3)"
            class="bg-white rounded-lg shadow-lg px-8 py-3 md:w-1/2 absolute z-10"
          >
            <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
            <h2 class="font-bold text-xl text-neutral-700">Nacimiento</h2>
            <div class="w-full overflow-hidden">
              <img
                src="https://mimijoyeria.com/storage/store-products/zarcillo-8427-2.webp"
                alt=""
                class="scale-200"
              />
            </div>

            <h4 class="text-sm font-light text-neutral-700">Oro 18K</h4>

            <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
          </div>
        </Transition>
      </div>
    </section>
    <section
      class="bg-[url(/assets/routes-assets/joyeria/silk.webp)] bg-cover bg-center bg-fixed w-full pb-10"
    >
      <header class="text-center py-6 flex flex-col items-center">
        <h2 class="font-mimi-head text-4xl">Una joya, para cada momento</h2>
        <p class="font-montserrat w-10/12">
          Te acompañamos en cada etapa significativa. Explora nuestros diseños
          especializados para matrimonios, nacimientos, graduaciones y
          aniversarios. En cada pieza hay una historia que tú estás por
          comenzar.
        </p>
      </header>
      <div class="w-full flex justify-center">
        <div
          class="w-10/12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
        >
          <div
            v-for="value in pieces"
            class="bg-white rounded-lg shadow-lg px-8 py-3"
          >
            <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
            <h2 class="font-bold text-xl text-neutral-700">
              {{ value.nombre }}
            </h2>
            <div class="w-full overflow-hidden">
              <img
                :src="`https://mimijoyeria.com/storage/store-products/${value.serie}-2.webp`"
                alt=""
                class="scale-150"
              />
            </div>

            <h4 class="text-sm font-light text-neutral-700">
              {{ value.titulo }}
            </h4>

            <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
          </div>
        </div>
      </div>
    </section>

    <section
      class="bg-gray-100 flex flex-col md:flex-row items-center justify-center py-14 gap-4 md:gap-0"
    >
      <div class="flex justify-center md:justify-start w-full md:w-5/12">
        <header class="w-10/12">
          <h2 class="font-mimi-head text-4xl text-shadow-lg">
            Precisión Absoluta: El Secreto Detrás de Nuestro Brillo
          </h2>
          <p class="font-montserrat text-justify md:w-10/12">
            La calidad en MIMI JOYERÍA no es un accidente. Implementamos un
            proceso de fabricación riguroso, donde cada engaste, cada curva y
            cada soldadura es inspeccionada. Esto garantiza una pieza impecable,
            diseñada para resistir el tiempo y brillar con perfección
            inalterable.
          </p>
        </header>
      </div>
      <div class="w-10/12 md:w-5/12 flex justify-center relative">
        <div class="flex flex-col md:flex-row w-full gap-6">
          <img
            src="/assets/routes-assets/joyeria/joyeria-new-1.webp"
            alt="portrait"
            class="rounded shadow-lg shadow-gray-400 md:w-1/3"
          />
          <img
            src="/assets/routes-assets/joyeria/joyeria-new-2.webp"
            alt="portrait"
            class="rounded shadow-lg shadow-gray-400 md:w-1/3"
          />
          <img
            src="/assets/routes-assets/joyeria/joyeria-new-3.webp"
            alt="portrait"
            class="rounded shadow-lg shadow-gray-400 md:w-1/3"
          />
        </div>
      </div>
    </section>

    <section
      class="bg-[url(/assets/routes-assets/joyeria/joyeria-new-4.webp)] bg-cover bg-center bg-fixed w-full pb-10 min-h-[70vh]"
    >
      <header
        class="text-white text-shadow-2xs w-full pt-10 flex flex-col items-center"
      >
        <h2
          class="font-mimi-head text-center w-10/12 md:w-full text-2xl md:text-5xl text-shadow-lg text-shadow-neutral-600"
        >
          Sello de Excelencia: La Joya de la Más Alta Calidad
        </h2>
        <p class="font-montserrat w-10/12 md:w-1/2 text-justify md:text-center">
          Elige una pieza que hable de tu nivel de compromiso. Nuestros anillos
          de graduación son forjados con precisión artesanal y el estricto
          control de calidad que distingue a MIMI JOYERÍA. Este anillo es el
          símbolo duradero de tu nueva identidad profesional.
        </p>
      </header>

      <section class="w-full flex justify-center relative h-[400px]">
        <div
          class="flex justify-start gap-[18px] h-[450px] px-2 pt-20 bg-transparent overflow-hidden"
          :style="fullSize"
        >
          <div
            v-for="value in rings"
            :style="sliderStyle2"
            class="bg-white rounded-lg shadow-lg px-8 py-3 min-w-[280px] w-[280px] h-[280px] hover:-translate-y-10 duration-300"
          >
            <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
            <h2 class="font-bold text-xl text-neutral-700">Graduación</h2>
            <div class="w-full flex justify-center py-3">
              <img
                :src="`/assets/routes-assets/joyeria/${value.serie}.webp`"
                alt=""
                class="w-2/3"
              />
            </div>
            <button
              class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat"
            >
              Ver colección
            </button>
          </div>
        </div>
        <button
          v-if="itemCounter2 <= rings.length - itemsToShow - 1"
          class="absolute top-1/2 right-4 md:right-20 w-14 h-14 -translate-y-8 text-rolex-brown text-xl bg-white rounded-full p-3 shadow-lg hover:shadow-xl duration-300 cursor-pointer border border-white hover:bg-rolex-brown hover:text-white flex justify-center items-center"
          @click="move('r', 'alt')"
        >
          <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </button>
        <button
          v-if="itemCounter2 > 0"
          class="absolute top-1/2 left-4 md:left-20 w-14 h-14 -translate-y-8 text-rolex-brown text-xl bg-white rounded-full p-3 shadow-lg hover:shadow-xl duration-300 cursor-pointer border border-white hover:bg-rolex-brown hover:text-white flex justify-center items-center"
          @click="move('l', 'alt')"
        >
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
        </button>
      </section>
    </section>

    <section
      class="bg-gray-100 flex flex-col-reverse md:flex-row items-center justify-center py-14 gap-4 md:gap-0"
    >
      <div class="flex justify-center md:justify-start w-full md:w-5/12">
        <header class="w-10/12 space-y-2">
          <h2 class="font-mimi-head text-4xl text-shadow-lg">
            ¿Buscas Algo Específico? Escríbenos Directamente
          </h2>
          <p class="font-montserrat text-justify md:w-10/12">
            Usa el formulario de contacto o escríbenos por WhatsApp. Para
            cotizaciones de anillos de compromiso, grabados especiales o pedidos
            urgentes, nuestro equipo responde en menos de 24 horas. Tu próxima
            joya está a solo un mensaje de distancia.
          </p>
          <a href="https://wa.me/584143092501" target="_blank" class="flex items-center gap-2 md:w-10/12 bg-rolex-green text-white border border-rolex-green duration-200 hover:bg-white hover:text-rolex-green  rounded px-4 py-2">
            <font-awesome-icon :icon="['fab', 'whatsapp']" />
            <p>Escribir a Whatsapp</p>
          </a>
          <router-link to="/contactenos" class="flex items-center gap-2 md:w-10/12 bg-rolex-green text-white border border-rolex-green duration-200 hover:bg-white hover:text-rolex-green  rounded px-4 py-2">
            <font-awesome-icon :icon="['fas', 'envelope']" />
            <p>Contactar</p>
          </router-link>
        </header>
        <div></div>
      </div>
      <div class="w-10/12 md:w-5/12 flex justify-center relative">
        <div class="flex flex-col md:flex-row w-full gap-6">
          <img
            src="/assets/routes-assets/joyeria/joyeria-new-5.webp"
            alt="portrait"
            class="rounded shadow-lg shadow-gray-400 md:w-1/2 md:-translate-y-8"
          />
          <img
            src="/assets/routes-assets/joyeria/joyeria-new-6.webp"
            alt="portrait"
            class="rounded shadow-lg shadow-gray-400 md:w-1/2 md:translate-y-8"
          />
         
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
