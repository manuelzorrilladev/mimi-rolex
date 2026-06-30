<script setup>
import axios from "axios";
import RolexTemplate from "../Rolex/RolexTemplate.view.vue";
import rolexDataService from "../../services/rolexDataService";
import PageBanner from "../../components/banners-components/PageBanner.vue";

import { computed, onMounted, reactive, ref, watch } from "vue";
import RolexHeader from "../../components/RolexHeader.vue";
import WatchCard from "../../components/cards/WatchCard.vue";
import GLOBAL_OBJECT from "../../utils/globaj.js";
import FilterBar from "../../components/form-components/FilterBar.vue";
import YoastCard from "../../components/cards/YoastCard.vue";
import { useWindowScroll } from "@vueuse/core";
const all = ref([]);
const noResults = ref(false);
const isFailed = ref(false);
const { x, y } = useWindowScroll()
const searchParams = reactive({
  selectedCollection: "",
  selectedSize: "",
  selectedMaterial: "",
  selectedDial: "",
  selectedMinPrice: 0,
  selectedMaxPrice: 0,
});
const searchTags = computed(() => {
  return `${searchParams.selectedCollection} ,${searchParams.selectedSize} ,${searchParams.selectedMaterial} ,${searchParams.selectedDial} ,${searchParams.selectedMinPrice} ,${searchParams.selectedMaxPrice}`;
});
const isReady = ref(false);
const yoast = ref(false);
const actualPage = ref(1);
const storageRoute = `${GLOBAL_OBJECT.STORAGE_URL}rolex-relojes-new`;



function resetFilter() {
  searchParams.selectedCollection = "";
  searchParams.selectedSize = "";
  searchParams.selectedMaterial = "";
  searchParams.selectedDial = "";
  searchParams.selectedMinPrice = 0;
  searchParams.selectedMaxPrice = 0;
  getAllRolex();
  activateYoast();
}
function getAllRolex() {
  actualPage.value = 1;
  rolexDataService
    .getPaginated(actualPage.value)
    .then((d) => {
      all.value = d.data.data;
      noResults.value = false;

      isReady.value = true;
    })
    .catch((e) => {
      console.log(e);
      isFailed.value = true;
    });
}
function sendQuery() {
  actualPage.value = 1;
  all.value = [];
  noResults.value = false;
  rolexDataService
    .getPaginated(actualPage.value, searchTags.value)
    .then((d) => {
      all.value = d.data.data;
      if (all.value.length == 0) {
        noResults.value = true;
      }
      activateYoast();
    })
    .catch((e) => {
      console.log(e);
      isFailed.value = true;
    });
}
function updatePage() {
  if(all.value.length==20){
    y.value = 1000
    all.value = [];
    noResults.value = false;
    rolexDataService
      .getPaginated(actualPage.value, `${searchTags.value}&page=${actualPage.value+1}`)
      .then((d) => {
        all.value = d.data.data;
       actualPage.value++
        activateYoast();
      })
      .catch((e) => {
        console.log(e);
        isFailed.value = true;
      });

  }
}
function activateYoast() {
  // yoast.value = true;
    // setTimeout(() => {
    //   yoast.value = false;
    // }, 4000);
}
onMounted(() => {
  getAllRolex();
});

watch(searchParams, () => {
  sendQuery();
});
</script>
<template>
  <RolexTemplate>
    <Head>
      <title>Relojes Rolex {{ currentData.name }} | Mimi Joyería</title>
      <meta
        name="description"
        :content="`Descubra los relojes Rolex ${currentData.name} en línea en Mimi Joyería, Distribuidor Oficial autorizado para vender relojes Rolex para hombre y mujer. Descubra más en Mimi Joyería.`"
      />
    </Head>
    <template #content>
      <PageBanner type="watches" />
      <RolexHeader color="bg-rolex-brown-light-2">
        <template #title> Relojes Rolex en Mimi Joyería en Venezuela </template>
        <template #text>
          <strong
            >Esta selección de modelos Rolex proviene del catálogo oficial y no
            representa las existencias disponibles en la joyería.</strong
          >
          Si quiere realizar una consulta sobre algún reloj en particular, no
          dude en ponerse en contacto con nosotros.
        </template>
      </RolexHeader>
      

      <YoastCard v-if="yoast" class="w-full">
        Busqueda reiniciada con exito!
      </YoastCard>

      <div class="flex flex-col md:flex-row justify-center bg-rolex-brown-light-2 gap-18 px-2">
        <FilterBar v-model="searchParams" @reset="resetFilter" />
        <div
          class="grid grid-cols-2 md:grid-cols-3 w-full md:w-3/5 gap-2"
          v-if="all.length > 0 && isReady"
        >
          <WatchCard
            v-for="(item, key) in all"
            :key="key"
            :item="item"
            :collection="item['Rolex-collection'].idName"
          />
        </div>
        <div
          class="w-3/5 h-screen flex flex-col items-center justify-center font-helvetica font-bold text-rolex-brown"
          v-else
        >
          <h2 v-if="noResults">
            No hay productos que coincidan con tu busqueda
          </h2>
          <h2 v-else>Cargando resultados</h2>
          <h2 v-if="isFailed">
            Hubo un error al buscar resultados, intente de nuevo
          </h2>
          <button
            @click="resetFilter"
            class="bg-rolex-green text-white border w-fit border-rolex-green px-4 py-2 font-helvetica font-bold rounded-3xl hover:bg-white hover:text-rolex-green duration-200 flex items-center gap-3 group"
          >
            <p>Reiniciar</p>
            <font-awesome-icon
              :icon="['fas', 'arrow-rotate-left']"
              class="group-hover:-rotate-360 duration-500 ease-in-out"
            />
          </button>
        </div>
      </div>
      <div class="bg-rolex-brown-light-2 py-6 flex justify-center md:justify-end">
        <div class="w-2/3 flex justify-center">
          <button
            v-if="all.length == 20"
            @click="updatePage"
            class="bg-rolex-green text-white border w-fit border-rolex-green px-4 py-2 font-helvetica font-bold rounded-3xl hover:bg-white hover:text-rolex-green duration-200 flex items-center gap-3 group"
          >
            <p>Pagína siguiente</p>
            <font-awesome-icon
              :icon="['fas', 'chevron-right']"
              class="group-hover:translate-x-1 duration-500 ease-out"
            />
          </button>
        </div>
      </div>
    </template>
  </RolexTemplate>
</template>

<style scoped>
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
