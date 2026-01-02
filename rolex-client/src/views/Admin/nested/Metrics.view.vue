<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { Bar, Chart, Grid, Line, Tooltip } from "vue3-charts";
import DashboardCard from "../../../components/dashboard/admin/DashboardCard.vue";
import MetricsDataService from "../../../services/metricsDataService";

const check = ref(false);
const isReady = ref(false);
const state = ref([]);
const years = ref([
  "2025",
  "2026",
  "2027",
  "2027",
  "2028",
  "2028",
  "2029",
  "2030",
]);
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

onMounted(() => {
  MetricsDataService.getSummary().then((d) => {
    isReady.value = true;
    state.value = d.data;
  });

  // setInterval(() => {
  //   window.location.href = "/dashboard/metricas";
  // }, 300000);
});
</script>

<template>
  <!-- <section class="h-screen text-white text-shadow-2xs font-bold text-3xl flex justify-center items-center w-full ">



    EN CONSTRUCCION

  
  </section> -->
 <section class="flex flex-col w-full pt-10 items-center min-h-screen">
    <DashboardCard class="w-11/12">
      <template #title>
        <div class="flex items-center gap-2">
          <RouterLink to="/dashboard" class="flex items-center">
            <font-awesome-icon
              @click="modal = false"
              :icon="['fas', 'arrow-left']"
              class="cursor-pointer"
            />
          </RouterLink>
          <h2 class="text-4xl">Métricas</h2>
        </div>
      </template>
      <template #content>
        <div v-if="isReady" class="flex flex-col justify-center gap-3">
          <div class="flex items-center justify-end w-full gap-4">
            <select
              name="collection"
              class="bg-gray-50 border border-rolex-green text-green-900 text-sm rounded-lg block w-20 p-2.5"
            >
              <option v-for="value in 12" :key="value" :value="value">
                {{ getMonthName(value - 1) }}
              </option>
            </select>
            <select
              name="collection"
              class="bg-gray-50 border border-rolex-green text-green-900 text-sm rounded-lg block w-20 p-2.5"
            >
              <option v-for="value in years" :key="value.id" :value="value.id">
                {{ value }}
              </option>
            </select>
          </div>
          <div class="h-fit">
            <h2 class="font-bold text-2xl pb-4">Resumen general</h2>

            <ul class="flex justify-between gap-3">
              <li
                class="border text-center p-4 rounded bg-white text-rolex-green border-rolex-green w-1/5"
              >
                <h4 class="text-xl font-bold">Visitantes unicos</h4>
                <p class="text-xl">{{ state.summary.totalUniqueVisitors }}</p>
              </li>
              <li
                class="border text-center p-4 rounded bg-white text-rolex-green border-rolex-green w-1/5"
              >
                <h4 class="text-xl font-bold">Visitas</h4>
                <p class="text-xl">{{ state.summary.totalPageViews }}</p>
              </li>
              <li
                class="border text-center p-4 rounded bg-white text-rolex-green border-rolex-green w-1/5"
              >
                <h4 class="text-xl font-bold">Visitas Totales</h4>
                <p class="text-xl">
                  {{ state.summary.paidVisits + state.summary.organicVisits }}
                </p>
              </li>
              <li
                class="border text-center p-4 rounded bg-white text-rolex-green border-rolex-green w-1/5"
              >
                <h4 class="text-xl font-bold">Visitas Organicas</h4>
                <p class="text-xl">{{ state.summary.organicVisits }}</p>
              </li>

              <li
                class="border text-center p-4 rounded bg-white text-rolex-green border-rolex-green w-1/5"
              >
                <h4 class="text-xl font-bold">Visitas Impulsadas</h4>
                <p class="text-xl">{{ state.summary.paidVisits }}</p>
              </li>
            </ul>

            <div>
              <h2 class="font-bold text-2xl py-4">
                Visitas organicas vs Visitas pagas - 2025
              </h2>
              <Chart
                :data="state.visitsByMonth"
                :size="{ width: 1240, height: 400 }"
                :margin="margin"
                class="bg-white rounded-xl border border-rolex-green"
              >
                <template #layers>
                  <Grid strokeDasharray="2,2" />
                  <Line
                    :dataKeys="['month', 'paidVisits']"
                    :lineStyle="{ stroke: '#472c20 ' }"
                    type="monotone"
                  />
                  <Line
                    :dataKeys="['month', 'organicVisits']"
                    :lineStyle="{ stroke: '#5dc38c' }"
                    type="monotone"

                  />
                </template>

                <template #widgets>
                  <Tooltip
                    borderColor="#01603A"
                    :config="{
                      month: { label: 'Mes' },
                      paidVisits: { color: '#472c20', label: 'Visitas pagas' },
                      organicVisits: {
                        color: '#5dc38c',
                        label: 'Visitas Organicas',
                      },
                    }"
                  />
                </template>
              </Chart>
            </div>
            <section class="flex gap-9">
              <div>
                <h2 class="font-bold text-2xl py-4">Pagínas mas vistas</h2>
                <Chart
                  :data="state.topPages"
                  :size="{ width: 600, height: 400 }"
                  :margin="margin"
                  class="bg-white rounded-xl border border-rolex-green"
                >
                  <template #layers>
                    <Grid strokeDasharray="2,2" />
                    <Bar
                      :dataKeys="[ 'path','viewCount']"
                      :barStyle="{ fill: '#01603a ' }"
                    />
                
                  </template>

                  <template #widgets>
                    <Tooltip
                      borderColor="#01603A"
                      :config="{
                        viewCount: { label: 'Visualizaciones' },
                        path: {
                          color: '#472c20',
                          label: 'URL',
                        },
                        title:{label: 'Nombre'}
                      }"
                    />
                  </template>
                </Chart>
              </div>
             
              <div>
                <h2 class="font-bold text-2xl py-4">Ciudades con mas visitas</h2>
                <Chart
                  :data="state.topCities"
                  :size="{ width: 600, height: 400 }"
                  :margin="margin"
                  class="bg-white rounded-xl border border-rolex-green"
                >
                  <template #layers>
                    <Grid strokeDasharray="2,2" />
                    <Bar
                      :dataKeys="[ 'city','count']"
                      :barStyle="{ fill: '#01603a ' }"
                    />
                
                  </template>

                  <template #widgets>
                    <Tooltip
                      borderColor="#01603A"
                      :config="{
                        count: { label: 'Visualizaciones' },
                        city: {
                          color: '#472c20',
                          label: 'Ciudad',
                        },
                        country:{label:'País'}
                      }"
                    />
                  </template>
                </Chart>
              </div>
             
            </section>
          </div>

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
</style>
