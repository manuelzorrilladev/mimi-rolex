import axios from 'axios'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'


export const useLocationStore = defineStore('location', {
    state: () => ({
        city: useStorage("mj_city", ""),
        country: useStorage("mj_country", ""),
        isInitialized: useStorage("mj_is_initialized", false)
    }),

    actions: {
        async getLocation() {
            if (this.isInitialized) {
                return
            }
            const ipResponse = await axios.get("https://ipinfo.io/json?token=4ee0a261f56090")
            this.city = ipResponse.data.city;
            this.country = ipResponse.data.country;
            this.isInitialized = true
        },
        setToInitial() {
            this.city, this.country = ""
            this.isInitialized = false
        }



    },
})