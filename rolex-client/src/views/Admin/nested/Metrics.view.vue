<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { RouterLink } from "vue-router";
import { Bar, Chart, Grid, Line, Tooltip } from "vue3-charts";
import DashboardCard from "../../../components/dashboard/admin/DashboardCard.vue";
import MetricsDataService from "../../../services/metricsDataService";
import Loading from "../../../components/global-components/Loading.vue";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { all } from "axios";
import metricsDataService from "../../../services/metricsDataService";

const check = ref(false);
const box = ref(null);
const isReady = ref(false);
const isLoading = ref(true);
const state = ref([]);
const yearlyState = ref([]); // Almacenará el reporte anual de marketing
const isLoadingYearly = ref(true);

const years = ref([2025, 2026, 2027, 2027, 2028, 2028, 2029, 2030]);

const margin = ref({
  left: 20,
  top: 20,
  right: 20,
  bottom: 20,
});

function getMonthName(monthNo) {
  const date = new Date(2024, monthNo, 1);
  const monthName = date.toLocaleString("default", { month: "long" });
  return monthName;
}

const month = ref(new Date().getMonth());
const year = ref(new Date().getFullYear());

function countTotal(arg) {
  let sum = 0;
  arg.forEach((element) => {
    sum += element.count;
  });
  return sum;
}

const allDevicesSum = ref({
  devices: 0,
  browsers: 0,
  os: 0,
});

function averagePercentage(total, part) {
  if (!total) return "0.00";
  return ((part / total) * 100).toFixed(2);
}

function changeDate() {
  isLoading.value = true;
  isReady.value = false;
  searchMetrics();
  searchYearlyMetrics();
}
const downloadPDF = async () => {
  if (!box.value) return;

  try {
    // Convertimos el elemento directamente a una imagen PNG de alta calidad.
    // Esto procesa Tailwind v4 y oklch de forma nativa a través del motor del navegador.
    const dataUrl = await toPng(box.value, { 
      quality: 0.95,
      pixelRatio: 2, // Mantiene el efecto de escala alta para que no se vea pixelado
      backgroundColor: '#ffffff' // Asegura un fondo blanco limpio bajo las gráficas
    });

    // Creamos el documento PDF (puedes usar 'p' para portrait o 'l' para landscape)
    // Dado que tus gráficas son anchas (1240px), 'landscape' (horizontal) suele ser mejor opción.
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
    });

    const imgProperties = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    // Añadimos la imagen procesada al PDF
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Descargamos el archivo
    pdf.save(`reporte-metricas-${year.value}.pdf`);
  } catch (error) {
    console.error('Error al generar el PDF de métricas:', error);
  }
};

function searchYearlyMetrics() {
  isLoadingYearly.value = true;
  // Llamada al nuevo método del servicio pasando el año seleccionado
  metricsDataService
    .getYearlyCampaing(year.value)
    .then((res) => {
      // Soportamos si la API devuelve directamente la data o la envuelve en marketingReport
      yearlyState.value = res.data.marketingReport || res.data;
      isLoadingYearly.value = false;
    })
    .catch((e) => {
      console.error("Error cargando métricas anuales:", e);
      isLoadingYearly.value = false;
    });
}

function searchMetrics() {
  console.log("Executing...");
  console.log(month.value, year.value);
  MetricsDataService.getSummary(month.value, year.value).then((d) => {
    isLoading.value = false;
    isReady.value = true;
    state.value = d.data;
    console.log("Correct");
    allDevicesSum.value.devices = countTotal(state.value.topDevices);
    allDevicesSum.value.browsers = countTotal(state.value.topBrowsers);
    allDevicesSum.value.os = countTotal(state.value.topOS);
  });
}

// CÁLCULOS DINÁMICOS DE ANCHO PARA PROTEGER LOS CHARTS DE GRANDES VOLÚMENES DE DATA
const dynamicPagesChartWidth = computed(() => {
  if (!state.value.topPages || state.value.topPages.length === 0) return 600;
  // Si hay más de 5 páginas (por si quitas el límite), expande horizontalmente
  return Math.max(600, state.value.topPages.length * 120);
});

