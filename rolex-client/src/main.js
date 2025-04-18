import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import './style.css'
import App from './App.vue'
import router from './router'

import VueLazyLoad from 'vue3-lazyload' 
import {createPinia} from 'pinia'

// Defining pinia
const pinia = createPinia()


/* import router from './router' */


/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faPhone,
    faLocationDot,
    faAngleUp,
    faCircleInfo,
    faArrowRight,
    faChevronLeft,
    faChevronRight,
    faEnvelope,
    faArrowsRotate,
    faLocationArrow,
    faAngleDown,
    faArrowLeft,
    faSquarePlus,
    faSquareMinus,
    faGear,
    faPenToSquare,
    faTrashCan,
    faCircleCheck,
    faCircleXmark,
    faSortDown,
    faSortUp,
    faCartShopping,
    faSpinner,
    faComment,
    faMagnifyingGlass,
    faXmark
} from '@fortawesome/free-solid-svg-icons'

import { faFacebookF, faInstagram, faXTwitter, faWhatsapp, faPinterest } from '@fortawesome/free-brands-svg-icons'


library.add(
    faFacebookF,
    faInstagram,
    faXTwitter,
    faWhatsapp, 
    faPhone,
    faLocationDot,
    faAngleUp,
    faCircleInfo,
    faArrowRight,
    faChevronLeft,
    faChevronRight,
    faEnvelope,
    faArrowsRotate,
    faLocationArrow,
    faAngleDown,
    faArrowLeft, 
    faPinterest,
    faSquarePlus,
    faSquareMinus,
    faGear,
    faPenToSquare,
    faTrashCan,
    faCircleCheck,
    faCircleXmark,
    faSortDown,
    faSortUp,
    faCartShopping,
    faSpinner,
    faComment,
    faMagnifyingGlass,
    faXmark
)

const head = createHead()

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router) 
    .use(pinia)
    .use(head)
    .use(VueLazyLoad)
    .mount('#app')