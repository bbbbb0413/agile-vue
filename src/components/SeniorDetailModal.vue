<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <section class="detail-modal fade-in-up" role="dialog" aria-modal="true" aria-labelledby="senior-detail-title">
        <header class="modal-header">
          <div>
            <span class="modal-badge">어르신 추가정보</span>
            <h2 id="senior-detail-title">{{ senior.name || '회원 정보' }}</h2>
            <p>{{ senior.email || '-' }} · 회원 #{{ senior.id }}</p>
          </div>
          <button ref="closeButton" type="button" class="close-button" aria-label="어르신 정보 닫기" @click="close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div v-if="healthNote" class="health-note">
          <h3>건강 체크 요약</h3>
          <p>{{ healthNote }}</p>
        </div>
        <div v-else class="empty-state">등록된 추가정보가 없습니다.</div>

        <footer class="modal-footer">
          <button type="button" class="btn btn-primary" @click="close">확인</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({ senior: { type: Object, required: true } })
const emit = defineEmits(['close'])
const closeButton = ref(null)

const healthNote = computed(() => {
  const note = props.senior.note
  if (note == null || note === '') return ''
  return typeof note === 'string' ? note : JSON.stringify(note)
})

function close() { emit('close') }
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
})
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown, true))
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 1100; display: grid; place-items: center; padding: 24px; background: rgba(15,23,42,.58); backdrop-filter: blur(4px); }
.detail-modal { width: min(560px, 100%); max-height: calc(100vh - 48px); overflow-y: auto; border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-bg-primary); box-shadow: var(--shadow-lg); }
.modal-header { display: flex; justify-content: space-between; gap: 20px; padding: 26px; border-bottom: 1px solid var(--color-border); }
.modal-badge { display: inline-flex; margin-bottom: 10px; padding: 5px 12px; border-radius: 999px; background: var(--color-primary-light); color: var(--color-primary); font-size: 12px; font-weight: 700; }
.modal-header h2 { margin-bottom: 5px; font-size: 23px; }
.modal-header p { color: var(--color-text-secondary); font-size: 13px; }
.close-button { display: grid; place-items: center; flex-shrink: 0; width: 36px; height: 36px; padding: 0; border-radius: 50%; background: var(--color-bg-tertiary); color: var(--color-text-secondary); font-size: 26px; line-height: 1; }
.close-button svg { display: block; width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }
.health-note { margin: 24px 26px; padding: 20px; border-radius: var(--radius-md); background: var(--color-bg-secondary); }
.health-note h3 { margin-bottom: 10px; color: var(--color-text-muted); font-size: 13px; font-weight: 600; }
.health-note p { color: var(--color-text-primary); font-size: 15px; line-height: 1.8; white-space: pre-line; overflow-wrap: anywhere; }
.empty-state { padding: 48px 26px; color: var(--color-text-muted); text-align: center; }
.modal-footer { display: flex; justify-content: flex-end; padding: 18px 26px; border-top: 1px solid var(--color-border); }
@media (max-width: 640px) { .modal-overlay { padding: 12px; } }
</style>
