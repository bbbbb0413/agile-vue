<template>
  <router-link :to="`/courses/${course.id}`" class="course-card">
    <!-- 썸네일 -->
    <div class="card-thumb" :class="thumbBg">
      <span class="thumb-emoji" aria-hidden="true">{{ thumbEmoji }}</span>
    </div>

    <!-- 내용 -->
    <div class="card-body">
      <span class="badge" :class="badgeClass">{{ getCategoryLabel(course.category) }}</span>
      <h3 class="card-title">{{ course.title }}</h3>
      <div class="card-meta">
        <span class="instructor">{{ course.instructorName }}</span>
      </div>
      <div class="card-footer">
        <span class="enrolled">수강생 {{ course.enrollmentCount?.toLocaleString() }}명</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { getCategoryLabel } from '@/constants/categories.js'

const props = defineProps({
  course: { type: Object, required: true }
})

// 카테고리 값과 상관없이(대부분 '기타'로 들어있어 다 같은 색이 되는 걸 방지) 강좌 id 기준으로
// 색/이모지를 돌려가며 입혀서 카드마다 시각적으로 다양하게 보여준다.
const CARD_STYLES = [
  { color: 'blue', emoji: '📘' },
  { color: 'teal', emoji: '🌿' },
  { color: 'pink', emoji: '🌸' },
  { color: 'amber', emoji: '☀️' },
  { color: 'purple', emoji: '🎨' },
  { color: 'green', emoji: '🍀' },
]

const style = computed(() => {
  const id = Number(props.course?.id) || 0
  return CARD_STYLES[id % CARD_STYLES.length]
})
const thumbBg = computed(() => `thumb-${style.value.color}`)
const badgeClass = computed(() => `badge-${style.value.color}`)
const thumbEmoji = computed(() => props.course.emoji || style.value.emoji)
</script>

<style scoped>
.course-card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
}
.course-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-hover);
}
.card-thumb {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.thumb-teal   { background: #E1F5EE; }
.thumb-blue   { background: #E6F1FB; }
.thumb-amber  { background: #FAEEDA; }
.thumb-purple { background: #EEEDFE; }
.thumb-pink   { background: #FBEAF0; }
.thumb-green  { background: #E4F4E2; }
.thumb-gray   { background: #F1EFE8; }
.thumb-emoji {
  font-size: 44px;
  line-height: 1;
}
.card-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.badge {
  align-self: flex-start;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.instructor {
  font-size: 12px;
  color: var(--color-text-secondary);
}
.card-footer {
  margin-top: 2px;
}
.enrolled {
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>
