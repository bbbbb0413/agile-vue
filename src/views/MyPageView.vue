<template>
  <div class="page-wrapper">
    <AppHeader />
    <div class="page-layout">
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-label">메뉴</div>

          <router-link to="/courses" class="sidebar-item">
            <span class="si-icon">📚</span> 강의 목록
          </router-link>

          <router-link
            v-if="!isInstructor"
            to="/enrollments"
            class="sidebar-item"
          >
            <span class="si-icon">✅</span> 내 수강 목록
          </router-link>

          <router-link to="/mypage" class="sidebar-item active">
            <span class="si-icon">⭐</span> 마이페이지
          </router-link>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-label">계정</div>
          <button class="sidebar-item sidebar-btn" @click="handleLogout">
            <span class="si-icon">🚪</span> 로그아웃
          </button>
        </div>
      </aside>

      <main class="main-content">
        <!-- 프로필 카드 -->
        <div class="profile-card fade-in-up">
          <div class="profile-avatar">{{ auth.user?.name?.charAt(0) || '?' }}</div>
          <div class="profile-info">
            <h2 class="profile-name">{{ auth.user?.name || '사용자' }}</h2>
            <p class="profile-email">{{ auth.user?.email || '-' }}</p>
            <span class="badge" :class="isInstructor ? 'badge-amber' : 'badge-blue'">
              {{ isInstructor ? '강사' : '학생' }}
            </span>
          </div>
        </div>

        <!-- 학생 화면 -->
        <section v-if="!isInstructor" class="recommend-section">
          <section class="favorite-section">
            <div class="section-head">
              <h3 class="section-title">찜한 강의</h3>
              <span class="section-subtitle">관심 있는 강의를 모아두었습니다.</span>
            </div>

            <div v-if="favoriteLoading" class="loading-row">
              <div v-for="i in 3" :key="i" class="skeleton-card">
                <div class="skeleton-thumb"></div>
                <div class="skeleton-body">
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line"></div>
                </div>
              </div>
            </div>

            <div v-else-if="favorites.length" class="recommend-grid fade-in">
              <CourseCard
                v-for="favorite in favorites"
                :key="favorite.id"
                :course="favorite.course || favorite"
              />
            </div>

            <p v-else-if="favoriteError" class="empty-text">{{ favoriteError }}</p>
            <p v-else class="empty-text">아직 찜한 강의가 없습니다.</p>
          </section>

          <h3 class="section-title">추천 강의</h3>

          <p v-if="recommendMessage" class="recommend-message">
            {{ recommendMessage }}
          </p>

          <div v-if="recommendLoading" class="loading-row">
            <div v-for="i in 3" :key="i" class="skeleton-card">
              <div class="skeleton-thumb"></div>
              <div class="skeleton-body">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line"></div>
              </div>
            </div>
          </div>

          <div v-else-if="recommendations.length" class="recommend-grid fade-in">
            <CourseCard v-for="c in recommendations" :key="c.id" :course="c" />
          </div>

          <p v-else-if="recommendError" class="empty-text">
            {{ recommendError }}
          </p>

          <p v-else class="empty-text">
            아직 추천할 강의가 없습니다.
          </p>
        </section>

        <!-- 요양사 화면 -->
        <section v-else class="instructor-section">
          <div class="section-head">
            <h3 class="section-title">내가 담당하는 프로그램</h3>
            <span class="section-subtitle">프로그램을 선택하면 참여 회원 종합 리포트를 확인할 수 있습니다.</span>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="summary-label">담당 프로그램 수</div>
              <div class="summary-value">{{ displayedCourses.length }}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">총 참여 회원 수</div>
              <div class="summary-value">{{ totalEnrollmentCount }}</div>
            </div>
          </div>

          <div v-if="instructorLoading" class="loading-row instructor-loading">
            <div v-for="i in 3" :key="i" class="skeleton-card">
              <div class="skeleton-thumb"></div>
              <div class="skeleton-body">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line"></div>
              </div>
            </div>
          </div>

          <div v-else-if="displayedCourses.length" class="instructor-course-list fade-in">
            <article
              v-for="course in displayedCourses"
              :key="course.id"
              class="instructor-course-card"
            >
              <div class="course-card-top">
                <div>
                  <h4 class="course-title">{{ course.title }}</h4>
                  <p class="course-desc">{{ course.description || '설명이 없습니다.' }}</p>
                </div>
                <span
                  class="status-badge"
                  :class="course.status === 'ACTIVE' ? 'status-active' : 'status-inactive'"
                >
                  {{ course.status || 'UNKNOWN' }}
                </span>
              </div>

              <div class="course-meta-grid">
                <div class="meta-box">
                  <div class="meta-label">카테고리</div>
                  <div class="meta-value">{{ course.category || '-' }}</div>
                </div>
                <div class="meta-box">
                  <div class="meta-label">참여 회원 수</div>
                  <div class="meta-value">
                    {{ course.enrollment_count ?? course.enrollmentCount ?? 0 }}명
                  </div>
                </div>
                <div class="meta-box">
                  <div class="meta-label">프로그램 ID</div>
                  <div class="meta-value">#{{ course.id }}</div>
                </div>
              </div>

              <div class="course-card-actions">
                <button
                  type="button"
                  class="report-link-label"
                  @click="openMembersModal(course)"
                >참여 어르신 보기 →</button>
              </div>
            </article>
          </div>

          <p v-else-if="instructorError" class="empty-text">
            {{ instructorError }}
          </p>

          <p v-else class="empty-text">
            아직 담당하는 프로그램이 없습니다.
          </p>
        </section>
      </main>
    </div>

    <CourseMembersModal
      v-if="selectedCourse"
      :course="selectedCourse"
      @close="closeMembersModal"
      @select-member="openSeniorModal"
      @show-report="openReportModal"
    />

    <SeniorDetailModal
      v-if="selectedSenior"
      :senior="selectedSenior"
      :loading="seniorLoading"
      :load-error="seniorError"
      @close="closeSeniorModal"
    />

    <CareReportModal
      v-if="reportCourse"
      :course="reportCourse"
      @close="closeReportModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import CourseCard from '@/components/CourseCard.vue'
