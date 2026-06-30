<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Propiedades configurables para reutilizar el componente
const props = defineProps({
  duration: {
    type: Number,
    default: 4000 // Duración en milisegundos (4 segundos)
  }
})

const visible = ref(false)
let timer = null

onMounted(() => {
  // Se activa la aparición al montar el componente
  visible.value = true

  // Programamos el cierre automático basado en la duración
  timer = setTimeout(() => {
    visible.value = false
  }, props.duration)
})

onUnmounted(() => {
  // Limpieza del timer para evitar memory leaks
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition name="toast-drop">
    <div 
      v-if="visible" 
      class="fixed top-0 right-0 -translate-x-1/2 w-full max-w-sm md:w-1/5 mt-3 rounded-lg text-white bg-rolex-green z-9999 overflow-hidden shadow-lg border border-white"
    >
      <h2 class="p-4 text-center font-helvetica">
        <slot></slot>
      </h2>
      <span 
        class="progress-bar h-1 block bg-rolex-brown"
        :style="{ '--duration': props.duration + 'ms' }"
      ></span>
    </div>
  </Transition>
</template>

<style scoped>
/* --- Animaciones de Transición de Vue 3 (Caída y Subida) --- */

/* Estado inicial antes de entrar y estado final al salir */
.toast-drop-enter-from,
.toast-drop-leave-to {
  transform: translateY(-150%);
  opacity: 0;
}

/* Estado activo durante la entrada y la salida */
.toast-drop-enter-active,
.toast-drop-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Efecto rebote sutil */
}

/* Estado final al entrar y inicial al salir */
.toast-drop-enter-to,
.toast-drop-leave-from {
  transform: translateY( 0);
  opacity: 1;
}

/* --- Animación de la Barra de Progreso --- */
.progress-bar {
  width: 100%;
  transform-origin: left;
  animation: shrink var(--duration) linear forwards;
}

@keyframes shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>

