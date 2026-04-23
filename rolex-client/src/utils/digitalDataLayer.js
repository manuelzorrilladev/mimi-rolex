

function digitalDataLayer(family,rmc, pageType = 'model page'){
    var layer = {
        environment: {
            environmentVersion: "V7",
            coBrandedVersion: "Bespoke",
        },
        page: {
            pageType: pageType,
            pageFamilyName:family
        },
        products:{
            productRMC:rmc
        }
    };
    return layer
}

export default digitalDataLayer