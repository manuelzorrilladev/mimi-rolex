<script setup>
import { useRoute } from "vue-router";
import RolexFooter from "../../components/navigation-components/RolexFooter.vue";
import RolexNavbar from "../../components/navigation-components/RolexNavbar.vue";
import SliderNavigationRolex from "../../components/navigation-components/SliderNavigationRolex.vue";
import BreadCrumb from "../../components/navigation-components/BreadCrumb.vue";
import { useLoaderStore } from "../../store/loaderState";
import { computed, onMounted, ref, watch } from "vue";
import { useHead } from '@unhead/vue'

const route = useRoute();
const loader = useLoaderStore();
const breadcrumbValidator = ref(false);

/**
 * 1. Computamos los datos dinámicos según la ruta actual
 */

 
const digitalDataLayer = computed(() => {
  const data = {
    environment: {
      environmentVersion: "V7",
      coBrandedVersion: "Bespoke",
    },
    page: {
      pageType: route.meta.pageType || "default",
    },
  };

  if (route.meta.pageFamily) {
    data.page.pageFamilyName = route.meta.pageFamily;
  }
  
  return data;
});

/**
 * 2. Función para disparar el rastreo
 * Se encarga de actualizar el objeto global y avisar a Adobe (_satellite)
 */
const triggerRolexTracking = () => {
  if (!route.fullPath.includes("rolex")) {
    return;
  }

  window.digitalDataLayer = digitalDataLayer.value;

  if (window._satellite && typeof window._satellite.track === 'function') {
    setTimeout(() => {
      window._satellite.track('pageView');
      console.log('Rolex Tracked:', route.path);
    }, 100);
  }
};

watch(
  () => route.fullPath,
  () => {
    useHead({
      script: [
        {
          id: 'rolex-datalayer-sync',
          innerHTML: `window.digitalDataLayer = ${JSON.stringify(digitalDataLayer.value)};`,
        }
      ]
    });

    triggerRolexTracking();
  },
  { immediate: true }
);

onMounted(() => {
  breadcrumbValidator.value = true;
});
</script>

<template>
  <div id="rolex-main-content" class="relative">
   
    <div>
      <RolexNavbar />
      <BreadCrumb v-if="route.name != 'busqueda' && breadcrumbValidator" />
      <main>
        <slot name="content"></slot>

      </main>

      <SliderNavigationRolex />
      <RolexFooter />
    </div>
  </div>
</template>