import CourseMembersModal from '@/components/CourseMembersModal.vue'
import SeniorDetailModal from '@/components/SeniorDetailModal.vue'
import CareReportModal from '@/components/CareReportModal.vue'
import { useAuthStore } from '@/store/auth.js'
import { enrollmentApi } from '@/api/enrollment.js'
import { courseApi } from '@/api/course.js'
import { normalizeStudent } from '@/utils/student.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const isInstructor = computed(() => auth.user?.role === 'INSTRUCTOR')

/* 학생용 */
const recommendations = ref([])
const recommendLoading = ref(true)
const recommendError = ref('')
const recommendMessage = ref('')
const favorites = ref([])
const favoriteLoading = ref(true)
const favoriteError = ref('')

/* 강사용 */
const myCourses = ref([])
const instructorLoading = ref(true)
const instructorError = ref('')
const selectedCourse = ref(null)
const selectedSenior = ref(null)
const reportCourse = ref(null)
const seniorLoading = ref(false)
const seniorError = ref('')

const mockReportCourse = Object.freeze({
  id: 999999,
  title: '[테스트] 요가·스트레칭',
  description: '어르신 대상 저강도 프로그램 UI 테스트 데이터입니다.',
  category: 'OTHER',
  price: 0,
  enrollmentCount: 3,
  status: 'ACTIVE',
  members: [
    {
      id: 101,
      name: '김봄',
      email: 'spring101@example.com',
      enrollmentStatus: 'ACTIVE',
      note: '무릎이 조금 불편하고 고혈압이 있어 오래 서 있는 동작은 피하고 싶습니다.'
    },
    {
      id: 102,
      name: '이새롬',
      email: 'saerom102@example.com',
      enrollmentStatus: 'ACTIVE',
      note: '몸 상태가 양호하고 오늘은 활기찬 기분이며, 가벼운 근력 운동 참여를 희망합니다.'
    },
    {
      id: 103,
      name: '박다정',
      email: 'dajeong103@example.com',
      enrollmentStatus: 'PENDING',
      note: '조금 피곤하고 허리 통증과 관절염이 있어 낮은 강도의 활동을 희망합니다.'
    }
  ],
  healthReport: {
    courseId: 999999,
    courseTitle: '[테스트] 요가·스트레칭',
    generatedAt: '2026-09-02T09:06:28.365122Z',
    totalEnrolledStudents: 3,
    studentsWithNotes: 3,
    studentSummaries: [
      {
        userId: 101,
        riskLevel: 'MEDIUM',
        summary: '무릎이 조금 불편하고 고혈압이 있어 오래 서 있는 동작은 피하는 것이 좋습니다.'
      },
      {
        userId: 102,
        riskLevel: 'LOW',
        summary: '몸 상태가 양호하고 가벼운 근력 운동 참여를 희망합니다.'
      },
      {
        userId: 103,
        riskLevel: 'HIGH',
        summary: '허리 통증과 관절염이 있어 낮은 강도의 활동으로 조정이 필요합니다.'
      }
    ],
    overallOpinion: '허리와 무릎에 불편함이 있는 참여자가 있으므로 서 있는 동작과 허리에 부담이 되는 자세는 줄이고, 의자를 활용한 저강도 스트레칭 중심으로 진행하는 것이 좋습니다.',
    disclaimer: '본 리포트는 참여자가 직접 작성한 메모를 AI가 요약한 참고 자료이며, 의학적 진단이나 처방이 아닙니다. 실제 조치가 필요한 경우 반드시 참여자 본인 및 필요 시 보건 전문가와 직접 확인하시기 바랍니다.',
    model: 'gpt-4o-mini'
  }
})

