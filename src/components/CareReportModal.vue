<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <section
        class="report-modal fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="care-report-title"
      >
        <header class="modal-header">
          <div>
            <span class="report-badge">AI 회원 종합 리포트</span>
            <h2 id="care-report-title" class="modal-title">
              {{ report?.courseTitle || course.title || '강의 리포트' }}
            </h2>
            <p class="modal-subtitle">
              참여 회원의 기본정보와 상태를 종합한 리포트입니다.
            </p>
          </div>

          <button
            ref="closeButton"
            type="button"
            class="close-button"
            aria-label="리포트 닫기"
            @click="close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div v-if="loading" class="api-state">
          <div class="loading-spinner"></div>
          <h3>AI 종합 리포트를 불러오는 중입니다.</h3>
          <p>건강정보 분석에 잠시 시간이 걸릴 수 있습니다.</p>
        </div>

        <div v-else-if="errorMessage" class="api-state api-error">
          <div class="empty-icon">⚠️</div>
          <h3>리포트를 불러오지 못했습니다.</h3>
          <p>{{ errorMessage }}</p>
          <button type="button" class="btn btn-outline retry-button" @click="loadReport">
            다시 시도
          </button>
        </div>

        <template v-else-if="report">
          <div class="program-summary">
            <div>
              <span class="summary-label">전체 참여 어르신</span>
              <strong>{{ report.totalEnrolledStudents ?? 0 }}명</strong>
            </div>
            <div>
              <span class="summary-label">건강정보 등록</span>
              <strong>{{ report.studentsWithNotes ?? 0 }}명</strong>
            </div>
          </div>

          <div class="report-content report-content-filled">
            <section class="report-section overall-section">
              <h3>종합 의견</h3>
              <p>{{ report.overallOpinion || '종합 의견이 없습니다.' }}</p>
            </section>

            <section class="report-section">
              <h3>어르신별 건강정보 요약</h3>
              <div v-if="studentSummaries.length" class="student-summary-list">
                <article
                  v-for="student in studentSummaries"
                  :key="student.userId"
                  class="student-summary-card"
                >
                  <div class="student-summary-head">
                    <strong>회원 #{{ student.userId }}</strong>
                    <span class="risk-badge" :class="riskClass(student.riskLevel)">
                      {{ riskLabel(student.riskLevel) }}
                    </span>
                  </div>
                  <p>{{ student.summary || '요약 내용이 없습니다.' }}</p>
                </article>
              </div>
              <p v-else class="empty-summary">요약할 건강정보가 없습니다.</p>
            </section>

            <aside v-if="report.disclaimer" class="disclaimer">
              {{ report.disclaimer }}
            </aside>

            <div v-if="report.model" class="model-info">사용 모델: {{ report.model }}</div>
          </div>
        </template>

        <div v-else class="report-content report-content-empty">
          <div class="empty-icon">📋</div>
          <h3>아직 생성된 리포트가 없습니다.</h3>
          <p>
            백엔드 리포트 조회 API가 연결되면 이 영역에 회원 종합 리포트가 표시됩니다.
          </p>
        </div>

        <footer class="modal-footer">
          <button type="button" class="btn btn-primary" @click="close">확인</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { reportApi } from '@/api/report.js'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const closeButton = ref(null)
const report = ref(props.course.healthReport ?? null)
const loading = ref(!report.value)
const errorMessage = ref('')

const studentSummaries = computed(() =>
  Array.isArray(report.value?.studentSummaries)
    ? report.value.studentSummaries
    : []
)

function riskClass(level) {
  return `risk-${String(level || 'UNKNOWN').toLowerCase()}`
}

function riskLabel(level) {
  return {
    HIGH: '높음',
    MEDIUM: '주의',
    LOW: '낮음'
  }[level] || level || '미분류'
}

async function loadReport() {
  if (props.course.healthReport) {
    report.value = props.course.healthReport
    loading.value = false
    errorMessage.value = ''
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await reportApi.getHealthReport(props.course.id)
    const payload = response.data?.data ?? response.data

    if (!payload || typeof payload !== 'object') {
      throw new Error('리포트 응답 형식이 올바르지 않습니다.')
    }

    report.value = payload
  } catch (error) {
    console.error('[CareReport] failed to load health report:', error)
    errorMessage.value =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'AI 종합 리포트를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.stopImmediatePropagation()
    close()
  }
}

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown, true)
  await nextTick()
  closeButton.value?.focus()
  await loadReport()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown, true)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(3px);
}

.report-modal {
  width: min(720px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 28px 22px;
  border-bottom: 1px solid var(--color-border);
}

.report-badge {
  display: inline-flex;
  margin-bottom: 10px;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
}

.modal-title {
  margin-bottom: 6px;
  font-size: 24px;
  line-height: 1.35;
}

.modal-subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.close-button {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-size: 26px;
  line-height: 1;
}

.close-button:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.close-button svg {
  display: block;
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
}

.program-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px 28px 0;
}

.program-summary > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}

.summary-label {
  color: var(--color-text-muted);
  font-size: 12px;
}

.report-content {
  min-height: 260px;
  padding: 28px;
}

.api-state {
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 28px;
  text-align: center;
}

.api-state h3 {
  margin: 14px 0 8px;
  font-size: 18px;
}

.api-state p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.loading-spinner {
  width: 34px;
  height: 34px;
  border: 3px solid var(--color-primary-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

.retry-button {
  margin-top: 18px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.report-content-empty {
  padding-top: 48px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 12px;
  font-size: 40px;
}

.report-content-empty h3 {
  margin-bottom: 8px;
  font-size: 18px;
}

.report-content-empty p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.report-content-filled {
  display: grid;
  gap: 24px;
}

.report-section h3 {
  margin-bottom: 12px;
  font-size: 17px;
}

.student-summary-list {
  display: grid;
  gap: 10px;
}

.student-summary-card {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}

.student-summary-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
}

.student-summary-card p,
.overall-section p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.risk-badge {
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.risk-high { background: #fee2e2; color: #b91c1c; }
.risk-medium { background: var(--color-warning-light); color: var(--color-warning); }
.risk-low { background: var(--color-success-light); color: var(--color-success); }
.risk-unknown { background: var(--color-bg-tertiary); color: var(--color-text-secondary); }

.overall-section {
  padding: 18px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
}

.overall-section p {
  color: var(--color-text-primary);
}

.disclaimer {
  padding: 14px 16px;
  border-left: 3px solid var(--color-warning);
  background: var(--color-warning-light);
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.model-info,
.empty-summary {
  color: var(--color-text-muted);
  font-size: 12px;
  text-align: right;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 18px 28px;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 12px;
  }

  .modal-header,
  .modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .program-summary {
    grid-template-columns: 1fr;
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