const dynamicSourcesChartWidth = computed(() => {
  if (!state.value.sources || state.value.sources.length === 0) return 1240;
  // Otorga un espacio saludable de 150px por cada fuente detectada para que no se pisen las barras
  return Math.max(1240, state.value.sources.length * 150);
});

onMounted(() => {
  searchMetrics();
  searchYearlyMetrics();

  const intervalId = setInterval(() => {
    window.location.href = "/dashboard/metricas";
  }, 300000);
});
</script>

<template>
  <section
    class="flex flex-col w-full pt-10 items-center min-h-screen bg-gray-50/50 pb-12 font-montserrat"
  >
    <DashboardCard class="w-11/12 shadow-md border border-gray-100">
      <template #title>
        <div class="flex items-center justify-between w-full pb-2">
          <div class="flex items-center gap-3">
            <RouterLink
              to="/dashboard"
              class="flex items-center text-gray-500 hover:text-rolex-green transition-colors"
            >
              <font-awesome-icon
                @click="modal = false"
                :icon="['fas', 'arrow-left']"
                class="cursor-pointer text-xl"
              />
            </RouterLink>
            <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
              Métricas del Sitio
            </h2>
          </div>

          <button
            v-if="isReady && !isLoading"
            @click="downloadPDF"
            class="flex items-center gap-2 bg-rolex-green hover:bg-green-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm hover:shadow transition-all duration-200 text-sm tracking-wide cursor-pointer"
          >
            <font-awesome-icon :icon="['fas', 'file-pdf']" />
            Exportar Reporte PDF
          </button>
        </div>
      </template>

      <template #content>
        <div
          v-if="isReady && !isLoading"
          class="flex flex-col justify-center gap-8"
        >
          <div class="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 py-2">
            <div class="">
              <h2 class="font-black text-2xl text-gray-800 tracking-tight">
                Resumen General
                <span class="text-rolex-green font-medium capitalize"
                  >({{ getMonthName(month) }} - {{ year }})</span
                >
              </h2>
            </div>

            <div
              class="flex items-center justify-end gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100 w-fit self-end"
            >
              <span
                class="text-xs font-bold text-gray-500 uppercase tracking-wider px-2"
                >Período:</span
              >
              <select
                v-model="month"
                @change="changeDate"
                name="collection"
                class="bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg focus:ring-1 focus:ring-rolex-green focus:border-rolex-green block p-2 px-3 cursor-pointer outline-none transition"
              >
                <option v-for="value in 12" :key="value" :value="value - 1">
                  {{ getMonthName(value - 1) }}
                </option>
              </select>
              <select
                v-model="year"
                @change="changeDate"
                name="collection"
                class="bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg focus:ring-1 focus:ring-rolex-green focus:border-rolex-green block p-2 px-3 cursor-pointer outline-none transition"
              >
                <option v-for="value in years" :key="value" :value="value">
                  {{ value }}
                </option>
              </select>
            </div>
          </div>

          <div ref="box" class="h-fit flex flex-col gap-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div
                class="border-2 p-5 rounded-2xl bg-linear-to-br from-green-50/40 to-white text-rolex-green border-rolex-green/60 shadow-sm flex flex-col justify-between"
              >
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-green-800/80"
                >
                  Visitantes Únicos
                </h4>
                <p class="text-3xl font-black mt-2 tracking-tight">
                  {{ state.summary.totalUniqueVisitors }}
                </p>
              </div>
              <div
                class="border p-5 rounded-2xl bg-white text-gray-800 border-gray-200/70 shadow-sm flex flex-col justify-between"
              >
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Páginas Vistas
                </h4>
                <p
                  class="text-3xl font-black mt-2 tracking-tight text-gray-900"
                >
                  {{ state.summary.totalPageViews }}
                </p>
              </div>
              <div
                class="border p-5 rounded-2xl bg-white text-gray-800 border-gray-200/70 shadow-sm flex flex-col justify-between"
              >
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Visitas Totales
                </h4>
                <p
                  class="text-3xl font-black mt-2 tracking-tight text-gray-900"
                >
                  {{ state.summary.paidVisits + state.summary.organicVisits }}
                </p>
              </div>
              <div
                class="border p-5 rounded-2xl bg-white text-gray-800 border-gray-200/70 shadow-sm flex flex-col justify-between"
              >
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Visitas Orgánicas
                </h4>
                <p
                  class="text-3xl font-black mt-2 tracking-tight text-emerald-600"
                >
                  {{ state.summary.organicVisits }}
                </p>
              </div>
              <div
                class="border p-5 rounded-2xl bg-white text-gray-800 border-gray-200/70 shadow-sm flex flex-col justify-between"
              >
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Visitas Impulsadas
                </h4>
                <p
                  class="text-3xl font-black mt-2 tracking-tight text-amber-800"
                >
                  {{ state.summary.paidVisits }}
                </p>
              </div>
            </div>

            <div
              class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <h3 class="font-bold text-lg text-gray-800 mb-4 tracking-tight">
                Evolución de Tráfico: Orgánico vs. Pago — {{ year }}
              </h3>
              <div class="w-full overflow-x-auto rounded-xl">
                <Chart
                  :data="state.visitsByMonth"
                  :size="{ width: 1240, height: 350 }"
                  :margin="margin"
                  class="bg-white mx-auto"
                >
                  <template #layers>
                    <Grid strokeDasharray="3,3" stroke="#f0f0f0" />
                    <Line
                      :dataKeys="['month', 'paidVisits']"
                      :lineStyle="{ stroke: '#472c20', strokeWidth: 3 }"
                      type="monotone"
                    />
                    <Line
                      :dataKeys="['month', 'organicVisits']"
                      :lineStyle="{ stroke: '#01603a', strokeWidth: 3 }"
                      type="monotone"
                    />
                  </template>
                  <template #widgets>
                    <Tooltip
                      borderColor="#01603A"
                      :config="{
                        month: { label: 'Mes' },
                        paidVisits: {
                          color: '#472c20',
                          label: 'Visitas pagas',
                        },
                        organicVisits: {
                          color: '#01603a',
                          label: 'Visitas Orgánicas',
                        },
                      }"
                    />
                  </template>
                </Chart>
              </div>
            </div>

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 next-page">
              <div
                class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
              >
                <h3 class="font-bold text-lg text-gray-800 mb-4 tracking-tight">
                  Top Páginas más Vistas
                </h3>
                <div class="w-full overflow-x-auto rounded-xl">
                  <Chart
                    :data="state.topPages"
                    :size="{ width: dynamicPagesChartWidth, height: 350 }"
                    :margin="margin"
                    class="bg-white"
                  >
                    <template #layers>
                      <Grid strokeDasharray="3,3" stroke="#f0f0f0" />
                      <Bar
                        :dataKeys="['path', 'viewCount']"
                        :barStyle="{
                          fill: '#01603a',
                          borderRadius: [4, 4, 0, 0],
                        }"
                      />
                    </template>
                    <template #widgets>
                      <Tooltip
                        borderColor="#01603A"
                        :config="{
                          viewCount: { label: 'Visualizaciones' },
                          path: { color: '#472c20', label: 'URL' },
                          title: { label: 'Nombre' },
                        }"
                      />
                    </template>
                  </Chart>
                </div>
              </div>

              <div
                class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
              >
                <h3 class="font-bold text-lg text-gray-800 mb-4 tracking-tight">
                  Geolocalización: Ciudades Líderes
                </h3>
                <div class="w-full overflow-x-auto rounded-xl">
                  <Chart
                    :data="state.topCities"
                    :size="{ width: 600, height: 350 }"
                    :margin="margin"
                    class="bg-white"
                  >
                    <template #layers>
                      <Grid strokeDasharray="3,3" stroke="#f0f0f0" />
                      <Bar
                        :dataKeys="['city', 'count']"
                        :barStyle="{
                          fill: '#472c20',
                          borderRadius: [4, 4, 0, 0],
                        }"
                      />
                    </template>
                    <template #widgets>
                      <Tooltip
                        borderColor="#01603A"
                        :config="{
                          count: { label: 'Visualizaciones' },
                          city: { color: '#01603a', label: 'Ciudad' },
                          country: { label: 'País' },
                        }"
                      />
                    </template>
                  </Chart>
                </div>
              </div>
            </section>

            <div class="border-b border-gray-100 pb-2 mt-4 next-page">
              <h2 class="font-bold text-xl text-gray-800 tracking-tight">
                Entorno Tecnológico de la Audiencia
              </h2>
            </div>

            <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col"
              >
                <h4
                  class="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4"
                >
                  Navegadores
                </h4>
                <div class="flex flex-col gap-3 grow justify-center">
                  <div
                    v-for="(value, key) in state.topBrowsers"
                    :key="key"
                    class="relative overflow-hidden border border-gray-100 rounded-xl p-3 bg-gray-50/30"
                  >
                    <div
                      class="absolute top-0 left-0 bottom-0 bg-green-50/60 transition-all duration-500"
                      :style="{
                        width:
                          averagePercentage(
                            allDevicesSum.browsers,
                            value.count,
                          ) + '%',
                      }"
                    ></div>
                    <div
                      class="relative flex justify-between items-center text-sm"
                    >
                      <span class="font-semibold text-gray-800"
                        >{{ key + 1 }}. {{ value.browser }}</span
                      >
                      <span
                        class="text-xs font-bold text-rolex-green bg-white border border-green-100 px-2 py-0.5 rounded-md"
                      >
                        {{ value.count }} ({{
                          averagePercentage(
                            allDevicesSum.browsers,
                            value.count,
                          )
                        }}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col"
              >
                <h4
                  class="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4"
                >
                  Dispositivos
                </h4>
                <div class="flex flex-col gap-3 grow justify-center">
                  <div
                    v-for="(value, key) in state.topDevices"
                    :key="key"
                    class="relative overflow-hidden border border-gray-100 rounded-xl p-3 bg-gray-50/30"
                  >
                    <div
                      class="absolute top-0 left-0 bottom-0 bg-amber-50/60 transition-all duration-500"
                      :style="{
                        width:
                          averagePercentage(
                            allDevicesSum.devices,
                            value.count,
                          ) + '%',
                      }"
                    ></div>
                    <div
                      class="relative flex justify-between items-center text-sm"
                    >
                      <span class="font-semibold text-gray-800"
                        >{{ key + 1 }}. {{ value.device_type }}</span
                      >
                      <span
                        class="text-xs font-bold text-brown-700 bg-white border border-amber-100 px-2 py-0.5 rounded-md"
                      >
                        {{ value.count }} ({{
                          averagePercentage(allDevicesSum.devices, value.count)
                        }}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col"
              >
                <h4
                  class="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4"
                >
                  Sistemas Operativos
                </h4>
                <div class="flex flex-col gap-3 grow justify-center">
                  <div
                    v-for="(value, key) in state.topOS"
                    :key="key"
                    class="relative overflow-hidden border border-gray-100 rounded-xl p-3 bg-gray-50/30"
                  >
                    <div
                      class="absolute top-0 left-0 bottom-0 bg-green-50/60 transition-all duration-500"
                      :style="{
                        width:
                          averagePercentage(allDevicesSum.os, value.count) +
                          '%',
                      }"
                    ></div>
                    <div
                      class="relative flex justify-between items-center text-sm"
                    >
                      <span class="font-semibold text-gray-800"
                        >{{ key + 1 }}. {{ value.os }}</span
                      >
                      <span
                        class="text-xs font-bold text-rolex-green bg-white border border-green-100 px-2 py-0.5 rounded-md"
                      >
                        {{ value.count }} ({{
                          averagePercentage(allDevicesSum.os, value.count)
                        }}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div
              class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm next-page"
            >
              <h3 class="font-bold text-lg text-gray-800 mb-4 tracking-tight">
                Canales de Adquisición de Tráfico
              </h3>
              <div class="w-full overflow-x-auto rounded-xl">
                <Chart
                  :data="state.sources"
                  :size="{ width: dynamicSourcesChartWidth, height: 350 }"
                  :margin="margin"
                  class="bg-white"
                >
                  <template #layers>
                    <Grid strokeDasharray="3,3" stroke="#f0f0f0" />
                    <Bar
                      :dataKeys="['utm_source', 'count']"
                      :barStyle="{
                        fill: '#472c20',
                        borderRadius: [4, 4, 0, 0],
                      }"
                    />
                  </template>
                  <template #widgets>
                    <Tooltip
                      borderColor="#01603A"
                      :config="{
                        utm_source: { label: 'Fuente del Tráfico' },
                        count: { label: 'Visitas Recibidas' },
                      }"
                    />
                  </template>
                </Chart>
              </div>
            </div>

            <div class="border-b border-gray-100 pb-2 mt-4 next-page">
              <h2 class="font-bold text-xl text-gray-800 tracking-tight">
                Métricas Estratégicas de Campañas Anuales (UTM) — {{ year }}
              </h2>
            </div>

            <section
              class="w-full border border-gray-100 bg-white rounded-2xl p-2 shadow-sm mb-6 overflow-hidden"
            >
              <div v-if="isLoadingYearly" class="flex justify-center py-10">
                <p class="text-gray-400 italic text-sm animate-pulse">
                  Procesando registros analíticos del año...
                </p>
              </div>
              <div
                v-else-if="yearlyState.length === 0"
                class="flex justify-center py-10"
              >
                <p class="text-gray-400 text-sm">
                  No se detectaron campañas UTM activas en el año {{ year }}.
                </p>
              </div>
              <div v-else class="overflow-x-auto">
                <table
                  class="min-w-full divide-y divide-gray-200 text-left text-sm"
                >
                  <thead class="bg-gray-50/70 font-bold text-rolex-green">
                    <tr>
                      <th class="px-6 py-3.5 text-xs uppercase tracking-wider">
                        Fuente (Source)
                      </th>
                      <th class="px-6 py-3.5 text-xs uppercase tracking-wider">
                        Medio (Medium)
                      </th>
                      <th class="px-6 py-3.5 text-xs uppercase tracking-wider">
                        Campaña (Campaign)
                      </th>
                      <th
                        class="px-6 py-3.5 text-xs uppercase tracking-wider text-center"
                      >
                        Visitas Totales
                      </th>
                      <th
                        class="px-6 py-3.5 text-xs uppercase tracking-wider text-center"
                      >
                        Visitantes Únicos
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="divide-y divide-gray-100 bg-white text-gray-600"
                  >
                    <tr
                      v-for="(camp, index) in yearlyState"
                      :key="index"
                      class="hover:bg-gray-50/60 transition-colors"
                    >
                      <td class="px-6 py-4 font-semibold text-gray-900">
                        {{ camp.utm_source }}
                      </td>
                      <td class="px-6 py-4">
                        <span
                          class="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium text-xs tracking-wide"
                        >
                          {{ camp.utm_medium }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-gray-500 italic font-medium">
                        {{ camp.utm_campaign }}
                      </td>
                      <td
                        class="px-6 py-4 text-center font-bold text-rolex-green text-base"
                      >
                        {{ camp.totalVisits }}
                      </td>
                      <td
                        class="px-6 py-4 text-center font-semibold text-gray-800"
                      >
                        {{ camp.uniqueVisitors }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <div v-if="isLoading" class="py-20 flex justify-center items-center">
          <Loading />
        </div>
      </template>
    </DashboardCard>
  </section>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

.notification-enter-active {
  animation: notificate 0.5s;
}

.notification-enter-active {
  animation: notificate 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes notificate {
  0% {
    transform: translateY(-100%);
  }
  80% {
    transform: translateY(1%);
  }
  100% {
    transform: translateY(0%);
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0);
}

.scale-enter-to,
.scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Color corporativo personalizado */
.text-rolex-green {
  color: #01603a;
}
.border-rolex-green {
  border-color: #01603a;
}
.bg-rolex-green {
  background-color: #01603a;
}
</style>
