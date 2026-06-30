<script setup>
import { useCookies } from "@vueuse/integrations/useCookies";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import GLOBAL_OBJECT from "../../utils/globaj";
import router from "../../router";

const route = useRoute();
const cookies = useCookies(["rlx-consent", "rlx-marketing"]);
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

const cookieExists = computed(() => {
  return (
    cookies.get("rlx-consent") !== undefined ||
    cookies.get("rlx-marketing") !== undefined
  );
});
const hasConsent = computed(
  () =>
    cookies.get("rlx-consent") === true &&
    cookies.get("rlx-marketing") === true,
);

const isRolexRoute = computed(() => {
  return (
    route.fullPath.includes("rolex") && route.name !== "rolex-nuevos-modelos"
  );
});

const cookieOptions = { path: "/", maxAge: 60 * 60 * 24 * 360 };

if (
  cookies.get("rlx-consent") === undefined ||
  cookies.get("rlx-marketing") === undefined
) {
  if (cookies.get("rlx-consent") === undefined)
    cookies.set("rlx-consent", false, cookieOptions);
  if (cookies.get("rlx-marketing") === undefined)
    cookies.set("rlx-marketing", false, cookieOptions);
  checkOpen.value = true;
} else if (
  cookies.get("rlx-consent") === false ||
  cookies.get("rlx-marketing") === false
) {
  checkOpen.value = true;
}

watch(
  [hasConsent, isRolexRoute],
  ([consent, onRoute]) => {
    manageExternalScript(consent && onRoute);
  },
  { immediate: true },
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
  checkOpen.value = false;

}
</script>

<template>
  <div v-if="router.path != '/dashboard'">
    <Transition name="slide-up">
      <div
        v-if="!cookieExists"
        class="fixed bottom-8 right-8 z-50 bg-white w-[350px] rounded-xl shadow-2xl border border-gray-100 p-6 flex flex-col antialiased"
      >
        <div class="flex items-center justify-between mb-4 px-2">
          <img
            src="/assets/mimi-logo-gray.svg"
            alt="Logo Mimi"
            class="h-8 object-contain"
          />
          <div class="h-8 w-[1px] bg-gray-200"></div>
          <img
            src="/assets/svg-badge-rolex.svg"
            alt="Logo Rolex"
            class="h-10 object-contain"
          />
        </div>

        <p class="text-sm leading-relaxed text-gray-600 mb-6 text-justify">
          Para brindar las mejores experiencias, utilizamos tecnologías como
          cookies para mejorar su navegación. El consentimiento nos permite
          procesar datos de comportamiento de manera segura y exclusiva.
        </p>

        <div class="flex flex-col w-full gap-2">
          <button
            @click="changeCookie(true)"
            class="w-full bg-rolex-green py-1 text-white rounded border border-rolex-green duration-200 hover:bg-white hover:text-rolex-green cursor-pointer"
          >
            Aceptar todo
          </button>
          <button
            @click="togglePanel"
            class="w-full py-1 rounded border border-rolex-green duration-200 bg-white text-rolex-green cursor-pointer hover:border-gray-400"
          >
            Preferencias
          </button>
          <button
            @click="changeCookie(false)"
            class="w-full py-1 rounded border border-rolex-green duration-200 bg-white text-rolex-green cursor-pointer hover:border-gray-400"
          >
            Rechazar todo
          </button>
        </div>
      </div>
    </Transition>
    <Transition name="slide-up">
      <div
        class="group border rounded-full shadow-md shadow-rolex-green border-rolex-green cursor-pointer p-4 fixed bottom-4 right-4 flex items-center gap-2 bg-white hover:text-rolex-green duration-100  z-50"
        @click="togglePanel" v-if="!checkOpen && cookieExists">
        <font-awesome-icon :icon="['fas', 'gear']" class="group-hover:animate-spin" />
        <h2>Cookies</h2>
      </div>
    
    </Transition>

    

    <!-- Overlay -->
    <Transition name="fade">
      <div
        v-if="checkOpen"
        @click="togglePanel"
        class="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
      ></div>
    </Transition>

    <Transition name="slide-right">
      <div
        v-if="checkOpen"
        class="h-screen fixed top-0 right-0 z-60 w-11/12 md:w-1/3 bg-white border-l border-rolex-green px-6"
      >
        <header class="flex justify-between items-center">
          <h2 class="py-6">Preferencias de Cookies</h2>
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="text-xl cursor-pointer"
            @click="togglePanel"
          />
        </header>
        <hr />
        <p class="text-sm pt-6">
          Utilizamos cookies para mejorar su experiencia de navegación. Aqui
          encontraras toda la información relacionada a los parametros que
          utilizamos
        </p>
        <div class="mt-3 space-y-4 overflow-y-scroll h-[55%]">
          <header class="bg-white border rounded-xl p-3 shadow-lg">
            <h2>Analíticas y estadísticas</h2>
            <p
              class="text-xs bg-rolex-green text-white px-3 py-1 rounded-xl my-2 w-fit"
            >
              Rolex
            </p>
            <p class="text-sm font-light">
              Cookies de análisis de Rolex que nos ayudan a entender cómo
              interactúa con nuestros productos y servicios para mejorar su
              experiencia de compra.
            </p>
          </header>
          <header class="bg-white border rounded-xl p-3 shadow-lg">
            <h2>Marketing</h2>
            <p
              class="text-xs bg-rolex-green text-white px-3 py-1 rounded-xl my-2 w-fit"
            >
              Rolex
            </p>
            <p class="text-sm font-light">
              Cookies de marketing de Rolex que se utilizan para mostrarle
              anuncios relevantes y medir la efectividad de nuestras campañas
              publicitarias en redes sociales y otros sitios web.
            </p>
          </header>
        </div>
        <div class="flex flex-col w-full gap-2">
          <button
            @click="changeCookie(true)"
            class="w-full bg-rolex-green py-2 text-white rounded border border-rolex-green duration-200 hover:bg-white hover:text-rolex-green cursor-pointer"
          >
            Aceptar todo
          </button>

          <button
            @click="changeCookie(false)"
            class="w-full py-2 rounded border border-rolex-green duration-200 bg-white text-rolex-green cursor-pointer hover:border-gray-400"
          >
            Rechazar todo
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
/* Fade effect for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up effect for the small banner */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Slide right for the preference panel */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Scrollbar styling for a cleaner look */
div::-webkit-scrollbar {
  width: 4px;
}
div::-webkit-scrollbar-track {
  background: #f1f1f1;
}
div::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
</style>
