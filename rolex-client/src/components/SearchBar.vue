<script setup>
import { computed, ref, watch } from 'vue';

const { args} = defineProps(['args'])
const model = defineModel()


const active = ref(false)
const collapseValue = ref(false)
const windowWidth = ref(window.innerWidth)



const searchArgs = {
    "1908": ['hidden','hidden','hidden','block'],
    "air-king": ['hidden','hidden','hidden','hidden'],
    "cosmograph-daytona": ['hidden','hidden','block','block'],
    "datejust": ['block','block','block','block'],
    "day-date": ['block','block','block','block'],
    "deepsea": ['hidden','hidden','hidden','block'],
    "explorer": ['hidden','block','block','block'],
    "gmt-master-ii": ['hidden','hidden','block','block'],
    "lady-datejust": ['hidden','hidden','block','block'],
    "oyster-perpetual": ['block','block','hidden','block'],
    "sea-dweller": ['hidden','hidden','block','hidden'],
    "sky-dweller": ['hidden','hidden','block','block'],
    "submariner": ['hidden','hidden','block','block'],
    "yatch-master": ['block','block','block','block'],
    "all":['block','block','block','block'],
    "oro":['block','block','hidden','block'],
    "hombres":['hidden','block','block','block'],
    "mujeres":['hidden','block','block','block'],
}

const modelCheck = computed(() => {
    return active.value == false ? 'bg-gray-500 text-gray-600 cursor-not-allowed' : 'bg-rolex-green text-white'
})


const disable = computed(() => {
    return model.value.length == 0 ? true : false
})

function deleteSearch(){
    model.value.size = ""
    model.value.material = ""
    model.value.esfera = ""
    model.value.estilo = ""
    active.value = false
} 

watch(model.value,()=>{
    if(model.value.material != "" || model.value.esfera != "" || model.value.size != "" || model.value.estilo != ""){
        active.value = true
        return
    }
    active.value = false
})

const activateCheck = computed(() => {
    if (windowWidth.value<768) {
        return collapseValue.value ? 'h-fit':'h-14'
    } else {
        return 'h-fit'
    }

})

function activate(){
    collapseValue.value = !collapseValue.value
}



</script>

