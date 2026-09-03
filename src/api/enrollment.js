import api from './index.js'

export const enrollmentApi = {
  getMyEnrollments() {
    return api.get('/api/enrollments/my')
  },
  enroll(courseId) {
    return api.post('/api/enrollments', { courseId })
  },
  cancel(enrollmentId) {
    return api.delete(`/api/enrollments/${enrollmentId}`)
  },
  updateNote(enrollmentId, note) {
    return api.post(`/api/enrollments/${enrollmentId}/note`, { note })
  },
  getFavorites() {
    return api.get('/api/enrollments/favorites')
  },
  addFavorite(courseId) {
    return api.post(`/api/enrollments/favorites/${courseId}`)
  },
  deleteFavorite(courseId) {
    return api.delete(`/api/enrollments/favorites/${courseId}`)
  },
  getRecommendations(userId) {
    return api.get(`/api/recommend/${userId}`)
  },

  /* 강사 전용 - X-User-Id 헤더는 Gateway가 주입한다 */
  getInstructorCourses() {
    return api.get('/api/enrollments/instructor/courses')
  },
  getCourseStudents(courseId) {
    return api.get(`/api/enrollments/instructor/courses/${courseId}/students`)
  },
  getStudentDetail(courseId, studentId) {
    return api.get(`/api/enrollments/instructor/courses/${courseId}/students/${studentId}`)
  }
}
