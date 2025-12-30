import http from '../http-commons'
import authHeader from './auth/authHeader'
class ChartMetrics {
   
    getSummary(){
        return http.get('/admin/metrics/summary',{headers:authHeader()})
    }

    getChart(){
        return http.get('/admin/metrics/chart',{headers:authHeader()})
    }


}
export default new ChartMetrics()

