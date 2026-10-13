import { useCookies } from "@vueuse/integrations/useCookies.mjs";
import {
  createRouter,
  createWebHistory,
  START_LOCATION
} from "vue-router";

import trackTokenService from "../services/trackTokenService.js";
import rolexAnalytics from "../services/rolexAnalytics.js";
import { buildRolexDigitalData } from "../utils/digitalDataLayer.js";

import { auth } from "../store/auth.module.js";
import { useLoaderStore } from "../store/loaderState.js";
import { useLocationStore } from "../store/locationState.js";

import routesArray from "./route-object.js";

const cookies = useCookies("_mj_sid");

const router = createRouter({
  history: createWebHistory(),
  routes: routesArray,

  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from, next) => {
  const store = useLoaderStore();

  const link = "https://mimijoyeria.com";
  const description = to.meta.description;

  let canonical = document.querySelector(
    "link[rel='canonical']"
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute(
    "href",
    `${link}${to.fullPath}`
  );

  if (to.name !== from.name) {
    store.change();
  }

  const pageType = to.meta.pageType;

  if (pageType) {
    document.pageType = pageType;
  }

  const pageFamily = to.meta.pageFamily;

  if (pageFamily) {
    document.pageFamily = pageFamily;
  }

  const title = to.meta.title;
  const titleFromParams = to.params.id;

  document.description = description || "";

  if (title) {
    document.title = title;
  }

  if (titleFromParams) {
    const parsedTitleFromParams =
      titleFromParams.charAt(0).toUpperCase() +
      titleFromParams.slice(1);

    document.title =
      `${parsedTitleFromParams.replaceAll("-", " ")} - ${title}`;
  }

  const authStore = auth();

  if (
    !cookies.get("_mj_sid") &&
    authStore.$state.status.loggedIn
  ) {
    authStore.logout();
  }

  next();
});


router.afterEach(async (to, from) => {

  const store = useLoaderStore();

  if (to.name !== from.name) {
    store.change();
  }

  /**
   * -------------------------------------------------------
   * ROLEX ANALYTICS
   * -------------------------------------------------------
   */

  if (to.path.startsWith("/rolex")) {
    const digitalData = buildRolexDigitalData(to);
    window.digitalDataLayer = digitalData;
    await rolexAnalytics.pageView(digitalData)
  }


  /**
   * -------------------------------------------------------
   * EVITAR MÉTRICAS DUPLICADAS
   * -------------------------------------------------------
   */
  const mainOrigin = window.origin

  const isInitialNavigation =
    from === START_LOCATION;

  const isSameRoute =
    to.path === from.path &&
    Object.keys(to.query).length === 0;

  if (!isInitialNavigation && isSameRoute) {
    console.log(
      "Ruta duplicada detectada, no se enviarán métricas."
    );

    return;
  }


  /**
   * -------------------------------------------------------
   * DASHBOARD
   * -------------------------------------------------------
   */

  if (to.path.includes("dashboard")) {
    return;
  }


  /**
   * -------------------------------------------------------
   * MÉTRICAS PROPIAS
   * -------------------------------------------------------
   */

  const locationStorage =
    useLocationStore();

  const {
    visitorID,
    sessionID,
    isNew
  } = trackTokenService.getTokens();

  if (
    trackTokenService.checkIfWhiteList(
      to.query
    )
  ) {

    if (isNew) {
      locationStorage.setToInitial();

      await locationStorage
        .getLocation()
        .catch((e) =>
          console.error(
            "Error obteniendo ubicación:",
            e
          )
        );
    }

    const objectToSendToMetrics = {
      visitorToken: visitorID,
      sessionToken: sessionID,
      path: to.path,
      title: document.title || "Sin título",
      referrer:
        document.referrer || "direct",
      utm_source:
        to.query["utm_source"],
      utm_medium:
        to.query["utm_medium"],
      utm_campaign:
        to.query["utm_campaign"],
      gclid:
        to.query["gclid"],
      country:
        locationStorage.country,
      city:
        locationStorage.city
    };

    if (
      objectToSendToMetrics.referrer
        .includes("google.com")
    ) {
      objectToSendToMetrics.utm_source =
        "google";

      objectToSendToMetrics.utm_medium =
        "organic";
    }

    for (
      const [key, value]
      of Object.entries(
        objectToSendToMetrics
      )
    ) {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        objectToSendToMetrics[key] =
          "none";
      }
    }
    if (!mainOrigin.includes("localhost")) {

      trackTokenService
        .sendVisit(objectToSendToMetrics)
        .then(() => {
          console.log(
            "Visita guardada con éxito"
          );
        })
        .catch((e) => {
          console.error(
            "Error al guardar visita:",
            e
          );
        });
    }

  }
});

export default router;