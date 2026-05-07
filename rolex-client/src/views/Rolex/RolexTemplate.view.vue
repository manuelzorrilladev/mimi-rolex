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

 


onMounted(() => {
  breadcrumbValidator.value = true;
});
</script>

<template>
  <div id="rolex-main-content" class="relative">
   
    <div>
      <RolexNavbar />
      <BreadCrumb v-if="route.name != 'busqueda' && breadcrumbValidator && route.name != 'busqueda'" />
      <main>
        <slot name="content"></slot>

      </main>

      <SliderNavigationRolex />
      <RolexFooter />
    </div>
  </div>
</template>



