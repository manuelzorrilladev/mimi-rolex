import http from '../http-commons'
import authHeader from './auth/authHeader'
class ChartMetrics {
   
    getSummary(month, year){
        const queryMonth = month || (new Date().getMonth())
        const queryYear = year || (new Date().getFullYear())
        const searchQuery = `/admin/metrics/summary?year=${queryYear}&month=${queryMonth}`
        console.log(searchQuery)
        return http.get(searchQuery,{headers:authHeader()})
    }

    getYearlyCampaing(){
        return http.get('/admin/metrics/yearly',{headers:authHeader()})
    }
    getEvents(){
        return http.get('/admin/metrics/events',{headers:authHeader()})
    }




}
export default new ChartMetrics()

