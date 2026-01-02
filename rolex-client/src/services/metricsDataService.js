import http from '../http-commons'
import authHeader from './auth/authHeader'
class ChartMetrics {
   
    getSummary(){
        return http.get('/admin/metrics/summary',{headers:authHeader()})
    }

    getEvents(){
        return http.get('/admin/metrics/events',{headers:authHeader()})
    }




}
export default new ChartMetrics()

