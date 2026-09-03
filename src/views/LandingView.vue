<template>
  <div class="landing">
    <AppHeader />

    <!-- 히어로 섹션 -->
    <section class="hero">
      <div class="hero-blob blob-1"></div>
      <div class="hero-blob blob-2"></div>
      <div class="hero-blob blob-3"></div>
      <div class="hero-inner">
        <div class="hero-content fade-in-up">
          <span class="hero-badge">우리 동네 어르신 배움터</span>
          <h1 class="hero-title">다시 배우는 즐거움,<br>가까운 곳에서 만나보세요</h1>
          <p class="hero-desc">서예, 태권도, 노래교실까지<br />— 우리 동네 강사님과 함께 부담 없이 시작해보세요.</p>
          <div class="hero-actions">
            <router-link to="/login" class="btn btn-primary btn-lg btn-cta">지금 신청하기 <span class="btn-arrow">→</span></router-link>
            <router-link to="/courses" class="btn btn-outline btn-lg btn-cta">강좌 둘러보기</router-link>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-icon">📚</span>
              <span class="stat-text"><span class="stat-num">500+</span><span class="stat-label">강좌</span></span>
            </div>
            <div class="stat">
              <span class="stat-icon">👩‍🏫</span>
              <span class="stat-text"><span class="stat-num">120+</span><span class="stat-label">강사</span></span>
            </div>
            <div class="stat">
              <span class="stat-icon">💛</span>
              <span class="stat-text"><span class="stat-num">12,000+</span><span class="stat-label">회원님</span></span>
            </div>
          </div>
        </div>
        <div class="hero-visual fade-in">
          <div class="visual-card">
            <img src="@/assets/images/logo/main_logo.png" alt="다시봄" class="hero-logo" />
          </div>
          <span class="floating-chip chip-1">🌸</span>
          <span class="floating-chip chip-2">🌿</span>
          <span class="floating-chip chip-3">🌷</span>
        </div>
      </div>
    </section>

    <!-- 인기 강좌 -->
    <section class="popular-section">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">인기 강좌</h2>
          <router-link to="/login" class="section-link">전체 보기 →</router-link>
        </div>
        <div class="course-grid">
          <div v-for="course in featuredCourses" :key="course.id" class="course-card-landing">
            <div class="card-thumb" :class="course.thumbBg">
              <span v-if="course.popular" class="ribbon">인기</span>
              <button
                type="button"
                class="favorite-button"
                :class="{ active: favoriteIds.has(course.id) }"
                :aria-pressed="favoriteIds.has(course.id)"
                :aria-label="favoriteIds.has(course.id) ? '찜 삭제' : '찜 추가'"
                :title="favoriteIds.has(course.id) ? '찜 삭제' : '찜 추가'"
                :disabled="favoriteLoadingIds.has(course.id)"
                @click.stop="toggleFavorite(course.id)"
              >
                {{ favoriteIds.has(course.id) ? '♥' : '♡' }}
              </button>
              <span class="thumb-emoji">{{ course.icon }}</span>
            </div>
            <div class="card-body">
              <span class="badge" :class="course.badgeClass">{{ course.category }}</span>
              <h3 class="card-title">{{ course.title }}</h3>
              <div class="card-meta">
                <span class="instructor">{{ course.instructor }}</span>
              </div>
              <button
                type="button"
                class="btn-add-cart"
                :class="{ added: addedIds.has(course.id) }"
                @click="toggleAdd(course.id)"
              >
                <span v-if="addedIds.has(course.id)">✓ 담았어요</span>
                <span v-else>＋ 강의 담기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features-section">
      <div class="section-inner">
        <h2 class="section-title center">왜 다시봄인가요?</h2>
        <div class="features-grid">
          <div v-for="f in features" :key="f.title" class="feature-card">
            <div class="feature-icon-badge" :class="f.badgeClass">
              <span class="feature-icon">{{ f.icon }}</span>
            </div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-inner">
        <h2>지금 바로 다시 배워보세요</h2>
        <p>이미 많은 어르신들이 다시봄과 함께 즐겁게 배우고 계세요.</p>
        <router-link to="/login" class="btn btn-primary btn-lg btn-cta">지금 신청하기 <span class="btn-arrow">→</span></router-link>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-logo">
          <img src="@/assets/images/logo/main_logo.png" alt="다시봄" />
          <span>다시봄</span>
        </div>
        <p class="footer-copy">© 2026 다시봄. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { getCategoryStyle } from '@/constants/categories.js'
