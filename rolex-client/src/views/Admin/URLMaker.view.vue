<script setup>
import { ref, computed } from "vue";
import GLOBAL_OBJECT from '../../utils/globaj';
import DashboardCard from "../../components/dashboard/admin/DashboardCard.vue";

const mainRoute = GLOBAL_OBJECT.MAIN_URL;

// Estados reactivos del formulario
const targetUrl = ref("");
const selectedSource = ref("");
const selectedMedium = ref("");
const customMedium = ref("");
const campaignName = ref("");

// Copiar al portapapeles retroalimentación visual
const copied = ref(false);

// Listado inteligente de Fuentes y sus respectivos Medios sugeridos
const sourceOptions = [
  { 
    id: "instagram", 
    label: "Instagram",
    mediums: [
      { value: "social_bio", label: "Enlace en Biografía (Organic)" },
      { value: "cpc", label: "Publicación Impulsada / Anuncio (Paid)" },
      { value: "social_story", label: "Enlace en Historia" }
    ]
  },
  { 
    id: "facebook", 
    label: "Facebook",
    mediums: [
      { value: "social_bio", label: "Enlace en Información/Biografía" },
      { value: "cpc", label: "Publicación Impulsada / Anuncio (Paid)" },
      { value: "social_post", label: "Post Orgánico en el Muro" }
    ]
  },
  { 
    id: "google", 
    label: "Google Ads (Buscador / Display)",
    mediums: [
      { value: "cpc", label: "Campaña de Pago por Clic (CPC)" }
    ]
  },
  { 
    id: "email", 
    label: "Correo Electrónico / Boletín",
    mediums: [
      { value: "newsletter", label: "Boletín Informativo (Newsletter)" },
      { value: "email_direct", label: "Firma o Correo Directo de Soporte" }
    ]
  },
  { 
    id: "whatsapp", 
    label: "WhatsApp Business",
    mediums: [
      { value: "chat_link", label: "Enlace de Chat Directo" },
      { value: "catalog", label: "Catálogo de Productos" }
    ]
  },
  { 
    id: "qr", 
    label: "Código QR Impreso",
    mediums: [
      { value: "qr_showroom", label: "Mostrador / Vitrina Física" },
      { value: "qr_card", label: "Tarjeta de Presentación / Empaque" }
    ]
  },
  { 
    id: "custom", 
    label: "Otro origen (Personalizado)",
    mediums: []
  }
];

// Computed para extraer los medios según la fuente elegida
const availableMediums = computed(() => {
  const found = sourceOptions.find(s => s.id === selectedSource.value);
  return found ? found.mediums : [];
});

// Resetea el medio si cambia la fuente seleccionada
function onSourceChange() {
  selectedMedium.value = "";
  customMedium.value = "";
}

// Limpiar cadenas para que sean seguras en URLs (reemplaza espacios por guiones bajos, pasa a minúsculas)
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")           // Reemplaza espacios con _
    .replace(/[^\w\-]+/g, "")       // Remueve caracteres no válidos
    .replace(/\-\-+/g, "-");        // Evita guiones dobles
}

// GENERADOR DINÁMICO DEL ENLACE OPTIMIZADO
const generatedUrl = computed(() => {
  // Si no hay URL base, no procesamos nada
  if (!targetUrl.value) return "";

  let baseUrl = targetUrl.value.trim();
  
  // Si el usuario no escribe el protocolo, lo agregamos de manera preventiva
  if (!/^https?:\/\//i.test(baseUrl)) {
    baseUrl = "https://" + baseUrl;
  }

  try {
    const urlObj = new URL(baseUrl);
    
    // Determinamos qué medio inyectar en la query
    const finalMedium = selectedSource.value === 'custom' ? customMedium.value : selectedMedium.value;

    // Agregamos los parámetros analíticos únicamente si están completados
    if (selectedSource.value) {
      urlObj.searchParams.set("utm_source", slugify(selectedSource.value));
    }
    if (finalMedium) {
      urlObj.searchParams.set("utm_medium", slugify(finalMedium));
    }
    if (campaignName.value) {
      urlObj.searchParams.set("utm_campaign", slugify(campaignName.value));
    }

    
    return urlObj.toString();
  } catch (e) {
    return "Formato de URL base inválido. Por favor, revísalo.";
  }
});

