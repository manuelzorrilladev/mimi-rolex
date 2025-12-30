import { useCookies } from "@vueuse/integrations/useCookies";
import http from '../http-commons'
import authHeader from "./auth/authHeader";

class TrackingTokenService {
    constructor() {
        this.cookies = useCookies(['_mj_vid', '_mj_sid'])

        this.cookieOptions = {
            path: '/',
            sameSite: 'lax',
            secure: window.location.protocol === 'https:'
        }

        this.VISITOR_EXPIRY_DAYS = 730
        this.SESSION_EXPIRY_MINUTES = 30
    }


    sendVisit(sendObject) {

        return http.post("/metrics/ingest", sendObject)
    }


    getOrCreateVisitorId() {
        let visitorID = this.cookies.get('_mj_vid')

        if (!visitorID) {
            visitorID = crypto.randomUUID()
            const expiry = new Date()
            expiry.setDate(expiry.getDate() + this.VISITOR_EXPIRY_DAYS)

            this.cookies.set('_mj_vid', visitorID, {
                ...this.cookieOptions,
                expires: expiry
            })


        }


        return { visitorID }


    }

    getOrRefreshSessionId() {
        let sessionID = this.cookies.get('_mj_sid')
        let isNew = false

        if (!sessionID) {
            sessionID = crypto.randomUUID()
            isNew = true
        }


        const expiry = new Date()
        expiry.setDate(expiry.getDate() + this.SESSION_EXPIRY_MINUTES)
        // expiry.setMinutes(expiry.getMinutes() + this.SESSION_EXPIRY_MINUTES)

        this.cookies.set('_mj_sid', sessionID, {
            ...this.cookieOptions,
            expires: expiry
        })


        return { sessionID, isNew }

    }

    getTokens() {
        const { visitorID } = this.getOrCreateVisitorId()
        const { sessionID, isNew } = this.getOrRefreshSessionId()
        return { visitorID, sessionID, isNew }
    }

}
export default new TrackingTokenService()

// function getLocation() {
//   console.log("===");

//   axios
//     .get("https://ipinfo.io/json?token=4ee0a261f56090")
//     .then(function (response) {
//       // handle success
//       locationCountry.value = response.data.country;
//       locationCity.value = response.data.city;
//     })
//     .catch(function (error) {
//       // handle error
//       location.value.country = "Desconocido";
//       location.value.city = "Desconocido";
//     });
// }
