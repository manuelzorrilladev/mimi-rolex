<script setup>
import { onMounted, ref } from "vue";

const searchParams = defineModel();
const emit = defineEmits("reset");
const filterBoxes = ref([true, true, true, true, true]);
const collection = ref([
  ["Cosmograph Daytona", "cosmograph-daytona"],
  ["1908", "1908"],
  ["Sky-Dweller", "sky-dweller"],
  ["Gmt-Master II", "gmt-master-ii"],
  ["Explorer", "explorer"],
  ["Explorer II", "explorer-ii"],
  ["Oyster Perpetual", "oyster-perpetual"],
  ["Day-Date", "day-date"],
  ["Datejust", "datejust"],
  ["Lady-Datejust", "lady-datejust"],
  ["Air-King", "air-king"],
  ["Submariner", "submariner"],
  ["Sea-Dweller", "sea-dweller"],
  ["Deepsea", "deepsea"],
  ["Land-Dweller", "land-dweller"],
  ["Yacht-Master", "yacht-master"],
  ["Yacht-Master II", "yacht-master-ii"],
]);

const materialOption = ref([
  "Acero Oystersteel",
  "Acero Oystersteel y oro",
  "Oro amarillo",
  "Oro rosa",
  "Oro blanco",
  "Platino",
  "Titanio RLX",
]);

const dialOption = ref([
  "Esfera clara",
  "Esfera de color",
  "Esfera oscura",
  "Esfera engastada",
]);

const priceSelected = ref(6);

const activeClass = ref("rotate-0");

const priceOptions = ref([
  {
    name: "5 000 – 10 000 $",
    min: 5000,
    max: 10000,
  },
  {
    name: "10 000 – 20 000 $",
    min: 10000,
    max: 20000,
  },
  {
    name: "20 000 – 30 000 $",
    min: 20000,
    max: 30000,
  },
  {
    name: "30 000 – 40 000 $",
    min: 30000,
    max: 40000,
  },
  {
    name: "≥ 40 000$",
    min: 40000,
    max: 9999999,
  },
]);

function toggleBox(pos) {
  filterBoxes.value[pos] = !filterBoxes.value[pos];
}

function setPrice(opt, index) {
  searchParams.value.selectedMinPrice = opt.min;
  searchParams.value.selectedMaxPrice = opt.max;
  priceSelected.value = index;
}
onMounted(() => {
  searchParams.selectedMaterial = "";
});
</script>

