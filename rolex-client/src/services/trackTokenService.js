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

        this.VISITOR_EXPIRY_DAYS = 30
        this.SESSION_EXPIRY_MINUTES = 30
    }
    checkIfWhiteList(query){
        const whiteListId = query?.disable_track
        if(whiteListId){
            return false
        }
        return true
    }

    sendVisit(sendObject) {
        if(this.checkIfWhiteList()){
            return http.post("/metrics/ingest", sendObject)
        }
        return
    }


    getOrCreateVisitorId() {
        if(this.checkIfWhiteList()){

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




    }

    getOrRefreshSessionId() {
        if(this.checkIfWhiteList()){

            let sessionID = this.cookies.get('_mj_sid')
            let isNew = false
    
            if (!sessionID) {
                sessionID = crypto.randomUUID()
                isNew = true
    
                const expiry = new Date()
                expiry.setMinutes(expiry.getMinutes() + this.SESSION_EXPIRY_MINUTES)
    
                this.cookies.set('_mj_sid', sessionID, {
                    ...this.cookieOptions,
                    expires: expiry
                })
            }
    
    
            return { sessionID, isNew }
        }
        return false
    }

    getTokens() {
        if(this.checkIfWhiteList()){
            const { visitorID } = this.getOrCreateVisitorId()
            const { sessionID, isNew } = this.getOrRefreshSessionId()
            return { visitorID, sessionID, isNew }
        }
        return false
    }
    sendEvent(eventName,label){
        const { sessionID } = this.getOrRefreshSessionId()
        return http.post("/metrics/track-event", {
            sessionToken: sessionID,
            eventName,
            label
        })
    }

}
export default new TrackingTokenService()

