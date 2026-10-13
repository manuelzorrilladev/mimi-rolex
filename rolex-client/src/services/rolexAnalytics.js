import GLOBAL_OBJECT from "../utils/globaj";

const SCRIPT_ID = "rolex-tracking-script";
const TRACK_SCRIPT_URL = GLOBAL_OBJECT.TRACK_SCRIPT_URL;

let launchPromise = null;

/**
 * Comprueba si el usuario ha aceptado
 * las cookies de estadísticas de Rolex.
 *
 * Analytics utiliza únicamente rlx-consent.
 *
 * rlx-marketing es una categoría independiente.
 */
function hasAnalyticsConsent() {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith("rlx-consent="))
    ?.split("=")[1];

  return value === "true";
}

/**
 * Carga Adobe Launch una sola vez.
 *
 * Si Adobe ya existe, reutilizamos la instancia.
 *
 * Si el script ya se está cargando, reutilizamos
 * la misma Promise para evitar múltiples cargas.
 */
function loadAdobeLaunch() {
  if (window._satellite) {
    return Promise.resolve();
  }

  if (launchPromise) {
    return launchPromise;
  }

  launchPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });

      return;
    }

    const script = document.createElement("script");

    script.id = SCRIPT_ID;
    script.src = TRACK_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      launchPromise = null;

      reject(new Error("No se pudo cargar Adobe Launch."));
    };

    document.head.appendChild(script);
  });

  return launchPromise;
}

/**
 * Actualiza el digitalDataLayer antes de enviar
 * el evento pageView.
 */
function updateDigitalDataLayer(data) {
  window.digitalDataLayer = data;
}

/**
 * Envía un pageView a Adobe Launch.
 *
 * No bloquea el renderizado de la SPA porque
 * Adobe Launch se carga de forma asíncrona.
 */
async function pageView(data) {
  if (!hasAnalyticsConsent()) {
    return;
  }

  updateDigitalDataLayer(data);

  try {
    await loadAdobeLaunch();

    if (!window._satellite) {
      return;
    }
    updateDigitalDataLayer(data);

    window._satellite.track("pageView");
  } catch (error) {
    console.error("[Rolex Analytics] Adobe Launch error:", error);
  }
}

/**
 * Envía el pageView después de que el usuario
 * acaba de aceptar Analytics.
 */
async function consentGranted(data) {
  await pageView(data);
}

export default {
  pageView,
  consentGranted,
  loadAdobeLaunch,
  hasAnalyticsConsent,
};