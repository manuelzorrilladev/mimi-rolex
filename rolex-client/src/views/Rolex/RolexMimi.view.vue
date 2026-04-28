<script setup>
import { Head } from "@unhead/vue/components";
import { ref } from "vue";

import PageBanner from "../../components/banners-components/PageBanner.vue";
import RolexHeader from "../../components/RolexHeader.vue";
import festiveSelection from "../../data/festiveSelection.json";
import RolexTemplate from "../Rolex/RolexTemplate.view.vue";
import GLOBAL_OBJECT from "../../utils/globaj";

const watchItems = ref(festiveSelection["watches"]);
const accesoriesItems = ref(festiveSelection["accesories"]);
</script>

<template>
  <RolexTemplate>
    <Head>
      <title>Rolex en Mimi Joyería</title>
      <meta
        name="description"
        content="Para las fiestas, Rolex presenta una selección especial de distintivos y refinados relojes y exclusivos accesorios. Descúbralos en Mimi Joyería, su Distribuidor Oficial Rolex en Venezuela."
      />
    </Head>
    <template #content>
      <div>
        <PageBanner type="showroom" />

        <section class="flex justify-center bg-rolex-brown-light-2">
          <header
            class="flex flex-col md:flex-row gap-8 font-helvetica font-bold justify-between items-center md:items-start text-rolex-brown h-fit py-12 md:py-36 md:w-10/12"
          >
            <div class="w-10/12 md:w-1/2">
              <h1 class="text-3xl md:text-5xl">Rolex en Mimi Joyería</h1>
            </div>
            <p
              class="w-10/12 text-xl md:w-2/5 text-justify md:text-left font-normal"
            >
                Con una trayectoria de
                <strong>
                  más de 40 años en el mundo de la alta relojería</strong>, brindamos el respaldo oficial de Rolex en Venezuela con el
                propósito de honrar nuestro legado como el primer punto de venta
                y centro de servicio autorizado en Caracas.
            </p>
          </header>
        </section>
    
        <section>
          <section class="bg-rolex-brown-light-1 py-[10vh]">
            <header
              class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit pb-[10vh]"
            >
              <h1 class="text-2xl md:text-5xl w-10/12 md:w-1/2">
                Un entorno exclusivo
              </h1>
              <p
                class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
              >
                La estética atemporal de los relojes se manifiesta con sutileza
                en cada trazo del diseño. Las lámparas suspendidas sobre el
                Watch Bar evocan la curvatura de la lente Cyclops , mientras que
                los matices aqua green rinden homenaje a la devoción absoluta
                por el detalle que define a Rolex.
              </p>
            </header>

            <div class="flex justify-center">
              <img
                src="/assets/routes-assets/showroom/showroom-1.webp"
                alt="showroom-4"
                class="hidden md:block w-10/12"
              />
              <img
                src="/assets/routes-assets/showroom/showroom-1-mobile.webp"
                alt="showroom-4-mobile"
                class="md:hidden block w-10/12"
              />
            </div>
          </section>
          <!-- <section class="bg-rolex-brown-light-2 ">
           

            <div class="flex justify-center pb-[10vh]">
              <img
                src="/assets/routes-assets/showroom/showroom-5.webp"
                alt="showroom-1"
                class="hidden md:block w-10/12"
              />
              <img
                src="/assets/routes-assets/showroom/showroom-5-mobile.webp"
                alt="showroom-1-mobile"
                class="md:hidden block w-10/12"
              />
            </div>
          </section> -->
          <section class="bg-rolex-brown-light-1">
            <header
              class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit pb-[10vh]"
            >
              <h1 class="text-2xl md:text-5xl w-10/12 md:w-1/2">
                Un espacio renovado
              </h1>
              <p
                class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
              >
                Ubicado estratégicamente en el Tolón Fashion Mall de Las
                Mercedes, este punto de encuentro de 109 m² captura la
                excelencia de los estándares globales de diseño. En Mimi Joyería
                comprendemos que su Rolex es el guardián de sus momentos más
                memorables; por ello, nos enorgullece ser el primer taller de
                servicio postventa autorizado por la marca en la capital.
              </p>
            </header>

            <div class="flex justify-center">
              <img
                src="/assets/routes-assets/showroom/showroom-2.webp"
                alt="showroom-2"
                class="hidden md:block w-10/12"
              />
              <img
                src="/assets/routes-assets/showroom/showroom-2-mobile.webp"
                alt="showroom-2-mobile"
                class="md:hidden block w-10/12"
              />
            </div>
          </section>
          <section class="bg-rolex-brown-light-2 py-[10vh]">
            <header
              class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit pb-[10vh]"
            >
              <h1 class="text-2xl md:text-5xl w-10/12 md:w-1/2">
                Elegancia y funcionalidad
              </h1>
              <p
                class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
              >
                Desde la calidez de la recepción hasta el asesoramiento
                especializado, cada instante está diseñado para transformar la
                visita en una experiencia íntima. La arquitectura interior
                celebra la armonía de las formas, donde la luz y el mobiliario
                crean una atmósfera impregnada por los códigos y la cultura de
                excelencia de la marca.
              </p>
            </header>

            <div class="flex justify-center">
              <img
                src="/assets/routes-assets/showroom/showroom-3.webp"
                alt="showroom-3"
                class="hidden md:block w-10/12"
              />
              <img
                src="/assets/routes-assets/showroom/showroom-3-mobile.webp"
                alt="showroom-3-mobile"
                class="md:hidden block w-10/12"
              />
            </div>
          </section>

          <section class="bg-rolex-brown-light-2">
            <header
              class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit pb-[10vh]"
            >
              <h1 class="text-2xl md:text-5xl w-10/12 md:w-1/2">
                Fachada y acabados naturales
              </h1>
              <p
                class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
              >
                Al ingresar, los visitantes descubren una fachada en piedra
                Travertino que emula la noble textura del bisel estriado. Este
                material fluye hacia el interior abrazado por boiserie de nogal
                y cuero, envolviendo al visitante en la calidez y distinción
                que caracteriza al universo de la marca.
              </p>
            </header>

            <div class="flex justify-center pb-[10vh]">
              <img
                src="/assets/routes-assets/showroom/showroom-4.webp"
                alt="showroom-5"
                class="hidden md:block w-10/12"
              />
              <img
                src="/assets/routes-assets/showroom/showroom-4-mobile.webp"
                alt="showroom-5-mobile"
                class="md:hidden block w-10/12"
              />
            </div>
          </section>
        </section>
      </div>
    </template>
  </RolexTemplate>
</template>
