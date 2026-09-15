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





 getYearlyStats({ page = 1, limit = 10, entryPage = 1, entryLimit = 10, sortBy = 'totalVisits', year } = {}) {
    const queryYear = year || (new Date().getFullYear());
    const searchQuery = `/admin/metrics/yearly?year=${queryYear}&page=${page}&limit=${limit}&entryPage=${entryPage}&entryLimit=${entryLimit}&sortBy=${sortBy}`;
    
    return http.get(searchQuery, { headers: authHeader() });
}
    getEvents(month, year) {
        const queryMonth = month || (new Date().getMonth())
        const queryYear = year || (new Date().getFullYear())
        const searchQuery = `/admin/metrics/events?year=${queryYear}&month=${queryMonth}`
        return http.get(searchQuery, { headers: authHeader() })
    }





}
export default new ChartMetrics()

