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
  getInstructorCourses() {
    return api.get('/api/enrollments/instructor/courses')
  },
  getCourseStudents(courseId) {
    return api.get(`/api/enrollments/instructor/courses/${courseId}/students`)
  },
  getStudentDetail(courseId, studentId) {
    return api.get(`/api/enrollments/instructor/courses/${courseId}/students/${studentId}`)
  },
  getRecommendations(userId) {
    return api.get(`/api/recommend/${userId}`)
  }
}
