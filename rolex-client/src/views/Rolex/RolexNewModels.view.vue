<script setup>
import RolexFrame from "../../components/RolexFrame.vue";
import RolexTemplate from "../Rolex/RolexTemplate.view.vue";

import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const TARGET_DATE = {
  year: 2026,
  month: 3,
  day: 14,
};

const isTargetDate = computed(() => {
  const today = new Date();
  return (
    today.getFullYear() === TARGET_DATE.year &&
    today.getMonth() === TARGET_DATE.month &&
    today.getDate() === TARGET_DATE.day
  );
});

onMounted(() => {
  if (!isTargetDate.value) {
    //    router.push('/404');
    // Opción B: URL externa (descomenta la siguiente línea si es necesario)
    // window.location.href = 'https://google.com';
  }
});
</script>

<template>
  <RolexTemplate>
    <div>
      <RolexFrame />
    </div>
  </RolexTemplate>
</template>
