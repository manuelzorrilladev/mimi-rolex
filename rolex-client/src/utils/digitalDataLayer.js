/**
 * Construye el digitalDataLayer de Rolex
 * utilizando la información de la ruta actual.
 */
export function buildRolexDigitalData(route) {
  const data = {
    environment: {
      environmentVersion: "V7",
      coBrandedVersion: "Bespoke",
    },

    page: {
      pageType: route.meta.pageType,
    },
  };

  /**
   * Páginas de familia.
   *
   * Las rutas estáticas utilizan:
   * meta.pageFamilyName
   */
  if (route.meta.pageFamilyName) {
    console.log(route.meta.pageFamilyName);
    data.page.pageFamilyName = route.meta.pageFamilyName;
  }

  /**
   * Página de nuevos modelos 2026.
   *
   * El ID de la ruta representa la familia.
   */
  if (route.name === "rolex-nuevos-modelos-2026") {
    data.page.pageFamilyName = route.params.id;
  }

  /**
   * Página de modelo Rolex.
   *
   * /rolex/:collectionName-:id
   *
   * collectionName -> pageFamilyName
   * id             -> productRMC
   */
  if (route.name === "relojes-rolex") {
    data.page.pageFamilyName = route.params.collectionName;

    data.products = {
      productRMC: route.params.id,
    };
  }

  return data;
}