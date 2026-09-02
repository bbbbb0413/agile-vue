<template>
  <div class="page-wrapper">
    <AppHeader />
    <div class="chat-layout">
      <h1 class="page-title">오늘 컨디션 체크</h1>
      <p class="page-sub">수업 전, 오늘 몸 상태를 편하게 이야기해주세요. 강사님께 요약해서 전달됩니다.</p>

      <div class="chat-box" ref="chatBoxRef">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="chat-bubble"
          :class="msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'"
        >
          {{ msg.content }}
        </div>

        <div v-if="loading" class="chat-bubble bubble-assistant bubble-loading">
          <div class="spinner"></div>
        </div>
      </div>

      <div v-if="!finished" class="chat-input-row">
        <input
          v-model="draft"
          class="chat-input"
          placeholder="여기에 답변을 입력해주세요..."
          :disabled="loading"
          @keyup.enter="sendMessage"
        />
        <button class="btn btn-primary" :disabled="loading || !draft.trim()" @click="sendMessage">
          보내기
        </button>
        <button class="btn btn-ghost" :disabled="loading || messages.length === 0" @click="finishCheck">
          체크 끝
        </button>
      </div>

      <div v-else class="finished-box">
        <p class="finished-title">✅ 컨디션 체크가 완료됐어요</p>
        <p class="finished-summary">{{ summary }}</p>
        <router-link to="/enrollments" class="btn btn-primary" style="margin-top:16px;">
          내 수강 목록으로 이동
        </router-link>
      </div>

      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { healthcheckApi } from '@/api/healthcheck.js'
import { enrollmentApi } from '@/api/enrollment.js'

const route = useRoute()
const enrollmentId = route.params.enrollmentId

const messages = ref([])
const draft = ref('')
const loading = ref(false)
const finished = ref(false)
const summary = ref('')
const errorMsg = ref('')
const chatBoxRef = ref(null)

async function scrollToBottom() {
  await nextTick()
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
  }
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text) return

  messages.value.push({ role: 'user', content: text })
  draft.value = ''
  loading.value = true
  errorMsg.value = ''
  await scrollToBottom()

  try {
    const res = await healthcheckApi.chat(messages.value)
    messages.value.push({ role: 'assistant', content: res.data.reply })
  } catch (e) {
    console.error('[HealthCheck] chat failed:', e)
    errorMsg.value = '대화 응답을 받아오지 못했습니다.'
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

async function finishCheck() {
  loading.value = true
  errorMsg.value = ''

  try {
    const res = await healthcheckApi.summarize(messages.value)
    summary.value = res.data.summary
    await enrollmentApi.updateNote(enrollmentId, summary.value)
    finished.value = true
  } catch (e) {
    console.error('[HealthCheck] summarize/save failed:', e)
    errorMsg.value = '요약 저장에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await healthcheckApi.chat([])
    messages.value.push({ role: 'assistant', content: res.data.reply })
  } catch (e) {
    console.error('[HealthCheck] initial greeting failed:', e)
    errorMsg.value = '대화를 시작하지 못했습니다.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.chat-layout {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.page-sub {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.chat-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  min-height: 320px;
  max-height: 480px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.chat-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.bubble-assistant {
  align-self: flex-start;
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.bubble-user {
  align-self: flex-end;
  background: var(--color-primary);
  color: #fff;
}

.bubble-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
}

.chat-input-row {
  display: flex;
  gap: 8px;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-sans);
}

.finished-box {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  text-align: center;
}

.finished-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.finished-summary {
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
}

.error-msg {
  margin-top: 12px;
  color: #C0392B;
  font-size: 13px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
