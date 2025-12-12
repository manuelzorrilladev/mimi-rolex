<script setup>
import { useWindowSize } from '@vueuse/core';
import { computed, onMounted, ref, watch } from 'vue';

const INITIAL_ITEMS_TO_SHOW = 4
const pieces = [
	{
		"id": 33,
		"serie": "rosario-8342",
		"nombre": "Rosario 8342",
		"titulo": "Rosario Oro Amarillo en 18 Kilates.",
	},
	{
		"id": 35,
		"serie": "zarcillo-8296",
		"nombre": "Zarcillo 8296",
		"titulo": "Abridor Tipo Clavo en 18 Kilates.",
	},
	{
		"id": 40,
		"serie": "zarcillo-8433",
		"nombre": "Zarcillo 8433",
		"titulo": "Zarcillos de Estrellas en 18 Kilates.",
	},
	{
		"id": 41,
		"serie": "zarcillo-8437",
		"nombre": "Zarcillo 8437",
		"titulo": "Zarcillos con Delfin en Oro 18 Kilates.",
	},
	{
		"id": 16,
		"serie": "argolla-8418",
		"nombre": "Argolla 8418",
		"titulo": "Argollas con Turquesa en Oro 18 Kilates.",
	},
	{
		"id": 26,
		"serie": "pulsera-1092",
		"nombre": "Pulsera 1091",
		"titulo": "Pulsera Neopreno Oro Amarillo en 18 Kilates.",
	},
	{
		"id": 12,
		"serie": "argolla-8389",
		"nombre": "Argolla 8389",
		"titulo": "Argollas en Oro 18 Kilates.",
	},
	{
		"id": 28,
		"serie": "pulsera-8335",
		"nombre": "Pulsera 8335",
		"titulo": "Pulsera con Bolitas y Corazon en Oro 18 kilates.",
	},
	{
		"id": 10,
		"serie": "argolla-8387",
		"nombre": "Argolla 8387",
		"titulo": "Argollas Diamantadas Oro Amarillo en 18 Kilates.",
	},
	{
		"id": 37,
		"serie": "zarcillo-8425",
		"nombre": "Zarcillo 8425",
		"titulo": "Zarcillos de Bolita en 18 Kilates.",
	},
	{
		"id": 3,
		"serie": "anillo-8361",
		"nombre": "Anillo 8361",
		"titulo": "Anillo Solitario en Oro 18 Kilates.",
	},
	{
		"id": 14,
		"serie": "argolla-8395",
		"nombre": "Argolla 8395",
		"titulo": "Argollas Ovaldas en 18 Kilates.",
	},
	{
		"id": 13,
		"serie": "argolla-8391",
		"nombre": "Argolla 8391",
		"titulo": "Huggies 3 Colores en Oro 18 Kilates",
	},
	{
		"id": 31,
		"serie": "rosario-1111",
		"nombre": "Rosario 1111",
		"titulo": "oro 18k.",
	},
	{
		"id": 30,
		"serie": "rosario-1093",
		"nombre": "Rosario 1093",
		"titulo": "Rosario de 3 Colores en Oro 18 Kilates.",
	}
]
const { width } = useWindowSize()

const allCollection = ref(7)
const itemCounter = ref(0)
const itemsToShow = ref(4)
const sectionCheck = ref(0)


const maxCapacity = computed(() => {
    if (Math.floor(width.value / 298) > INITIAL_ITEMS_TO_SHOW) {
        return INITIAL_ITEMS_TO_SHOW
    }
    return Math.floor(width.value / 298)
})

const visibleArea = computed(() => {
    return itemsToShow.value * 298
})

const sliderStyle = computed(() => {
    return `transform:translateX(-${itemCounter.value * 298}px)`
})
const fullSize = computed(() => {
    return `width: ${visibleArea.value}px !important`
})


function checkIfFits() {

    if (maxCapacity.value <= INITIAL_ITEMS_TO_SHOW) {
        itemsToShow.value = maxCapacity.value
    }

}

function move(dir) {
    if (dir == 'r') {

        itemCounter.value = itemCounter.value + 1
        return
    }
    itemCounter.value = itemCounter.value - 1
}

function changeCheck() {
    if (sectionCheck.value == 3) {
        sectionCheck.value = 0
        return
    }
    sectionCheck.value = sectionCheck.value + 1
}
function toggleSection(pos) {
    if (pos == sectionCheck.value) {
        return true
    }
    return false
}


watch(width, () => {
    checkIfFits()

})


onMounted(() => {
    checkIfFits()
    setInterval(changeCheck, 5000)
})
</script>

