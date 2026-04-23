<script setup>
import { useCookies } from "@vueuse/integrations/useCookies";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import GLOBAL_OBJECT from "../../utils/globaj";
import router from "../../router";

const route = useRoute();
const cookies = useCookies(['rlx-consent', 'rlx-marketing']);
const checkOpen = ref(false);
const cookieLog = ref(false);

const SCRIPT_ID = "rolex-tracking-script";

const manageExternalScript = (shouldInject) => {
  const existingScript = document.getElementById(SCRIPT_ID);
  if (shouldInject) {
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = GLOBAL_OBJECT.TRACK_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  } else if (existingScript) {
    existingScript.remove();
  }
};

/**
 * Lógica de Consentimiento: Ahora depende de ambas cookies
 */
const hasConsent = computed(() => cookies.get("rlx-consent") === true && cookies.get("rlx-marketing") === true);

const isRolexRoute = computed(() => {
  return route.fullPath.includes("rolex") && route.name !== 'rolex-nuevos-modelos';
});

const cookieOptions = { path: '/', maxAge: 60 * 60 * 24 * 360 };

if (cookies.get("rlx-consent") === undefined || cookies.get("rlx-marketing") === undefined) {
  if (cookies.get("rlx-consent") === undefined) cookies.set("rlx-consent", false, cookieOptions);
  if (cookies.get("rlx-marketing") === undefined) cookies.set("rlx-marketing", false, cookieOptions);
  checkOpen.value = true;
} else if (cookies.get("rlx-consent") === false || cookies.get("rlx-marketing") === false) {
  checkOpen.value = true;
}

watch(
  [hasConsent, isRolexRoute],
  ([consent, onRoute]) => {
    manageExternalScript(consent && onRoute);
  },
  { immediate: true }
);

const isOpenUp = computed(() => (checkOpen.value ? "bottom-0" : "-bottom-3/4"));

function togglePanel() {
  checkOpen.value = !checkOpen.value;
}

/**
 * Actualiza ambas cookies simultáneamente
 */
function changeCookie(value) {
  cookies.set("rlx-consent", value, cookieOptions);
  cookies.set("rlx-marketing", value, cookieOptions);
  if (value === true) {
    checkOpen.value = false;
  }
}
</script>


<template>
  <div :class="isOpenUp" class="fixed z-30 h-fit duration-500" v-if="router.path != '/dashboard'">
    <div
      :class="checkOpen ? 'bottom-[70%] md:bottom-1/2' : 'bottom-0'"
      class="h-[10vh] duration-500 flex justify-end fixed z-20 left-[98%] right-4 mr-16 border"
    >
      <div
        class="group border-l border-r border-t rounded-t-md shadow-md shadow-rolex-green border-rolex-green cursor-pointer p-4 fixed flex pt-5 gap-2 bg-white hover:text-rolex-green duration-100 h-40"
        @click="togglePanel">
        <font-awesome-icon :icon="['fas', 'gear']" class="group-hover:animate-spin" />
        <h2>Cookies</h2>
      </div>
    </div>
    <div class="h-[70vh] lg:h-[50vh] relative w-full border z-40">
      <div id="content"
        class="border-2 bg-white border-rolex-green h-full w-full relative flex flex-col md:flex-row items-center">
        <div
          class="md:w-2/3 overflow-y-scroll md:overflow-y-hidden h-4/5 md:h-full flex flex-col justify-start md:justify-center items-center">
          <div class="flex items-center gap-10 pb-10">
            <img src="/assets/mimi-logo-gray.svg" alt="Logo mimi joyeria" class="w-32" />
            <img src="/assets/svg-badge-rolex.svg" alt="Logo rolex" class="w-32" />
          </div>
          <div class="flex flex-col items-center overflow-scroll">
            <h2 class="w-10/12 text-justify text-xs md:text-sm">
              Para brindar las mejores experiencias, utilizamos tecnologías como
              cookies para almacenar y/o acceder a información del dispositivo.
              Dar su consentimiento a estas tecnologías nos permitirá procesar
              datos como el comportamiento de navegación o identificaciones
              únicas en este sitio. No dar o retirar el consentimiento puede
              afectar negativamente a determinadas características y funciones.
            </h2>
            <button @click="cookieLog = !cookieLog"
              class="w-10/12 text-justify text-xs md:text-sm font-black hover:underline">
              > Cookies Analiticas.
            </button>
            <Transition>
              <div class="grid grid-cols-3 content-center w-10/12" v-if="cookieLog">
                <h2 class="pl-2 text-sm font-bold border border-rolex-green">Nombre</h2>
                <h2 class="pl-2 text-sm font-bold border border-rolex-green">Duración</h2>
                <h2 class="pl-2 text-sm font-bold border border-rolex-green">Descripción</h2>
                <h2 class="pl-2 text-sm border border-rolex-green">'rlx-consent'</h2>
                <h2 class="pl-2 text-sm border border-rolex-green">360 Días</h2>
                <h2 class="pl-2 text-sm border border-rolex-green">
                  Cookie analítica de Rolex
                </h2>
                <h2 class="pl-2 text-sm border border-rolex-green">'rlx-marketing'</h2>
                <h2 class="pl-2 text-sm border border-rolex-green">360 Días</h2>
                <h2 class="pl-2 text-sm border border-rolex-green">
                  Cookie analítica de Rolex
                </h2>
              </div>
            </Transition>

            <h2 class="w-10/12 text-justify font-semibold text-xs md:text-sm">
              *Puedes cambiar de decisión en cualquier en momento
            </h2>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center w-1/3 gap-2 h-3/5 md:h-full">
          <button @click="changeCookie(true)"
            class="border-2 border-rolex-green font-semibold px-6 py-2 hover:bg-rolex-green hover:text-white duration-200 w-44 sm:w-60 md:w-80 text-xs md:text-lg">
            Permitir todas
          </button>
          <button @click="changeCookie(true)"
            class="border-2 border-rolex-green font-semibold px-6 py-2 hover:bg-rolex-green hover:text-white duration-200 w-44 sm:w-60 md:w-80 text-xs md:text-lg">
            Permitir solo analíticas
          </button>

          <button @click="changeCookie(false)"
            class="border-2 border-rolex-green font-semibold px-6 py-2 hover:bg-rolex-green hover:text-white duration-200 w-44 sm:w-60 md:w-80 text-xs md:text-lg">
            Rechazar todas
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>