const showMockReportCourse = computed(() =>
  import.meta.env.DEV && route.query.mockCareReport === '1'
)

const displayedCourses = computed(() =>
  showMockReportCourse.value
    ? [...myCourses.value, mockReportCourse]
    : myCourses.value
)

const totalEnrollmentCount = computed(() =>
  displayedCourses.value.reduce((sum, course) => {
    const count = Number(course.enrollment_count ?? course.enrollmentCount ?? 0)
    return sum + (Number.isNaN(count) ? 0 : count)
  }, 0)
)

function handleLogout() {
  auth.logout()
  router.push('/')
}

function openMembersModal(course) {
  selectedCourse.value = course
}

function closeMembersModal() {
  selectedCourse.value = null
  selectedSenior.value = null
  reportCourse.value = null
}

async function openSeniorModal(member) {
  // 목록 응답에는 note가 없어 상세 API로 보강한다.
  selectedSenior.value = member
  seniorError.value = ''

  if (member.note !== undefined) return

  const courseId = selectedCourse.value?.id
  if (!courseId || member.userId == null) return

  seniorLoading.value = true

  try {
    const res = await enrollmentApi.getStudentDetail(courseId, member.userId)
    const detail = res.data?.data ?? res.data
    selectedSenior.value = { ...member, ...normalizeStudent(detail) }
  } catch (error) {
    seniorError.value = error?.response?.data?.message || '추가정보를 불러오지 못했습니다.'
  } finally {
    seniorLoading.value = false
  }
}

function closeSeniorModal() {
  selectedSenior.value = null
  seniorError.value = ''
}

function openReportModal() {
  reportCourse.value = selectedCourse.value
}

function closeReportModal() {
  reportCourse.value = null
}

function formatPrice(price) {
  const value = Number(price ?? 0)
  if (Number.isNaN(value)) return '-'
  return `${value.toLocaleString()}원`
}

/**
 * course 객체에서 강사 식별자 추출
 */
function getCourseInstructorId(course) {
  return (
    course.instructorId ??
    course.instructor_id ??
    course.instructor ??
    course.teacherId ??
    course.teacher_id ??
    null
  )
}

async function loadStudentRecommendations() {
  try {
    if (!auth.user) {
      console.warn('[MyPage] auth.user is missing')
      recommendError.value = '추천 강의를 준비 중입니다.'
      return
    }

    if (!auth.user.id) {
      console.warn('[MyPage] auth.user.id is missing:', auth.user)
      recommendError.value = '추천 강의를 준비 중입니다.'
      return
    }

    const res = await enrollmentApi.getRecommendations(auth.user.id)
    console.log('[MyPage] recommendation response:', res.data)

    const payload = res.data

    if (Array.isArray(payload?.recommendedCourses)) {
      recommendations.value = payload.recommendedCourses
      recommendMessage.value = payload.message ?? ''
    } else if (Array.isArray(payload?.data)) {
      recommendations.value = payload.data
      recommendMessage.value = payload.message ?? ''
    } else if (Array.isArray(payload)) {
      recommendations.value = payload
      recommendMessage.value = ''
    } else {
      console.warn('[MyPage] unexpected recommendation response shape:', payload)
      recommendations.value = []
      recommendMessage.value = ''
    }
  } catch (error) {
    console.error('[MyPage] failed to load recommendations:', error)
    recommendError.value = '현재 추천 강의를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    recommendLoading.value = false
  }
}

