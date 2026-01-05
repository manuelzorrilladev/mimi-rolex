import http from '../http-commons'
import authHeader from './auth/authHeader'
class ChartMetrics {
   
    getSummary(month, year){
        const queryMonth = month || (new Date().getMonth()+1)
        const queryYear = year || (new Date().getFullYear())
        return http.get(`/admin/metrics/summary?year=${queryYear}&month=${queryMonth}`,{headers:authHeader()})
    }

    getEvents(){
        return http.get('/admin/metrics/events',{headers:authHeader()})
    }




}
export default new ChartMetrics()

