<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {


  const script = document.createElement("script");
  script.src = "https://cornersv7.rolex.com/retailer.js?apikey=7513b85ede328a319698cf7a3eebed49&callback=rlxCornerCallback";
  script.async = true;
  script.defer = true;


  
  window.rlxCornerCallback = (Corner) => {
    window.rlxCornerCallback = null;
    const corner = new Corner({
      as: "standalone",
      lang: "es",
      consent: false,
      legal: "https://mimijoyeria.com/rolex/terminos-y-condiciones",
      destination: "new-watches-2026",
    });
    
    corner.mount("#rlxCorner");
  };

  
  
  document.head.appendChild(script);
});

onUnmounted(() => {
  delete window.rlxCornerCallback;
  const script = document.querySelector('script[src*="cornersv7.rolex.com"]');
  if (script) {
    script.remove();
  }
});
</script>


<template>
  <div id="rlxCorner"></div>
</template>




<style scoped>

#rlxCorner {
  min-height: 500px;
  width: 100%;
}
</style>