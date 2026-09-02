import api from './index.js'

export const reportApi = {
  getHealthReport(courseId) {
    return api.get(`/api/recommend/health-report/${courseId}`, {
      timeout: 60000
    })
  }
}
