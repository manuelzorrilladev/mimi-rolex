<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import Cookies from "./components/cards/Cookies.vue";
import PageLoader from "./components/global-components/PageLoader.vue";
import Footer from "./components/navigation-components/Footer.vue";
import Navbar from "./components/navigation-components/Navbar.vue";
import ShoppingPop from "./components/payout-components/ShoppingPop.vue";
import { auth } from "./store/auth.module";
import { useLoaderStore } from "./store/loaderState";
import { useLocationStore } from "./store/locationState";
import { useHead } from "@unhead/vue";


const route = useRoute();
const piniaStore = auth();
const loader = useLoaderStore();
const isUserLogged = storeToRefs(piniaStore);

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

useHead({
  script: [
    {
      id: 'rolex-datalayer-sync',
      innerHTML: computed(() => `window.digitalDataLayer = ${JSON.stringify(digitalDataLayer.value)};`),
    }
  ]
});


const triggerRolexTracking = () => {
  if (!route.fullPath.includes("rolex")) {
    // console.log('no track');
    return;
  }

  window.digitalDataLayer = digitalDataLayer.value;
  // console.log(window._satellite);

  if (window._satellite && typeof window._satellite.track === 'function') {
    setTimeout(() => {
      window._satellite.track('pageView');
      // console.log('Rolex Tracked:', route.path);
    }, 100);
  }
};

watch(
  () => route.fullPath,
  () => {
    triggerRolexTracking();
  },
  { immediate: true }
);


</script>

<template>
  <div id="app-main">
    <PageLoader v-if="loader.$state.loader" />
    <Navbar />

    <Cookies />
    <ShoppingPop
      v-if="route.path !== '/carrito' && isUserLogged.status.value.loggedIn"
    />
    <div class="correction">
      <RouterView :key="route.fullPath" />
    </div>

    <Footer v-once />
  </div>
</template>

<style scoped>
.correction {
  min-height: 100vh;
}
</style>