<template>
    <div id="joyeria">
        <section class="relative">
            <div class="w-full">
                <img src="/assets/routes-assets/joyeria/banner-2.webp" alt="" class="w-full hidden md:block">
                <img src="/assets/routes-assets/joyeria/banner-2-mobile.webp" alt="" class="w-full md:hidden">
            </div>
            <header class="absolute  top-8 text-white text-shadow-2xs w-full">
                <h2 class="font-mimi-head text-center text-4xl md:text-7xl text-shadow-lg text-shadow-neutral-600">
                    Forjando recuerdos, para toda la vida </h2>


            </header>
        </section>
        <section class="w-full flex justify-center relative h-[300px] bg-gray-100">
            <div class="flex  justify-start gap-[18px] h-[350px]  px-2 pt-20 bg-transparent -translate-y-20 overflow-hidden "
                :style="fullSize">
                <div v-for="value in allCollection" :style="sliderStyle"
                    class="bg-white rounded-lg shadow-lg px-8 py-3 min-w-[280px]  w-[280px] h-[280px] -translate-y-10 hover:-translate-y-20 duration-300">
                    <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
                    <h2 class="font-bold text-2xl text-neutral-700">Nacimiento</h2>
                    <div class="w-full flex justify-center py-3">
                        <img :src="`/assets/routes-assets/joyeria/img-${value}.webp`" alt="" class="w-2/3">

                    </div>
                    <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button>
                </div>
            </div>
            <button v-if="itemCounter <= allCollection - itemsToShow - 1"
                class="absolute  top-2/5 right-4 md:right-20 w-14 h-14 -translate-y-8 text-rolex-brown text-2xl bg-white rounded-full p-3 shadow-lg hover:shadow-xl duration-300 cursor-pointer border border-white hover:bg-rolex-brown hover:text-white flex justify-center items-center"
                @click="move('r')">
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
            </button>
            <button v-if="itemCounter > 0"
                class="absolute  top-2/5 left-4 md:left-20 w-14 h-14 -translate-y-8 text-rolex-brown text-2xl bg-white rounded-full p-3 shadow-lg hover:shadow-xl duration-300 cursor-pointer border border-white hover:bg-rolex-brown hover:text-white flex justify-center items-center"
                @click="move('l')">
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
            </button>
        </section>
        <section class="bg-gray-100 flex flex-col md:flew-row items-center justify-around pb-14 gap-4 md:gap-0">
            <div class="flex justify-center w-full md:w-1/2">
                <header class="w-10/12 md:w-2/3 ">
                    <h2 class="font-mimi-head md:w-2/3 text-4xl text-shadow-lg">Primer Brillo: Joyas para Celebrar la
                        Bienvenida </h2>
                    <p class="font-montserrat md:w-2/3 ">El nacimiento de un bebé y su bautizo son hitos puros e
                        inolvidables. En MIMI JOYERÍA, encontrarás piezas delicadas y seguras, ideales para conmemorar
                        este nuevo comienzo.</p>
                </header>

            </div>
            <div class="w-10/12 md:w-1/2 flex justify-center relative">


                <div class="bg-white rounded-lg shadow-lg px-8 py-3  md:w-1/2 ">
                    <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
                    <h2 class="font-bold text-2xl text-neutral-700">Nacimiento</h2>
                    <div class="w-full overflow-hidden">
                        <img src="https://mimijoyeria.com/storage/store-products/zarcillo-8294-2.webp" alt=""
                            class="scale-200">

                    </div>

                    <h4 class="text-sm font-light text-neutral-700">Oro 18K</h4>

                    <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
                </div>
                <Transition name="fade">
                    <div v-if="toggleSection(1)" class="bg-white rounded-lg shadow-lg px-8 py-3  md:w-1/2 absolute z-10">
                        <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
                        <h2 class="font-bold text-2xl text-neutral-700">Nacimiento</h2>
                        <div class="w-full overflow-hidden">
                            <img src="https://mimijoyeria.com/storage/store-products/zarcillo-8296-2.webp" alt=""
                                class="scale-200">

                        </div>

                        <h4 class="text-sm font-light text-neutral-700">Oro 18K</h4>

                        <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
                    </div>

                </Transition>
                <Transition name="fade">

                    <div v-if="toggleSection(2)" class="bg-white rounded-lg shadow-lg px-8 py-3  md:w-1/2 absolute z-10">
                        <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
                        <h2 class="font-bold text-2xl text-neutral-700">Nacimiento</h2>
                        <div class="w-full overflow-hidden">
                            <img src="https://mimijoyeria.com/storage/store-products/zarcillo-8301-2.webp" alt=""
                                class="scale-200">

                        </div>

                        <h4 class="text-sm font-light text-neutral-700">Oro 18K</h4>

                        <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
                    </div>
                </Transition>
                <Transition name="fade">
                    <div v-if="toggleSection(3)" class="bg-white rounded-lg shadow-lg px-8 py-3  md:w-1/2 absolute z-10">
                        <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
                        <h2 class="font-bold text-2xl text-neutral-700">Nacimiento</h2>
                        <div class="w-full overflow-hidden">
                            <img src="https://mimijoyeria.com/storage/store-products/zarcillo-8427-2.webp" alt=""
                                class="scale-200">

                        </div>

                        <h4 class="text-sm font-light text-neutral-700">Oro 18K</h4>

                        <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
                    </div>
                </Transition>
            </div>


        </section>
        <section class="bg-[url(/assets/routes-assets/joyeria/silk.webp)] bg-cover bg-center bg-fixed w-full mb-10 pb-10">
            <header class="text-center py-6 flex flex-col items-center">
                <h2 class="font-mimi-head text-4xl">Una joya, para cada momento</h2>
                <p class="font-montserrat w-10/12">Te acompañamos en cada etapa significativa. Explora nuestros diseños
                    especializados para matrimonios,
                    nacimientos, graduaciones y aniversarios. En cada pieza hay una historia que tú estás por comenzar.
                </p>
            </header>
            <div class="w-full flex justify-center">
                <div class="w-10/12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    <div v-for="value in pieces" class="bg-white rounded-lg shadow-lg px-8 py-3  ">
                        <h4 class="text-sm font-light text-neutral-700">Categoria</h4>
                        <h2 class="font-bold text-2xl text-neutral-700">{{value.nombre}}</h2>
                        <div class="w-full overflow-hidden">
                            <img :src="`https://mimijoyeria.com/storage/store-products/${value.serie}-2.webp`" alt=""
                                class="scale-150">

                        </div>

                        <h4 class="text-sm font-light text-neutral-700">{{ value.titulo }}</h4>

                        <!-- <button class="px-2 py-1 rounded bg-rolex-brown text-white font-montserrat">Ver colección</button> -->
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
