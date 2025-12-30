<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { auth } from '../../store/auth.module';


const piniaStore = auth()
const userInfo = storeToRefs(piniaStore)

const isAdmin = computed(() => {
    return userInfo.user.value.roles[0] === 'ROLE_ADMIN'
})


if (isAdmin.value == false) {
    window.location.href = '/';
}





</script>

<template>
    <section class="bg-[url(/assets/routes-assets/admin-bg.webp)] bg-cover ">
        <div class="fixed w-full h-screen bg-neutral-600/50 top-0 blur-2xl"></div>
        
        <main class="flex ">
    
    
            <Router-view />
        </main>

    </section>

</template>

<style scoped></style>