// FUNCIÓN PARA COPIAR AL PORTAPAPELES
const copyToClipboard = async () => {
  if (!generatedUrl.value || generatedUrl.value.startsWith("Formato")) return;
  
  try {
    await navigator.clipboard.writeText(generatedUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch (err) {
    console.error("No se pudo copiar el enlace", err);
  }
};

// LIMPIAR TODO EL FORMULARIO
function clearForm() {
  targetUrl.value = "";
  selectedSource.value = "";
  selectedMedium.value = "";
  customMedium.value = "";
  campaignName.value = "";
}
</script>

<template>
  <section class="py-10 flex justify-center bg-gray-50/50 min-h-screen">
    <DashboardCard class="w-10/12 shadow-md border border-gray-100">
      <template #title>
        <div class="flex items-center gap-2 text-rolex-green">
          <font-awesome-icon :icon="['fas', 'link']" class="text-rolex-green" />
          <span class="font-extrabold tracking-tight">Creador de Enlaces de Campaña (UTM)</span>
        </div>
      </template>

      <template #content>
        <main class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          
          <div class="w-full flex flex-col row-span-1 gap-5">
            
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-rolex-green">
                1. URL de destino final <span class="text-red-500">*</span>
              </label>
              <div class="relative rounded-xl shadow-sm">
                <input
                  v-model="targetUrl"
                  type="text"
                  placeholder="ej. joyeriaweb.com/joyeria/anillos-oro o rolex/datejust"
                  class="w-full bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-xl focus:ring-1 focus:ring-rolex-green focus:border-rolex-green p-3 outline-none transition"
                />
              </div>
              <p class="text-[11px] text-rolex-green/70">La página exacta del sitio web.</p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-rolex-green">
                2. Origen de la campaña (utm_source) <span class="text-red-500">*</span>
              </label>
              <select
                v-model="selectedSource"
                @change="onSourceChange"
                class="w-full bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl focus:ring-1 focus:ring-rolex-green focus:border-rolex-green p-3 cursor-pointer outline-none transition"
              >
                <option value="" disabled selected>-- Selecciona la plataforma o red social --</option>
                <option v-for="source in sourceOptions" :key="source.id" :value="source.id">
                  {{ source.label }}
                </option>
              </select>
            </div>

            <div v-if="selectedSource && selectedSource !== 'custom'" class="flex flex-col gap-1.5 transition-all duration-300">
              <label class="text-xs font-bold uppercase tracking-wider text-rolex-green">
                3. Medio o Ubicación (utm_medium) <span class="text-red-500">*</span>
              </label>
              <select
                v-model="selectedMedium"
                class="w-full bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl focus:ring-1 focus:ring-rolex-green focus:border-rolex-green p-3 cursor-pointer outline-none transition"
              >
                <option value="" disabled selected>-- Selecciona dónde se ubicará el link --</option>
                <option v-for="med in availableMediums" :key="med.value" :value="med.value">
                  {{ med.label }} ({{ med.value }})
                </option>
              </select>
            </div>

            <div v-if="selectedSource === 'custom'" class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-rolex-green">
                3. Escribe tu medio personalizado (utm_medium) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="customMedium"
                type="text"
                placeholder="ej. foro_relojes, influencer_colab, banner_lateral"
                class="w-full bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-xl focus:ring-1 focus:ring-rolex-green focus:border-rolex-green p-3 outline-none transition"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-rolex-green">
                4. Nombre identificador de campaña (utm_campaign)  <span class="text-red-500">*</span>
              </label>
              <input
                v-model="campaignName"
                type="text"
                placeholder="ej. promocion_tudor_junio, dia_de_las_madres, liquidacion_oro"
                class="w-full bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-xl focus:ring-1 focus:ring-rolex-green focus:border-rolex-green p-3 outline-none transition"
              />
              <p class="text-[11px] text-rolex-green/70">Te servirá en los reportes anuales para separar el rendimiento de promociones específicas.</p>
            </div>

            <button 
              @click="clearForm"
              type="button" 
              class="self-start text-xs font-bold text-rolex-green/70 hover:text-red-700 transition duration-150 mt-2"
            >
              <font-awesome-icon :icon="['fas', 'trash-can']" class="mr-1" />
              Limpiar Campos
            </button>
          </div>

          <div class="w-full flex flex-col row-span-1 justify-start h-full">
            <div class="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 h-96">
              <div>
                <h3 class="font-extrabold text-sm text-gray-800 uppercase tracking-wider mb-1">Resultado del enlace</h3>
                <p class="text-xs text-rolex-green/70">Este es el enlace enriquecido que debes pegar en tus plataformas de marketing para que el backend capture la analítica limpia.</p>
              </div>

              <div class=" flex items-center">
                <div 
                  class="w-full p-4 rounded-xl border font-mono text-xs break-all select-all transition-all duration-300 min-h-[110px] flex items-center shadow-inner"
                  :class="[
                    !generatedUrl 
                      ? 'bg-gray-100/50 border-gray-200 text-rolex-green/70 italic justify-center text-center' 
                      : generatedUrl.startsWith('Formato') 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-white border-green-200 text-gray-700 font-semibold'
                  ]"
                >
                  {{ generatedUrl || "Completa los campos obligatorios para generar automáticamente el enlace estructurado de tracking..." }}
                </div>
              </div>

              <button
                @click="copyToClipboard"
                :disabled="!targetUrl || !selectedSource || (!selectedMedium && !customMedium) ||!campaignName  || generatedUrl.startsWith('Formato')"
                class="w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl shadow-sm transition-all duration-300 text-sm tracking-wide"
                :class="[
                  copied 
                    ? 'bg-green-700 text-white' 
                    : !targetUrl || !selectedSource || (!selectedMedium && !customMedium )||!campaignName|| generatedUrl.startsWith('Formato')
                      ? 'bg-gray-200 text-rolex-green/70 cursor-not-allowed shadow-none'
                      : 'bg-rolex-green hover:bg-green-800 text-white hover:shadow'
                ]"
              >
                <font-awesome-icon :icon="copied ? ['fas', 'check'] : ['fas', 'copy']" />
                {{ copied ? "¡Copiado con Éxito!" : "Copiar Enlace Estructurado" }}
              </button>

             
            </div>
          </div>

        </main>
      </template>
    </DashboardCard>
  </section>
</template>

<style scoped>
/* Respetamos tu paleta corporativa elegante */
.text-rolex-green {
  color: #01603a;
}
.bg-rolex-green {
  background-color: #01603a;
}
.focus\:border-rolex-green:focus {
  border-color: #01603a;
}
.focus\:ring-rolex-green:focus {
  --tw-ring-color: #01603a;
}
</style>