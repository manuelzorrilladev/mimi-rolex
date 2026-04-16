<script setup>

import PageBanner from '../../components/banners-components/PageBanner.vue';
import Terms from '../../components/global-components/Terms.vue';
import RolexTemplate from '../Rolex/RolexTemplate.view.vue';


</script>

<template>
    <div id="new-models">
        <RolexTemplate>
            <template #content>

                <PageBanner type="showroom" />
                <Terms/>

            </template>
        </RolexTemplate>

    </div>
</template>
