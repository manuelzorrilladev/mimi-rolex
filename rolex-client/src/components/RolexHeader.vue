<script setup>
defineProps({
    color: String
})
</script>

<template>
    <section class="flex justify-center" :class="color">
        <header
            class="flex flex-col md:flex-row   font-bold justify-center items-center md:items-start  text-rolex-brown h-fit py-20  md:w-10/12"
            >
            <div class="w-10/12 md:w-1/2 font-helvetica ">
                <p class="text-xl">
                    <slot name="sub">

                    </slot>
                </p>
                <h1 class="text-3xl md:text-4xl font-helvetica">
                    <slot name="title">

                    </slot>

                </h1>
            </div>
            <p class="w-10/12 text-lg  md:w-1/2 text-justify  md:text-left font-normal text-black/80 ">
                <slot name="text">

                </slot>


            </p>
        </header>
    </section>
</template>
