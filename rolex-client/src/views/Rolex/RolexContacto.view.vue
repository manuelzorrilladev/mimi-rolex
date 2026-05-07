<script setup>
import RolexTemplate from "../Rolex/RolexTemplate.view.vue";

import RolexHeader from "../../components/RolexHeader.vue";
import PageBanner from "../../components/banners-components/PageBanner.vue";
import SectionNavigationCard from "../../components/cards/SectionNavigationCard.vue";

import { computed, ref } from "vue";

const activate = ref("h-0");
const button = computed(() => {
  return activate.value == "h-0" ? "rotate-0" : "rotate-180";
});
function collapseNav() {
  activate.value == "h-0"
    ? (activate.value = "h-fit")
    : (activate.value = "h-0");
}
const dayChecker = ref("text-red-700");
const hour = new Date().getHours();
const day = new Date().getDay();

if (day == 7) {
  if (hour > 19 || hour < 12) {
    dayChecker.value = "Cerrado";
  }
} else {
  if (hour > 20 || hour < 10) {
    dayChecker.value = "Cerrado";
  } else {
    dayChecker.value = "Abierto";
  }
}

function CTATrack(type) {
  let link = "";
  let track = "";
  switch (type) {
    case "call":
      link = "tel:582123008742";
      track = "contactCall";
      break;

    case "whatsappCall":
      link = "https://wa.me/584143092501";
      track = "whatsappContact";
      break;

    case "mail":
      link = "mailto:info@mimijoyeria.com";
      track = "";
      break;

    case "direction":
      link = "https://maps.app.goo.gl/zHybs3yrhhvvHeiP8";
      track = "getDirections";
      break;

    default:
      break;
  }
  if (
    window._satellite &&
    typeof window._satellite.track === "function" &&
    track != ""
  ) {
    setTimeout(() => {
      window._satellite.track(track);
    }, 100);
  }

  window.open(link, "_blank");
}
</script>

