<script setup>
import { RouterLink } from "vue-router";
import RolexTemplate from "./RolexTemplate.view.vue";
import SectionNavigationCard from "../../components/cards/SectionNavigationCard.vue";
import PageBanner from "../../components/banners-components/PageBanner.vue";
import RolexHeader from "../../components/RolexHeader.vue";
</script>

<template>
  <RolexTemplate>
    <template #content>
      <PageBanner type="oyster" />

      <RolexHeader color="bg-rolex-brown-light-2">
        <template #title> Oyster Story </template>
        <template #text>
          <strong>
            Nació de la visión de Hans Wilsdorf. El fundador de Rolex trató de
            hacer del reloj de pulsera una parte integrante de las innovaciones
            tecnológicas que transformaron la sociedad a principios del siglo
            XX. Cien años después de revolucionar el mundo de la relojería, el
            Oyster sigue expandiéndose, ayudando a todos los usuarios a
            perseguir sus objetivos personales.
          </strong>
          <br /><br />
          Precisión cronométrica, hermeticidad y cuerda automática: estos tres
          desafíos clave y logros relojeros fundamentales consolidarían el éxito
          de un visionario y forjarían el destino de un reloj revolucionario.
        </template>
      </RolexHeader>

      <div
        class="video-frame flex bg-rolex-brown-light-2 justify-center pb-[10vh]"
      >
        <div class="w-9/12 aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/RuvG8SD0aUw?si=F_1WOI6QTyJ1POj9"
            title="YouTube video player"
            frameborder="0"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
              web-share;
            "
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div class="flex justify-center pt-[10vh] bg-rolex-brown-light-1">
        <img
          src="/assets/routes-assets/oyster/oyster-1.webp"
          alt="cosmograph-daytona-1"
          class="hidden md:block md:w-9/12"
        />
        <img
          src="/assets/routes-assets/oyster/oyster-1-mobile.webp"
          alt="cosmograph-daytona-1-mobile"
          class="md:hidden block w-10/12"
        />
      </div>

      <section class="bg-rolex-brown-light-1 py-[10vh]">
        <header
          class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit"
        >
          <h1 class="text-3xl md:text-5xl w-10/12 md:w-1/2">
            El desafío de la precisión
          </h1>

          <p
            class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
          >
            En 1910, un reloj Rolex recibió un certificado de precisión
            cronométrica de la Oficina Oficial de Control del Funcionamiento de
            Relojes de Bienne, Suiza. Así pues, se demostró que este reloj de
            pulsera era tan preciso como un reloj de bolsillo, la referencia de
            la época. Unos años más tarde, en 1914, el mundo de la relojería se
            quedó asombrado una vez más, cuando otro reloj de pulsera Rolex
            recibió un certificado de Clase «A» del Observatorio de Kew, en Gran
            Bretaña. Por lo general, esta distinción se reservaba a los grandes
            cronómetros marinos.
          </p>

          <p
            class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
          >
            Gracias a estos logros, Rolex contribuyó de manera significativa a
            la credibilidad del reloj de pulsera, que anteriormente había sido
            considerado como una simple joya muy poco fiable en términos de
            precisión. Tras haber superado el desafío de precisión, Rolex centró
            su atención en diseñar un armazón impecable para proteger sus
            movimientos.
          </p>
        </header>
      </section>

      <section class="bg-rolex-brown-light-2 py-[10vh]">
        <header
          class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit"
        >
          <h1 class="text-3xl md:text-5xl w-10/12 md:w-1/2">
            Del Oyster al Oyster Perpetual
          </h1>

          <p
            class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
          >
            La invención del Oyster en 1926 supuso un importante avance en la
            relojería. La caja, que daría nombre a un reloj de pulsera, era
            completamente hermética al agua y al polvo gracias a su sistema de
            bisel, fondo y corona enroscados sobre la carrura.
          </p>
          <p
            class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
          >
            Esta revolución relojera se puso a prueba en 1927 cuando la inglesa
            Mercedes Gleitze cruzó el canal entre Francia e Inglaterra a nado,
            pasando más de diez horas en las frías aguas. El reloj que llevaba,
            un Oyster de oro, siguió funcionando a la perfección.
          </p>
          <p
            class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
          >
            El desarrollo en 1931 de un sistema de cuerda automática
            revolucionario, el rotor Perpetual, mejoró aún más el rendimiento de
            los relojes Rolex. Preciso, hermético y ahora autónomo, el Oyster se
            había convertido en «Perpetual».
          </p>
        </header>
      </section>

      <section class="bg-rolex-brown-light-2 pb-[10vh]">
        <div class="flex justify-center">
          <img
            src="/assets/routes-assets/oyster/oyster-2.webp"
            alt="oyster-story-2"
            class="hidden md:block w-full"
          />
          <img
            src="/assets/routes-assets/oyster/oyster-2-mobile.webp"
            alt="oyster-story-2-mobile"
            class="md:hidden block w-full"
          />
        </div>

        <header
          class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit py-[10vh]"
        >
          <h1 class="text-3xl md:text-5xl w-10/12 md:w-1/2">
            Un laboratorio a cielo abierto
          </h1>
          <p
            class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
          >
            Ejemplo de solidez y fiabilidad, la caja Oyster del Cosmograph
            Daytona, de 40 mm de diámetro, garantiza una hermeticidad de hasta
            100 metros de profundidad. La corona de cuerda Triplock, provista de
            un sistema de triple hermeticidad y de protectores tallados en la
            carrura, se enrosca firmemente a la caja, al igual que los
            pulsadores de cronógrafo. El cristal está realizado en zafiro
            prácticamente imposible de rayar y presenta un tratamiento
            antirreflejos.
          </p>
        </header>

        <div class="flex justify-center">
          <img
            src="/assets/routes-assets/oyster/oyster-3.webp"
            alt="oyster-story-3"
            class="hidden md:block w-10/12 md:w-1/2"
          />
          <img
            src="/assets/routes-assets/oyster/oyster-3-mobile.webp"
            alt="oyster-story-3-mobile"
            class="md:hidden block w-10/12 md:w-1/2"
          />
        </div>
      </section>

      <section class="bg-rolex-brown-light-2">
        <div class="bg-rolex-brown-light-1 pt-[10vh]">
          <div class="flex justify-center">
            <img
              src="/assets/routes-assets/oyster/oyster-4.webp"
              alt="oyster-story-4"
              class="hidden md:block w-10/12 md:w-9/12"
            />
            <img
              src="/assets/routes-assets/oyster/oyster-4-mobile.webp"
              alt="oyster-story-4-mobile"
              class="md:hidden block w-10/12 md:w-9/12"
            />
          </div>

          <header
            class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit py-[10vh]"
          >
            <h1 class="text-3xl md:text-5xl w-10/12 md:w-1/2">
              Una colección impulsada por la innovación
            </h1>
            <p
              class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
            >
              Mayor resistencia a la presión y a los campos magnéticos de alta
              intensidad, bisel giratorio graduado, un segundo huso horario...
              Desde mediados de 1940, los modelos se multiplican y especializan
              cada vez más para satisfacer una amplia gama de necesidades. Desde
              el primer Oyster surgió toda una familia de relojes. Cada uno de
              ellos ha establecido el estándar en su categoría y muchos han sido
              aclamados como iconos del diseño de relojes.
            </p>
          </header>
        </div>
        <header
          class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit pt-[10vh]"
        >
          <h1 class="text-3xl md:text-5xl w-10/12 md:w-1/2">
            Un compromiso de futuro
          </h1>
          <p
            class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
          >
            La historia del Oyster también está marcada por los numerosos logros
            de usuarios emblemáticos de Rolex.
            <br /><br />
            La marca apoya a atletas cuya experiencia, rigor, técnica y
            capacidad para inspirar a las generaciones más jóvenes han
            contribuido a dar forma a la historia de su deporte. Rolex sigue
            demostrando este compromiso colaborando con las instituciones más
            prestigiosas de la hípica, el golf, el automovilismo, el tenis y la
            vela.
            <br /><br />
            Esta búsqueda de la excelencia también impulsa a las personas
            apoyadas por la Iniciativa Perpetual Arts, cuyo talento deja una
            huella duradera en la cultura global. Al apoyar a estos maestros de
            la emoción, así como a las instituciones donde actúan, Rolex se
            esfuerza por preservar y transmitir los valores humanos
            fundamentales que defiende.
            <br /><br />
            Este compromiso con el futuro también se expresa a través de la
            Iniciativa Perpetual Planet, impulsada por quienes comparten su
            experiencia para afrontar los desafíos medioambientales de nuestro
            tiempo. Hoy en día, estos agentes de cambio se basan en el legado de
            los primeros exploradores, esforzándose por mejorar nuestra
            comprensión del mundo para encontrar maneras de protegerlo.
          </p>
        </header>

        <div class="flex justify-center bg-rolex-brown-light-2 py-[10vh]">
          <img
            src="/assets/routes-assets/oyster/oyster-5.webp"
            alt="oyster-story-5"
            class="hidden md:block w-10/12 md:w-1/2"
          />
          <img
            src="/assets/routes-assets/oyster/oyster-5-mobile.webp"
            alt="oyster-story-5-mobile"
            class="md:hidden block w-10/12 md:w-1/2"
          />
        </div>

        <div class="bg-rolex-brown-light-1">
          <header
            class="flex flex-col gap-8 font-helvetica font-bold justify-around items-center text-rolex-brown h-fit pt-[10vh]"
          >
            <h1 class="text-3xl md:text-5xl w-10/12 md:w-1/2">
              La nueva certificación Superlative Chronometer
            </h1>
            <p
              class="w-10/12 md:w-1/2 text-xl font-helvetica font-light text-justify md:text-left"
            >
              En 2026, Rolex amplía los criterios de su certificación
              Superlative Chronometer: la resistencia al magnetismo, la
              fiabilidad y la durabilidad se unen ahora a la precisión, la
              hermeticidad, la cuerda automática y la autonomía, alcanzando un
              total de siete pilares de excelencia. La constante búsqueda de la
              mejora siempre ha estado en el corazón de Rolex y esta filosofía
              se refleja en cada uno de sus relojes. Una expresión de este
              compromiso de superar constantemente los límites es la búsqueda
              continua de la precisión cronométrica por parte de la marca. Esto
              ha conducido al desarrollo de relojes atómicos ópticos pioneros,
              dando acceso a la manufactura a un nivel de precisión sin
              precedentes. Estas herramientas innovadoras y de vanguardia son
              los nuevos guardianes del tiempo en Rolex, y forman parte de la
              red internacional que establece la Hora Universal Coordinada
              (UTC).
            </p>
          </header>
          <div class="flex justify-center py-[10vh]">
            <img
              src="/assets/routes-assets/oyster/oyster-6.webp"
              alt="oyster-story-6"
              class="hidden md:block w-10/12 md:w-1/2"
            />
            <img
              src="/assets/routes-assets/oyster/oyster-6-mobile.webp"
              alt="oyster-story-6-mobile"
              class="md:hidden block w-10/12 md:w-1/2"
            />
          </div>
        </div>
      </section>
      <!-- ############### -->
    </template>
  </RolexTemplate>
</template>