<template>
  <div class="bg-transparent h-full md:w-1/5 px-2">
    <header class="flex justify-between font-helvetica items-center gap-6 pb-6">
      <h2 class="font-bold text-rolex-brown text-2xl" >Filtros</h2>
      <button
        @click="$emit('reset')"
        class="bg-rolex-brown-light-1 text-rolex-brown border w-fit border-rolex-brown-bg-rolex-brown-light-1 px-4 py-2 font-helvetica font-bold rounded-3xl hover:bg-rolex-brown hover:text-white duration-200 group cursor-pointer flex items-center gap-3"
      >
        <p>Reiniciar</p>
        <font-awesome-icon
          :icon="['fas', 'arrow-rotate-left']"
          class="group-hover:-rotate-360 duration-500 ease-in-out"
        />
      </button>
    </header>
    <hr class="border border-gray-200" />
    <Transition name="appear">
    <div>
      <div>
        <button
          @click="toggleBox(0)"
          class="flex justify-between font-helvetica items-center gap-6 py-2 w-full cursor-pointer"
        >
          <h2 class="font-bold text-rolex-brown text-xl">Colección</h2>
          <font-awesome-icon
            :icon="['fas', 'minus']"
            class="text-rolex-brown w-fit px-4 py-2 font-helvetica font-bold rounded-3xl group"
          />
        </button>

        <Transition name="appear">
          <div v-if="filterBoxes[0]" class="space-y-3 pb-6">
            <div class="flex items-center gap-2" v-for="value in collection">
              <button
                class="font-light text-sm hover:underline"
                @click="searchParams.selectedCollection = value[1]"
              >
                {{ value[0] }} de Rolex
              </button>
            </div>
          </div>
        </Transition>
      </div>
      <hr class="border border-gray-200" />

      <div>
        <button
          @click="toggleBox(1)"
          class="flex justify-between font-helvetica items-center gap-6 py-2 w-full cursor-pointer"
        >
          <h2 class="font-bold text-rolex-brown text-xl text-left">
            Tamaño del modelo
          </h2>
          <font-awesome-icon
            :icon="['fas', 'minus']"
            class="text-rolex-brown w-fit px-4 py-2 font-helvetica font-bold rounded-3xl group"
          />
        </button>

        <Transition name="appear">
          <div v-if="filterBoxes[1]" class="space-y-3 pb-8">
            <div class="space-y-3">
              <div
                class="flex items-center gap-3 cursor-pointer select-none group"
                @click="searchParams.selectedSize = 'Pequeño'"
              >
                <div
                  class="w-4 h-4 rounded-none border flex items-center justify-center transition-all duration-200"
                  :class="
                    searchParams.selectedSize === 'Pequeño'
                      ? 'bg-rolex-brown border-rolex-brown text-white'
                      : 'bg-white border-neutral-300 group-hover:border-rolex-brown'
                  "
                >
                  <svg
                    v-if="searchParams.selectedSize === 'Pequeño'"
                    class="w-3 h-3 stroke-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span class="font-light text-sm text-neutral-800">
                  Tamaño pequeño (28-35 mm)
                </span>
              </div>
              <div
                class="flex items-center gap-3 cursor-pointer select-none group"
                @click="searchParams.selectedSize = 'Mediano'"
              >
                <div
                  class="w-4 h-4 rounded-none border flex items-center justify-center transition-all duration-200"
                  :class="
                    searchParams.selectedSize === 'Mediano'
                      ? 'bg-rolex-brown border-rolex-brown text-white'
                      : 'bg-white border-neutral-300 group-hover:border-rolex-brown'
                  "
                >
                  <svg
                    v-if="searchParams.selectedSize === 'Mediano'"
                    class="w-3 h-3 stroke-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span class="font-light text-sm text-neutral-800">
                  Tamaño Mediano (36-40 mm)
                </span>
              </div>
              <div
                class="flex items-center gap-3 cursor-pointer select-none group"
                @click="searchParams.selectedSize = 'Grande'"
              >
                <div
                  class="w-4 h-4 rounded-none border flex items-center justify-center transition-all duration-200"
                  :class="
                    searchParams.selectedSize === 'Grande'
                      ? 'bg-rolex-brown border-rolex-brown text-white'
                      : 'bg-white border-neutral-300 group-hover:border-rolex-brown'
                  "
                >
                  <svg
                    v-if="searchParams.selectedSize === 'Grande'"
                    class="w-3 h-3 stroke-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span class="font-light text-sm text-neutral-800">
                  Tamaño Grande (41 mm +)
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <hr class="border border-gray-200" />

      <div>
        <button
          @click="toggleBox(2)"
          class="flex justify-between font-helvetica items-center gap-6 py-2 w-full cursor-pointer"
        >
          <h2 class="font-bold text-rolex-brown text-xl text-left">Material</h2>
          <font-awesome-icon
            :icon="['fas', 'minus']"
            class="text-rolex-brown w-fit px-4 py-2 font-helvetica font-bold rounded-3xl group"
          />
        </button>

        <Transition name="appear">
          <div v-if="filterBoxes[2]" class="space-y-3 pb-8">
            <div class="space-y-3">
              <div
                v-for="value in materialOption"
                class="flex items-center gap-3 cursor-pointer select-none group"
                @click="searchParams.selectedMaterial = value"
              >
                <div
                  class="w-4 h-4 rounded-none border flex items-center justify-center transition-all duration-200"
                  :class="
                    searchParams.selectedMaterial == value
                      ? 'bg-rolex-brown border-rolex-brown text-white'
                      : 'bg-white border-neutral-300 group-hover:border-rolex-brown'
                  "
                >
                  <svg
                    v-if="searchParams.selectedMaterial == value"
                    class="w-3 h-3 stroke-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span class="font-light text-sm text-neutral-800">
                  {{ value }}
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <hr class="border border-gray-200" />

      <div>
        <button
          @click="toggleBox(3)"
          class="flex justify-between font-helvetica items-center gap-6 py-2 w-full cursor-pointer"
        >
          <h2 class="font-bold text-rolex-brown text-xl text-left">Esfera</h2>
          <font-awesome-icon
            :icon="['fas', 'minus']"
            class="text-rolex-brown w-fit px-4 py-2 font-helvetica font-bold rounded-3xl group"
          />
        </button>

        <Transition name="appear">
          <div v-if="filterBoxes[3]" class="space-y-3 pb-8">
            <div class="space-y-3">
              <div
                v-for="value in dialOption"
                class="flex items-center gap-3 cursor-pointer select-none group"
                @click="searchParams.selectedDial = value"
              >
                <div
                  class="w-4 h-4 rounded-none border flex items-center justify-center transition-all duration-200"
                  :class="
                    searchParams.selectedDial == value
                      ? 'bg-rolex-brown border-rolex-brown text-white'
                      : 'bg-white border-neutral-300 group-hover:border-rolex-brown'
                  "
                >
                  <svg
                    v-if="searchParams.selectedDial == value"
                    class="w-3 h-3 stroke-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span class="font-light text-sm text-neutral-800">
                  {{ value }}
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <hr class="border border-gray-200" />

      <div>
        <button
          @click="toggleBox(4)"
          class="flex justify-between font-helvetica items-center gap-6 py-2 w-full cursor-pointer"
        >
          <h2 class="font-bold text-rolex-brown text-xl text-left">Precio</h2>
          <font-awesome-icon
            :icon="['fas', 'minus']"
            class="text-rolex-brown w-fit px-4 py-2 font-helvetica font-bold rounded-3xl group"
          />
        </button>

        <Transition name="appear">
          <div v-if="filterBoxes[4]" class="space-y-3 pb-8">
            <div class="space-y-3">
              <div
                v-for="(value, index) in priceOptions"
                class="flex items-center gap-3 cursor-pointer select-none group"
                @click="setPrice(value, index)"
              >
                <div
                  class="w-4 h-4 rounded-none border flex items-center justify-center transition-all duration-200"
                  :class="
                    priceSelected == index
                      ? 'bg-rolex-brown border-rolex-brown text-white'
                      : 'bg-white border-neutral-300 group-hover:border-rolex-brown'
                  "
                >
                  <svg
                    v-if="priceSelected == index"
                    class="w-3 h-3 stroke-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span class="font-light text-sm text-neutral-800">
                  {{ value.name }}
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
    
    </Transition>
  </div>
</template>

<style scoped></style>
