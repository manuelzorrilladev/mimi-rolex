<script setup>
import { onMounted, ref } from "vue";
import DashboardCard from "../../../components/dashboard/admin/DashboardCard.vue";
import { RouterLink } from "vue-router";
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

onMounted(() => {
  MetricsDataService.getSummary().then((d) => {
    isReady.value = true;
    state.value = d.data;
  });

  setInterval(()=>{
    window.location.href = "/dashboard/metricas"
  }, 300000)
});
</script>

<template>
  <section
    class="flex flex-col w-full pt-10 items-center min-h-screen"
  >
    <DashboardCard class="w-11/12 h-36">
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
          <div class="flex items-center justify-end w-full  gap-4">
            <select
              name="collection"
              class="bg-gray-50 border border-rolex-green text-green-900 text-sm rounded-lg block w-20 p-2.5"
              v-if="isReady"
            >
              <option v-for="value in years" :key="value.id" :value="value.id">
                {{ value }}
              </option>
            </select>
          </div>
          <div class="bg-red-500 h-fit">
            <header>
              <h2>Métricas generales</h2>
              <ul>
                <li>

                </li>
              </ul>
            {{ state}}
            </header>
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
