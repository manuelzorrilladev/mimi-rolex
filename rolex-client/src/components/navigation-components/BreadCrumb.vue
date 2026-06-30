<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import breadcrumbData from "../../data/breadcrumb.json";

const route = useRoute();
const router = useRouter();

// Configuración de rutas padre
const parentRoutes = {
  "Mantenimiento Rolex": "mantenimiento-rolex",
  "Contacto": "rolex-contacto",
  "Nuevos Modelos": "rolex-nuevos-modelos",
  "World Of Rolex": "world-of-rolex-hub",
  "Colección Rolex": "coleccion-rolex",
  "Accesorios Rolex": "rolex-accesorios"
};

const capitalize = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

const breadcrumbs = computed(() => {
  let list = [...(breadcrumbData[route.name] || [])];

  // 2. Lógica específica según la ruta
  const pathSegments = route.fullPath.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  if (route.name === "relojes-rolex" || route.name === "rolex-accesorios-display") {
    const parts = lastSegment.split("-");
    const collection = parts.slice(-2).join("-").toUpperCase();
    const model = capitalize(parts.slice(0, -2).join(" "));
    list.push(model, collection);
  } 
  else if (route.name === "rolex-coleccion") {
    list.push(capitalize(lastSegment));
  } 
  else if (route.name === "rolex-nuevos-modelos-2026") {
    const specificBreadcrumb = breadcrumbData[`${route.name}-${route.params.id}`];
    if (specificBreadcrumb) list = [...specificBreadcrumb];
    list.push(capitalize(lastSegment));
  }

  // 3. Limpieza final: Eliminar vacíos y DUPLICADOS
  // Usamos un Set para asegurar que cada texto sea único
  return [...new Set(list.filter(str => str && str.trim() !== ""))];
});

// Navegación manual mejorada
function handleNavigation(index) {
  const list = breadcrumbs.value;
  const isLast = index === list.length - 1;
  const isFirst = index === 0;

  if (isLast) {
    router.go(0); 
    return;
  }

  if (isFirst && parentRoutes[list[0]]) {
    router.push({ name: parentRoutes[list[0]] });
    return;
  }

  if (list.length === 3 && index === 1) {
    router.go(-1);
  }
}
</script>

<template>
  
  <div class="h-12 items-center md:px-36 font-helvetica bg-rolex-gradient flex">
    <div class="hidden md:flex gap-4 pr-4">
      <router-link :to="{ name: 'rolex' }" class="text-white hover:underline">Descubre Rolex
      </router-link>
    </div>


    <div v-for="(item, index) in breadcrumbs" :key="index">
      <div class="hidden md:flex gap-4 pr-4">
        <font-awesome-icon :icon="['fas', 'chevron-right']" class="py-1 text-white" />

        <div @click="handleNavigation(index)" class="text-white hover:underline cursor-pointer">
          {{ item }}
        </div>
      </div>


    </div>

    <div v-for="(item, index) in routesToShow" :key="index" class="flex md:hidden  pr-4 pl-6">
      <font-awesome-icon v-if="!routesToShow || routesToShow.length == 1" :icon="['fas', 'chevron-left']"
        class="py-1 pr-2 text-white" />

      <router-link v-if="!routesToShow || routesToShow.length == 1" :to="{ name: 'rolex' }"
        class="text-white hover:underline">Descubre Rolex
      </router-link>

      <div class="flex gap-4" v-else>
        <font-awesome-icon v-if="index == routesToShow.length - 1" :icon="['fas', 'chevron-left']" class="py-1 text-white" />
        <div v-if="index == routesToShow.length - 1" @click="generateLink(index - 1)"
          class="text-white hover:underline cursor-pointer">
          {{ routesToShow[index - 1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