<template>
  <div id="new-models">
    <RolexTemplate>
      <template #content>
        <PageBanner type="contact-location" />
        <RolexHeader color="bg-rolex-brown-light-2">
          <template #sub>
            Mimi Joyería, su Distribuidor Oficial Rolex
          </template>
          <template #title> PÓNGASE EN CONTACTO CON NOSOTROS </template>
          <template #text>
            Gracias al conocimiento, la destreza y el equipo necesarios para
            darle el mejor servicio, podemos garantizar la autenticidad de todas
            y cada una de las piezas de su Rolex. Déjenos dar respuesta a sus
            consultas.
          </template>
        </RolexHeader>

        <section class="flex justify-center bg-rolex-brown-light-2 w-full pb-[20vh]">
          <div
            class="flex md:w-10/12 flex-col-reverse md:flex-row items-center justify-center overflow-y-hidden h-fit md:h-[90vh] "
          >
            <div class="md:w-2/3 h-full">
              <img
                src="/assets/routes-assets/contact-rolex/map-desktop.webp"
                alt="map-store"
                class="h-full hidden md:block"
              />
              <img
                src="/assets/routes-assets/contact-rolex/map-mobile.webp"
                alt="map-store"
                class="block md:hidden"
              />
            </div>

            <div class="w-full md:w-1/3 bg-white h-full flex flex-col justify-center items-center gap-2 font-helvetica font-bold py-5 text-rolex-brown">
              <div class="w-10/12">
                <h2>Distribuidor Oficial Rolex</h2>
                <h2 class="text-3xl">Mimi Joyería C.A.</h2>
                <div class="py-3">
                  <h2 class="font-light">C.C. Tolón Fashion Mall Piso 1</h2>
                  <h2 class="font-light">1080, Caracas</h2>
                  <h2 class="font-light">Venezuela</h2>
                </div>

                <div class="flex text-sm gap-10 pb-4 relative w-full">
                  <h2
                    :class="
                      dayChecker == 'Abierto'
                        ? 'text-rolex-green'
                        : 'text-red-700'
                    "
                  >
                    {{ dayChecker }}
                  </h2>
                  <p
                    @click="collapseNav"
                    class="font-light text-rolex-green hover:underline cursor-pointer"
                  >
                    10:00am - 7:00pm
                    <font-awesome-icon
                      :icon="['fas', 'sort-down']"
                      :class="button"
                      class="pb-1 duration-200"
                    />
                  </p>
                  <div
                    :class="[activate, activate == 'h-0' ? 'p-0' : 'p-6']"
                    class="absolute bg-rolex-brown-light-2 flex justify-between top-7 w-full shadow-lg overflow-hidden duration-200"
                  >
                    <div class="space-y-2">
                      <h2>Lun</h2>
                      <h2>Mar</h2>
                      <h2>Mie</h2>
                      <h2>Jue</h2>
                      <h2>Vie</h2>
                      <h2>Sab</h2>
                      <h2>Dom</h2>
                    </div>
                    <div class="space-y-2">
                      <h2 class="font-light">10:00am - 8:00pm</h2>
                      <h2 class="font-light">10:00am - 8:00pm</h2>
                      <h2 class="font-light">10:00am - 8:00pm</h2>
                      <h2 class="font-light">10:00am - 8:00pm</h2>
                      <h2 class="font-light">10:00am - 8:00pm</h2>
                      <h2 class="font-light">10:00am - 8:00pm</h2>
                      <h2 class="font-light">12:00pm - 7:00pm</h2>
                    </div>
                  </div>
                </div>

                 <div
                  class="space-y-2 text-sm text-rolex-brown w-full  overflow-x-auto md:overflow-visible no-scrollbar"
                >
                  <div
                    class="flex flex-row md:flex-col flex-nowrap gap-4 md:gap-y-2 pb-4 md:pb-0"
                  >
                    <button
                      @click="CTATrack('call')"
                      class="flex items-center gap-4 w-fit flex-shrink-0 pr-4 md:pr-0 bg-white md:bg-transparent rounded-2xl"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'phone']"
                        class="text-md bg-white md:bg-rolex-brown-light-1 cursor-pointer p-3 rounded-full w-fit"
                      />
                      <p class="whitespace-nowrap">+58 212-3008742</p>
                    </button>

                    <button
                      @click="CTATrack('whatsappCall')"
                      class="flex items-center gap-4 w-fit flex-shrink-0 pr-4 md:pr-0 bg-white md:bg-transparent rounded-2xl"
                    >
                      <font-awesome-icon
                        :icon="['fab', 'whatsapp']"
                        class="text-md bg-white md:bg-rolex-brown-light-1 duration-200 cursor-pointer p-3 rounded-full"
                      />
                      <p class="whitespace-nowrap">Chat</p>
                    </button>

                    <button
                      @click="CTATrack('mail')"
                      class="flex items-center gap-4 w-fit flex-shrink-0 pr-4 md:pr-0 bg-white md:bg-transparent rounded-2xl"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'envelope']"
                        class="text-md bg-white md:bg-rolex-brown-light-1 duration-200 cursor-pointer p-3 rounded-full"
                      />
                      <p class="whitespace-nowrap">Envíenos un mensaje</p>
                    </button>

                    <button
                      @click="CTATrack('direction')"
                      class="flex items-center gap-4 w-fit flex-shrink-0 pr-4 md:pr-0 bg-white md:bg-transparent rounded-2xl"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'location-arrow']"
                        class="text-md bg-white md:bg-rolex-brown-light-1 duration-200 cursor-pointer p-3 rounded-full"
                      />
                      <p class="whitespace-nowrap">Conseguir la dirección</p>
                    </button>
                  </div>
                </div>

               
              </div>
            </div>
          </div>
        </section>

        <div class="flex justify-center">
          <img
            src="/assets/routes-assets/contact-rolex/contact-1.webp"
            alt="contact-rolex-center"
            class="hidden md:block"
          />
          <img
            src="/assets/routes-assets/contact-rolex/contact-1-mobile.webp"
            alt="contact-rolex-center-mobile"
            class="md:hidden block"
          />
        </div>

        <section
          class="bg-rolex-brown-light-2 flex flex-col justify-center items-center py-[10vh]"
        >
          <h2
            class="w-11/12 pb-4 font-helvetica font-bold text-rolex-brown text-2xl md:text-4xl"
          >
            Contáctanos
          </h2>
          <div class="w-11/12">
            <SectionNavigationCard
              img="contact-rolex/contact-2"
              :link="{ name: 'rolex-contacto-enviar-mensaje' }"
              class="w-full"
            >
              <template #title>Envíanos tu mensaje</template>

              <template #button>Contacto</template>
            </SectionNavigationCard>
          </div>
        </section>
      </template>
    </RolexTemplate>
  </div>
</template>



<style lang="css">
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

</style>
