<script setup>
import PageBanner from "../../components/banners-components/PageBanner.vue";
import ModelsCard from "../../components/cards/ModelsCard.vue";
import RolexFrame from "../../components/RolexFrame.vue";
import RolexTemplate from "../Rolex/RolexTemplate.view.vue";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import RolexHeader from "../../components/RolexHeader.vue";
</script>

<template>
  <RolexTemplate>
    <template #content>
      <PageBanner type="new-watches-2026" />

      <RolexHeader color="bg-rolex-brown-light-2">
        <template #title>
          Nuevos Relojes Rolex 2026 <br />
          Mimi Joyería
        </template>
        <template #text>
          <strong>
            Rolex celebra un siglo de logros en relojería y allana el camino
            para futuros triunfos.
          </strong>
          Ciencia de los materiales, maestría en la elaboración de esferas y
          rendimiento relojero: los relojes presentados este año inauguran una
          nueva era de proezas e innovaciones marcada por una certificación
          Superlative Chronometer, más exigente si cabe, que se sigue
          simbolizando mediante un sello verde.
        </template>
      </RolexHeader>

      <div
        class="flex flex-col justify-center items-center w-full text-rolex-brown bg-rolex-brown-light-2 pb-[10vh]"
      >
        <div
          id="rolex-container"
          class="grid grid-cols-1 place-items-center md:grid-cols-2 w-10/12 gap-x-2 gap-y-10"
        >
          <ModelsCard
            img="new-watches/hub/oyster-perpetual-41-cover"
            :link="{
              name: 'rolex-nuevos-modelos-2026',
              params: { id: 'oyster-perpetual-41' },
            }"
          >
            <template #sub> Nuevos modelos 2026 </template>
            <template #title> Oyster Perpetual 41 </template>
          </ModelsCard>

          <ModelsCard
            img="new-watches/hub/oyster-perpetual-36-cover"
            :link="{
              name: 'rolex-nuevos-modelos-2026',
              params: { id: 'oyster-perpetual-36' },
            }"
          >
            <template #sub> Nuevos modelos 2026 </template>
            <template #title> Oyster Perpetual 36 </template>
          </ModelsCard>

          <ModelsCard
            img="new-watches/hub/oyster-perpetual-28-and-34-cover"
            :link="{
              name: 'rolex-nuevos-modelos-2026',
              params: { id: 'oyster-perpetual-28-and-34' },
            }"
          >
            <template #sub> Nuevos modelos 2026 </template>
            <template #title> Oyster Perpetual 28 & 34 </template>
          </ModelsCard>

          <ModelsCard
            img="new-watches/hub/datejust-41-cover"
            :link="{
              name: 'rolex-nuevos-modelos-2026',
              params: { id: 'datejust-41' },
            }"
          >
            <template #sub> Nuevos modelos 2026 </template>
            <template #title> Datejust 41 </template>
          </ModelsCard>

          <ModelsCard
            img="new-watches/hub/yacht-master-ii-cover"
            :link="{
              name: 'rolex-nuevos-modelos-2026',
              params: { id: 'yacht-master-ii' },
            }"
          >
            <template #sub> Nuevos modelos 2026 </template>
            <template #title> Yacht-Master II </template>
          </ModelsCard>
        </div>
      </div>
    </template>
  </RolexTemplate>
</template>