import { enrollmentApi } from '@/api/enrollment.js'
import { useAuthStore } from '@/store/auth.js'
import { useCourseStore } from '@/store/course.js'

const auth = useAuthStore()
const courseStore = useCourseStore()

// 담은 강좌 id 목록 (UI 전용 - 백엔드 연동 전 임시 상태)
const addedIds = reactive(new Set())
function toggleAdd(id) {
  if (addedIds.has(id)) {
    addedIds.delete(id)
  } else {
    addedIds.add(id)
  }
}

const favoriteIds = reactive(new Set())
const favoriteLoadingIds = reactive(new Set())

async function loadFavorites() {
  if (!auth.isAuthenticated || auth.isInstructor) return

  try {
    const res = await enrollmentApi.getFavorites()
    const favorites = Array.isArray(res.data?.data) ? res.data.data : []
    favorites.forEach(favorite => favoriteIds.add(Number(favorite.courseId)))
  } catch (error) {
    console.error('[Landing] failed to load favorites:', error)
  }
}

async function toggleFavorite(courseId) {
  if (!auth.isAuthenticated) {
    window.location.href = '/login'
    return
  }

  if (auth.isInstructor || favoriteLoadingIds.has(courseId)) return

  favoriteLoadingIds.add(courseId)
  try {
    if (favoriteIds.has(courseId)) {
      await enrollmentApi.deleteFavorite(courseId)
      favoriteIds.delete(courseId)
    } else {
      await enrollmentApi.addFavorite(courseId)
      favoriteIds.add(courseId)
    }
  } catch (error) {
    console.error('[Landing] favorite update failed:', error)
  } finally {
    favoriteLoadingIds.delete(courseId)
  }
}

// 실제 강좌 중 수강생이 많은 순으로 6개를 뽑아 인기 강좌로 보여준다.
const featuredCourses = computed(() =>
  [...courseStore.courses]
    .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
    .slice(0, 6)
    .map((course, index) => ({
      ...course,
      instructor: course.instructorName,
      icon: course.emoji || getCategoryStyle(course.category).emoji,
      thumbBg: getCategoryStyle(course.category).bg,
      badgeClass: getCategoryStyle(course.category).badge,
      popular: index === 0,
    }))
)

const features = [
  { icon:'🖐️', title:'쉽고 간편한 신청', desc:'복잡한 절차 없이 몇 번의 클릭으로 신청이 끝나요.', badgeClass:'thumb-teal' },
  { icon:'👩‍🏫', title:'우리 동네 강사', desc:'가까운 곳에서 만나는 믿음직한 강사님과 함께해요.', badgeClass:'thumb-blue' },
  { icon:'👀', title:'눈에 편안한 화면', desc:'큰 글씨와 또렷한 버튼으로 누구나 쉽게 이용해요.', badgeClass:'thumb-purple' },
  { icon:'👨‍👩‍👧', title:'가족과 함께 확인', desc:'신청 내역을 자녀에게도 알려드릴 수 있어요.', badgeClass:'thumb-pink' },
]

onMounted(() => {
  loadFavorites()
  if (!courseStore.courses.length) {
    courseStore.fetchCourses()
  }
})
</script>

<style scoped>
.landing { background: var(--color-bg-secondary); }

/* 히어로 */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #FFF8EC 0%, #FDF1DC 50%, #FFF4E0 100%);
  border-bottom: 1px solid var(--color-border);
  padding: 80px 0 64px;
}
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  pointer-events: none;
}
.blob-1 { width: 320px; height: 320px; background: var(--color-secondary); top: -120px; right: -60px; }
.blob-2 { width: 260px; height: 260px; background: var(--color-primary-light); bottom: -100px; left: -80px; opacity: 0.8; }
.blob-3 { width: 200px; height: 200px; background: var(--color-primary); top: 320px; left: 20px; opacity: 0.28; }
.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  align-items: center;
}
.hero-badge {
  display: inline-block;
  padding: 7px 18px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.5px;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}