<template>
    <section id="search-bar" class="w-full md:w-1/3 flex justify-center md:justify-end">
        
        <div :class="activateCheck" class=" flex flex-col w-9/12 overflow-hidden duration-200">
            <h2 class=" text-center font-vilsuve font-bold text-xl tracking-widest uppercase ">BúSQUEDA AVANZADA</h2>
            <div class="flex gap-2 justify-center  md:hidden">

                <h2>Agregar filtros</h2>
                <font-awesome-icon :icon="['fas', 'square-plus']" class="text-2xl text-main-green hover:text-[#8d958d] duration-100 cursor-pointer" @click="activate"/>
            </div>
         
            <hr>
            <button class="mt-2 mb-8 border border-white px-2 py-2 rounded-3xl  duration-700" :class="modelCheck"
                :disabled="disable" @click="deleteSearch">
                <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
                Borrar filtros
            </button>

            <div id="estilo" :class="searchArgs[args][0]" class="my-6 flex flex-col gap-4 pb-4">
                <h2 class="uppercase font-vilsuve font-bold text-md tracking-[.18em]">ESTILO</h2>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="hombre" value="HOMBRES" v-model="model.estilo">
                    <label class="font-helvetica" for="hombre">Hombre</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="mujer" value="MUJERES" v-model="model.estilo">
                    <label class="font-helvetica" for="mujer">Mujer</label>
                </div>

            </div>

            <div id="size" :class="searchArgs[args][1]" class="my-6 flex flex-col gap-4 pb-4">
                <h2 class="uppercase font-vilsuve font-bold   text-md tracking-[.18em]">Tamaño</h2>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="small" value="P" v-model="model.size">
                    <label class="font-helvetica" for="small">Pequeño</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="mediano" value="M" v-model="model.size">
                    <label class="font-helvetica" for="mediano">Mediano</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="grande" value="G" v-model="model.size">
                    <label class="font-helvetica" for="grande">Grande</label>
                </div>


            </div>

            <div id="material" :class="searchArgs[args][2]" class="my-6 flex flex-col gap-4 pb-4">
                <h2 class="uppercase font-vilsuve font-bold   text-md tracking-[.18em]">Material</h2>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="Acero Oystersteel" value="Acero Oystersteel" v-model="model.material">
                    <label class="font-helvetica" for="Acero Oystersteel">Acero Oystersteel</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="Acero Oystersteel y oro" value="Acero Oystersteel y oro" v-model="model.material">
                    <label class="font-helvetica" for="Acero Oystersteel y oro">Acero Oystersteel y oro</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="Oro" value="Oro" v-model="model.material">
                    <label class="font-helvetica" for="Oro">Oro</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="Platino" value="Platino" v-model="model.material">
                    <label class="font-helvetica" for="Platino">Platino</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="Titanio RLX" value="Titanio RLX" v-model="model.material">
                    <label class="font-helvetica" for="Titanio RLX">Titanio RLX</label>
                </div>


            </div>

            <div id="esfera" :class="searchArgs[args][3]" class="my-6 flex flex-col gap-4 pb-4">
                <h2 class="uppercase font-vilsuve font-bold text-md tracking-[.18em]">Esfera</h2>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="clara" value="Esfera clara" v-model="model.esfera">
                    <label class="font-helvetica" for="clara">Esfera clara</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="colores" value="Esfera de color" v-model="model.esfera">
                    <label class="font-helvetica" for="colores">Esfera de colores</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="oscura" value="Esfera oscura" v-model="model.esfera">
                    <label class="font-helvetica" for="oscura">Esfera Oscura</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="engastada" value="Esfera engastada" v-model="model.esfera">
                    <label class="font-helvetica" for="engastada">Esfera engastada</label>
                </div>
                <div class="flex items-center gap-3 pl-2">
                    <input
                        class="appearance-none border border-black w-4 h-4 rounded-none checked:bg-rolex-green cursor-pointer"
                        type="radio" name="pave" value="Esfera pave" v-model="model.esfera">
                    <label class="font-helvetica" for="pave">Esfera Pavé diamantes</label>
                </div>


            </div>


            <div id="navigation" class="pt-4">
                <h2 class="uppercase font-vilsuve font-bold  text-md tracking-[.18em] pb-4">ver colecciones</h2>
                <div class=" flex flex-col gap-6">
                    <a class="text-base" href="/coleccion/1908">Rolex 1908</a>
                    <a class="text-base" href="/coleccion/air-king">Rolex AIR-KING</a>
                    <a class="text-base" href="/coleccion/cosmograph-daytona">Rolex COSMOGRAPH DAYTONA</a>
                    <a class="text-base" href="/coleccion/datejust">Rolex DATEJUST</a>
                    <a class="text-base" href="/coleccion/day-date">Rolex DAY‑DATE</a>
                    <a class="text-base" href="/coleccion/deepsea">Rolex DEEPSEA</a>
                    <a class="text-base" href="/coleccion/explorer">Rolex EXPLORER</a>
                    <a class="text-base" href="/coleccion/gmt-master-ii">Rolex GMT-MASTER II</a>
                    <a class="text-base" href="/coleccion/datejust">Rolex LADY‑DATEJUST</a>
                    <a class="text-base" href="/coleccion/oyster-perpetual">Rolex OYSTER PERPETUAL</a>
                    <a class="text-base" href="/coleccion/sea-dweller">Rolex SEA-DWELLER</a>
                    <a class="text-base" href="/coleccion/sky-dweller">Rolex SKY‑DWELLER</a>
                    <a class="text-base" href="/coleccion/submariner">Rolex SUBMARINER</a>
                    <a class="text-base" href="/coleccion/yatch-master">Rolex YACHT‑MASTER</a>

                </div>

            </div>


        </div>
    </section>
</template>