async function loadFavorites() {
  try {
    const res = await enrollmentApi.getFavorites()
    const payload = res.data

    favorites.value = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : []
  } catch (error) {
    console.error('[MyPage] failed to load favorites:', error)
    favoriteError.value = '찜한 강의를 불러오지 못했습니다.'
  } finally {
    favoriteLoading.value = false
  }
}

async function loadInstructorCourses() {
  try {
    if (!auth.user) {
      console.warn('[MyPage] instructor auth.user is missing')
      instructorError.value = '강좌 정보를 불러오지 못했습니다.'
      return
    }

    if (!auth.user.id) {
      console.warn('[MyPage] instructor auth.user.id is missing:', auth.user)
      instructorError.value = '강좌 정보를 불러오지 못했습니다.'
      return
    }

    const res = await courseApi.getCourses()
    console.log('[MyPage] course list response:', res.data)

    let courses = []

    if (Array.isArray(res.data?.data)) {
      courses = res.data.data
    } else if (Array.isArray(res.data)) {
      courses = res.data
    } else {
      console.warn('[MyPage] unexpected course response shape:', res.data)
    }

    console.log('[MyPage] auth.user =', auth.user)
    console.log('[MyPage] courses =', courses)
    console.log('[MyPage] first course =', courses[0])

    courses.forEach(course => {
      console.log('[MyPage] instructor fields check:', {
        courseId: course.id,
        instructorId: course.instructorId,
        instructor_id: course.instructor_id,
        instructor: course.instructor,
        teacherId: course.teacherId,
        teacher_id: course.teacher_id,
        rawCourse: course
      })
    })

    const instructorId = Number(auth.user.id)

    myCourses.value = courses.filter(course => {
      const courseInstructorId = Number(getCourseInstructorId(course))
      return !Number.isNaN(courseInstructorId) && courseInstructorId === instructorId
    })

    console.log('[MyPage] filtered myCourses =', myCourses.value)
  } catch (error) {
    console.error('[MyPage] failed to load instructor courses:', error)
    instructorError.value = '현재 강좌 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    instructorLoading.value = false
  }
}

onMounted(async () => {
  if (isInstructor.value) {
    recommendLoading.value = false
    await loadInstructorCourses()
  } else {
    instructorLoading.value = false
    await Promise.all([loadStudentRecommendations(), loadFavorites()])
  }
})
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.page-layout {
  max-width: 1320px;
  margin: 0 auto;
  padding: 32px 12px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.sidebar-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  padding: 8px 12px 4px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--radius-md);
  font-size: 16px;
  color: var(--color-text-secondary);
  transition: var(--transition);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-sans);
  text-decoration: none;
}

.sidebar-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.sidebar-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
}

.si-icon {
  font-size: 17px;
}

.main-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-sm);
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
}

.profile-email {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-blue {
  background: #e8f1ff;
  color: #2563eb;
}

.badge-amber {
  background: #f7edd8;
  color: #9a6700;
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
}

.section-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
}

.recommend-message {
  margin-bottom: 14px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.loading-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.instructor-loading {
  margin-bottom: 20px;
}

.skeleton-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.skeleton-thumb {
  height: 110px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line.short {
  width: 40%;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, 220px));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  box-shadow: var(--shadow-sm);
}

.summary-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.instructor-course-list {
  display: grid;
  gap: 18px;
}

.instructor-course-card {
  display: block;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 22px;
  box-shadow: var(--shadow-sm);
}

.course-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.course-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.course-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  white-space: pre-line;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #eaf8ef;
  color: #0f8a3b;
}

.status-inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.course-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.meta-box {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: 14px;
}

.meta-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.meta-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.course-card-actions {
  display: flex;
  justify-content: flex-end;
}

.report-link-label {
  padding: 0;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.report-link-label:hover {
  text-decoration: underline;
}

.report-link-label:focus-visible {
  border-radius: 3px;
  outline: 3px solid var(--color-primary-light);
  outline-offset: 3px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: var(--radius-md);
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  transition: var(--transition);
}

.action-primary {
  background: var(--color-primary);
  color: white;
}

.action-primary:hover {
  opacity: 0.92;
}

.empty-text {
  color: var(--color-text-muted);
  font-size: 14px;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 992px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .recommend-grid,
  .loading-row,
  .course-meta-grid {
    grid-template-columns: 1fr;
  }

  .summary-cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .profile-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-card-top {
    flex-direction: column;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