.hero-desc {
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.8;
  max-width: 460px;
  margin-bottom: 28px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
}
.btn-lg { padding: 14px 32px; font-size: 17px; }
.btn-cta { border-radius: 999px; }
.btn-arrow {
  display: inline-block;
  margin-left: 2px;
  transition: transform 0.2s ease;
}
.btn-cta:hover .btn-arrow { transform: translateX(4px); }

.hero-stats { display: flex; gap: 32px; }
.stat { display: flex; align-items: center; gap: 10px; }
.stat-icon { font-size: 22px; }
.stat-text { display: flex; flex-direction: column; gap: 2px; }
.stat-num { font-size: 22px; font-weight: 700; color: var(--color-primary); }
.stat-label { font-size: 13px; color: var(--color-text-secondary); }

.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.visual-card {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, #ffffff 48%, rgba(255,255,255,0.7) 66%, rgba(255,255,255,0) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  filter: drop-shadow(0 14px 30px rgba(0,0,0,0.12));
}
.hero-logo { width: 100%; height: 100%; object-fit: contain; }
.floating-chip {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  animation: floatChip 3s ease-in-out infinite;
}
.chip-1 { top: -6px; left: -18px; animation-delay: 0s; }
.chip-2 { bottom: 6px; right: -22px; animation-delay: 0.6s; }
.chip-3 { top: 45%; right: -32px; animation-delay: 1.2s; }
@keyframes floatChip {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 강좌 섹션 */
.popular-section { padding: 64px 0; }
.section-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.section-title { font-size: 22px; font-weight: 700; color: var(--color-text-primary); }
.section-title.center { text-align: center; margin-bottom: 40px; }
.section-link { font-size: 14px; color: var(--color-primary); font-weight: 500; }
.section-link:hover { text-decoration: underline; }

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.course-card-landing {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
}
.course-card-landing:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.card-thumb {
  position: relative;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.thumb-teal   { background: linear-gradient(135deg, #E1F5EE, #CFF0E2); }
.thumb-blue   { background: linear-gradient(135deg, #E6F1FB, #D8ECFC); }
.thumb-purple { background: linear-gradient(135deg, #EEEDFE, #E3E1FC); }
.thumb-pink   { background: linear-gradient(135deg, #FBEAF0, #F8DCE7); }
.thumb-amber  { background: linear-gradient(135deg, #FAEEDA, #F6E2C2); }
.thumb-green  { background: linear-gradient(135deg, #E4F4E2, #D3EDD0); }
.thumb-gray   { background: linear-gradient(135deg, #F1EFE8, #E6E3D9); }
.thumb-emoji  { font-size: 40px; line-height: 1; }
.ribbon {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
}
.favorite-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #c24146;
  font-size: 23px;
  line-height: 1;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.favorite-button:hover:not(:disabled),
.favorite-button.active {
  background: #fff5f5;
  border-color: #e56b6f;
  transform: scale(1.08);
}
.favorite-button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.card-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }
.card-title { font-size: 15px; font-weight: 600; color: var(--color-text-primary); line-height: 1.4; }
.card-meta { display: flex; justify-content: space-between; align-items: center; }
.instructor { font-size: 13px; color: var(--color-text-secondary); }
.btn-add-cart {
  margin-top: 6px;
  width: 100%;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1.5px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}
.btn-add-cart:hover { background: var(--color-primary-light); }
.btn-add-cart.added {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.btn-add-cart.added:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

/* 특징 */
.features-section { padding: 64px 0; background: var(--color-bg-primary); }
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.feature-card {
  padding: 28px 24px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: var(--transition);
}
.feature-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.feature-icon-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}
.feature-icon { font-size: 28px; }
.feature-title { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
.feature-desc { font-size: 15px; color: var(--color-text-secondary); line-height: 1.7; }

/* CTA */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  text-align: center;
}
.cta-inner { max-width: 600px; margin: 0 auto; padding: 0 24px; }
.cta-inner h2 { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 12px; }
.cta-inner p { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 32px; }
.cta-inner .btn-primary {
  background: #fff;
  color: var(--color-primary);
  border-color: #fff;
  font-weight: 600;
}
.cta-inner .btn-primary:hover { background: #f0f7ff; }

/* 푸터 */
.footer {
  background: var(--color-text-primary);
  padding: 32px 0;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}
.footer-logo img { width: 28px; height: 28px; border-radius: 6px; }
.footer-copy { font-size: 13px; color: rgba(255,255,255,0.5); }
</style>
