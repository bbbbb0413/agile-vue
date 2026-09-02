<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <section
        class="members-modal fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-members-title"
      >
        <header class="modal-header">
          <div>
            <span class="modal-badge">프로그램 참여 어르신</span>
            <h2 id="course-members-title" class="modal-title">
              {{ course.title || '프로그램' }}
            </h2>
            <p class="modal-subtitle">어르신 카드를 선택하면 등록한 추가정보를 확인할 수 있습니다.</p>
          </div>
          <button
            ref="closeButton"
            type="button"
            class="close-button"
            aria-label="참여 어르신 목록 닫기"
            @click="close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div class="member-count">
          <span v-if="loading">불러오는 중…</span>
          <span v-else>총 {{ members.length }}명</span>
        </div>

        <div v-if="loading" class="member-grid" aria-hidden="true">
          <div v-for="i in 2" :key="i" class="member-card skeleton-card">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-lines">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>

        <div v-else-if="loadError" class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>목록을 불러오지 못했습니다.</h3>
          <p>{{ loadError }}</p>
          <button type="button" class="btn btn-ghost retry-button" @click="loadMembers">
            다시 시도
          </button>
        </div>

        <div v-else-if="members.length" class="member-grid">
          <article
            v-for="member in members"
            :key="member.userId"
            class="member-card"
          >
            <div class="member-avatar">{{ member.name?.charAt(0) || '?' }}</div>
            <div class="member-info">
              <div class="member-heading">
                <h3>{{ member.name || '이름 없음' }}</h3>
                <span class="status-badge" :class="statusClass(member.enrollmentStatus)">
                  {{ statusLabel(member.enrollmentStatus) }}
                </span>
              </div>
              <dl class="basic-info">
                <div><dt>나이</dt><dd>{{ member.age != null ? `${member.age}세` : '-' }}</dd></div>
                <div><dt>이메일</dt><dd>{{ member.email || '-' }}</dd></div>
                <div><dt>신청일</dt><dd>{{ formatDate(member.enrolledAt) }}</dd></div>
              </dl>
              <button
                type="button"
                class="detail-label"
                @click="selectMember(member)"
              >추가정보 보기 →</button>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>참여 어르신이 없습니다.</h3>
          <p>아직 이 프로그램을 신청한 어르신이 없습니다.</p>
        </div>

        <footer class="modal-footer">
          <button type="button" class="btn btn-ghost" @click="close">닫기</button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="loading || !members.length"
            @click="showReport"
          >종합 리포트 보기</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { enrollmentApi } from '@/api/enrollment.js'
import { normalizeStudent } from '@/utils/student.js'

const props = defineProps({
  course: { type: Object, required: true }
})

const emit = defineEmits(['close', 'select-member', 'show-report'])
const closeButton = ref(null)

const members = ref([])
const loading = ref(false)
const loadError = ref('')

/** 미리 주입된 members(테스트용 목업)가 있으면 API를 호출하지 않는다. */
function presetMembers() {
  return Array.isArray(props.course.members) ? props.course.members : null
}

async function loadMembers() {
  const preset = presetMembers()
  if (preset) {
    members.value = preset.map(normalizeStudent)
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    const res = await enrollmentApi.getCourseStudents(props.course.id)
    const payload = Array.isArray(res.data?.data) ? res.data.data
      : Array.isArray(res.data) ? res.data
      : []
    members.value = payload.map(normalizeStudent)
  } catch (error) {
    // enrollment-service는 권한 위반도 400 + message로 내려준다.
    members.value = []
    loadError.value = error?.response?.data?.message || '잠시 후 다시 시도해 주세요.'
  } finally {
    loading.value = false
  }
}

function statusClass(status) {
  return status === 'ACTIVE' ? 'status-active' : 'status-pending'
}

function statusLabel(status) {
  if (status === 'ACTIVE') return '수강 중'
  if (status === 'PENDING') return '대기 중'
  return status || '-'
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function close() {
  emit('close')
}

function selectMember(member) {
  emit('select-member', member)
}

function showReport() {
  emit('show-report')
}

function handleKeydown(event) {
  if (event.key === 'Escape') close()
}

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown)
  await nextTick()
  closeButton.value?.focus()
  await loadMembers()
})

onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 24px; background: rgba(15,23,42,.48); backdrop-filter: blur(3px); }
.members-modal { width: min(820px, 100%); max-height: calc(100vh - 48px); overflow-y: auto; border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-bg-primary); box-shadow: var(--shadow-lg); }
.modal-header { display: flex; justify-content: space-between; gap: 24px; padding: 28px; border-bottom: 1px solid var(--color-border); }
.modal-badge { display: inline-flex; margin-bottom: 10px; padding: 5px 12px; border-radius: 999px; background: var(--color-primary-light); color: var(--color-primary); font-size: 12px; font-weight: 700; }
.modal-title { margin-bottom: 6px; font-size: 24px; }
.modal-subtitle { color: var(--color-text-secondary); font-size: 14px; }
.close-button { display: grid; place-items: center; flex-shrink: 0; width: 36px; height: 36px; padding: 0; border-radius: 50%; background: var(--color-bg-tertiary); color: var(--color-text-secondary); font-size: 26px; line-height: 1; }
.close-button svg { display: block; width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }
.close-button:hover { background: var(--color-primary-light); color: var(--color-primary); }
.member-count { padding: 20px 28px 0; color: var(--color-text-secondary); font-size: 14px; font-weight: 600; }
.member-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 16px 28px 28px; }
.member-card { display: flex; gap: 14px; padding: 18px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-bg-primary); }
.member-avatar { display: grid; place-items: center; flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; background: var(--color-primary-light); color: var(--color-primary); font-size: 18px; font-weight: 700; }
.member-info { min-width: 0; flex: 1; }
.member-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
.member-heading h3 { font-size: 17px; }
.status-badge { padding: 4px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; }
.status-active { background: var(--color-success-light); color: var(--color-success); }
.status-pending { background: var(--color-warning-light); color: var(--color-warning); }
.basic-info { display: grid; gap: 7px; }
.basic-info div { display: grid; grid-template-columns: 64px 1fr; gap: 8px; font-size: 13px; }
.basic-info dt { color: var(--color-text-muted); }
.basic-info dd { min-width: 0; overflow: hidden; color: var(--color-text-primary); text-overflow: ellipsis; white-space: nowrap; }
.detail-label { display: block; margin: 14px 0 0 auto; padding: 0; background: transparent; color: var(--color-primary); cursor: pointer; font-size: 13px; font-weight: 600; text-align: right; }
.detail-label:hover { text-decoration: underline; }
.detail-label:focus-visible { border-radius: 3px; outline: 3px solid var(--color-primary-light); outline-offset: 3px; }
.skeleton-card { align-items: center; }
.skeleton-avatar { flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; background: var(--color-bg-tertiary); animation: member-pulse 1.4s ease-in-out infinite; }
.skeleton-lines { flex: 1; display: grid; gap: 9px; }
.skeleton-line { height: 11px; border-radius: 999px; background: var(--color-bg-tertiary); animation: member-pulse 1.4s ease-in-out infinite; }
.skeleton-line.short { width: 42%; }
@keyframes member-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@media (prefers-reduced-motion: reduce) { .skeleton-avatar, .skeleton-line { animation: none; } }
.retry-button { margin-top: 18px; }
.empty-state { padding: 56px 28px; text-align: center; }
.empty-icon { margin-bottom: 12px; font-size: 40px; }
.empty-state h3 { margin-bottom: 8px; font-size: 18px; }
.empty-state p { color: var(--color-text-secondary); font-size: 14px; }
.modal-footer { position: sticky; bottom: 0; display: flex; justify-content: flex-end; gap: 10px; padding: 18px 28px; border-top: 1px solid var(--color-border); background: var(--color-bg-primary); }
.modal-footer .btn:disabled { cursor: not-allowed; opacity: .5; }
@media (max-width: 680px) { .modal-overlay { padding: 12px; } .member-grid { grid-template-columns: 1fr; padding-left: 20px; padding-right: 20px; } .modal-header, .modal-footer { padding-left: 20px; padding-right: 20px; } }
</style>
