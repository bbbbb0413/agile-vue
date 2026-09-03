import { defineStore } from 'pinia'
import { ref } from 'vue'
import { courseApi } from '@/api/course.js'
import {
  ALL_CATEGORY,
  CATEGORY_FILTERS,
  CATEGORY_LABEL_MAP,
  getCategoryEmoji,
  getCategoryLabel,
} from '@/constants/categories.js'
// 백엔드 강의 API 연동 전, 카테고리별로 화면을 미리 채워보기 위한 임시 목업 데이터.
// 실제 API가 강의를 반환하기 시작하면 이 데이터는 자동으로 사용되지 않는다.
const MOCK_COURSES = [
  { id: 90001, category: '건강', title: '요가 · 스트레칭', instructorName: '정유연 강사', enrollmentCount: 128 },
  { id: 90002, category: '건강', title: '건강 체조 교실', instructorName: '김근력 강사', enrollmentCount: 94 },
  { id: 90003, category: '예술', title: '서예 교실', instructorName: '이서예 강사', enrollmentCount: 215 },
  { id: 90004, category: '예술', title: '수채화 그리기', instructorName: '박수채 강사', enrollmentCount: 67 },
  { id: 90005, category: '음악', title: '노래교실', instructorName: '최고운 강사', enrollmentCount: 152 },
  { id: 90006, category: '음악', title: '오카리나 배우기', instructorName: '한소리 강사', enrollmentCount: 58 },
  { id: 90007, category: '여가', title: '텃밭 가꾸기', instructorName: '한농부 강사', enrollmentCount: 203 },
  { id: 90008, category: '여가', title: '사진 산책 동호회', instructorName: '윤찰칵 강사', enrollmentCount: 45, emoji: '🍀' },
  { id: 90009, category: '생활', title: '집밥 요리교실', instructorName: '조맛나 강사', enrollmentCount: 176 },
  { id: 90010, category: '생활', title: '반려식물 돌보기', instructorName: '임초록 강사', enrollmentCount: 61 },
  { id: 90011, category: '디지털', title: '스마트폰 활용법', instructorName: '김디지털 강사', enrollmentCount: 312 },
  { id: 90012, category: '디지털', title: '키오스크 주문 실습', instructorName: '오터치 강사', enrollmentCount: 99 },
  { id: 90013, category: '기타', title: '웃음치료 교실', instructorName: '배웃음 강사', enrollmentCount: 88 },
  { id: 90014, category: '기타', title: '시니어 모델 워킹', instructorName: '강워킹 강사', enrollmentCount: 41 },
]

export const useCourseStore = defineStore('course', () => {
  const courses = ref([])
  const selectedCourse = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const selectedCategory = ref(ALL_CATEGORY)

  const categories = CATEGORY_FILTERS

  // 백엔드 카테고리 enum → 프론트 표시용 라벨
  const categoryLabelMap = CATEGORY_LABEL_MAP

  function normalizeCategory(category) {
    return getCategoryLabel(category)
  }

  function normalizeCourse(course) {
    if (!course || typeof course !== 'object') return course

    return {
      ...course,
      category: normalizeCategory(course.category)
    }
  }

  // 카테고리별 대표 이모지를 썸네일로 사용한다.
  function getThumbnail(course) {
    return getCategoryEmoji(course?.category)
  }

  async function fetchCourses() {
    loading.value = true
    error.value = null

    try {
      const res = await courseApi.getAll()
      console.log('[CourseStore] fetchCourses response =', res.data)

      const rawCourses = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : []

      // 백엔드가 아직 강의 데이터를 안 주면(빈 배열) 임시로 목업 데이터를 보여준다.
      courses.value = rawCourses.length
        ? rawCourses.map(normalizeCourse)
        : MOCK_COURSES

      console.log('[CourseStore] normalized courses =', courses.value)
    } catch (e) {
      console.error('[CourseStore] fetchCourses failed:', e)
      // API 호출 자체가 실패해도(서버 미기동 등) 화면은 목업으로 채워둔다.
      courses.value = MOCK_COURSES
    } finally {
      loading.value = false
    }
  }

  async function fetchCourse(id) {
    loading.value = true
    error.value = null

    try {
      const res = await courseApi.getById(id)
      console.log('[CourseStore] fetchCourse response =', res.data)

      const rawCourse =
        res.data?.data && typeof res.data.data === 'object'
          ? res.data.data
          : res.data

      selectedCourse.value = normalizeCourse(rawCourse)

      console.log('[CourseStore] normalized selectedCourse =', selectedCourse.value)
    } catch (e) {
      console.error('[CourseStore] fetchCourse failed:', e)
      error.value = e.message || '강의 정보를 불러오지 못했습니다.'
      selectedCourse.value = null
    } finally {
      loading.value = false
    }
  }

  function setCategory(cat) {
    selectedCategory.value = cat
  }

  return {
    courses,
    selectedCourse,
    loading,
    error,
    categories,
    selectedCategory,
    categoryLabelMap,
    normalizeCategory,
    normalizeCourse,
    getThumbnail,
    fetchCourses,
    fetchCourse,
    setCategory
  }
})
