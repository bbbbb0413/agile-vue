<template>
  <div class="landing">
    <AppHeader />

    <!-- 히어로 섹션 -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content fade-in-up">
          <span class="hero-badge">우리 동네 어르신 배움터</span>
          <h1 class="hero-title">다시 배우는 즐거움,<br>가까운 곳에서 만나보세요</h1>
          <p class="hero-desc">서예, 태권도, 노래교실까지 — 우리 동네 선생님과 함께 부담 없이 시작해보세요.</p>
          <div class="hero-actions">
            <router-link to="/login" class="btn btn-primary btn-lg">지금 신청하기</router-link>
            <router-link to="/courses" class="btn btn-outline btn-lg">강좌 둘러보기</router-link>
          </div>
          <div class="hero-stats">
            <div class="stat"><span class="stat-num">500+</span><span class="stat-label">강좌</span></div>
            <div class="stat"><span class="stat-num">120+</span><span class="stat-label">선생님</span></div>
            <div class="stat"><span class="stat-num">12,000+</span><span class="stat-label">회원님</span></div>
          </div>
        </div>
        <div class="hero-visual fade-in">
          <img src="@/assets/images/logo/main_logo.png" alt="다시봄" class="hero-logo" />
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
              <span class="thumb-emoji">{{ course.icon }}</span>
            </div>
            <div class="card-body">
              <span class="badge" :class="course.badgeClass">{{ course.category }}</span>
              <h3 class="card-title">{{ course.title }}</h3>
              <div class="card-meta">
                <span class="instructor">{{ course.instructor }}</span>
                <span class="price">{{ course.price }}</span>
              </div>
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
            <div class="feature-icon">{{ f.icon }}</div>
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
        <router-link to="/login" class="btn btn-primary btn-lg">지금 신청하기</router-link>
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
import AppHeader from '@/components/AppHeader.vue'

const featuredCourses = [
  { id:1, title:'서예 교실',       category:'예술', instructor:'이서예 선생님',   price:'₩10,000', icon:'🖌️', thumbBg:'thumb-teal',   badgeClass:'badge-teal'   },
  { id:2, title:'태권도 교실',     category:'건강', instructor:'박태권 선생님',   price:'₩15,000', icon:'🥋', thumbBg:'thumb-blue',   badgeClass:'badge-blue'   },
  { id:3, title:'노래교실',        category:'여가', instructor:'최고운 선생님',   price:'₩8,000',  icon:'🎤', thumbBg:'thumb-pink',   badgeClass:'badge-pink'   },
  { id:4, title:'요가 · 스트레칭', category:'건강', instructor:'정유연 선생님',   price:'₩12,000', icon:'🧘', thumbBg:'thumb-blue',   badgeClass:'badge-blue'   },
  { id:5, title:'스마트폰 활용법', category:'생활', instructor:'김디지털 선생님', price:'무료',     icon:'📱', thumbBg:'thumb-purple', badgeClass:'badge-purple' },
  { id:6, title:'텃밭 가꾸기',     category:'여가', instructor:'한농부 선생님',   price:'₩5,000',  icon:'🌱', thumbBg:'thumb-teal',   badgeClass:'badge-teal'   },
]

const features = [
  { icon:'🖐️', title:'쉽고 간편한 신청', desc:'복잡한 절차 없이 몇 번의 클릭으로 신청이 끝나요.' },
  { icon:'👩‍🏫', title:'우리 동네 선생님', desc:'가까운 곳에서 만나는 믿음직한 선생님과 함께해요.' },
  { icon:'👀', title:'눈에 편안한 화면', desc:'큰 글씨와 또렷한 버튼으로 누구나 쉽게 이용해요.' },
  { icon:'👨‍👩‍👧', title:'가족과 함께 확인', desc:'신청 내역을 자녀에게도 알려드릴 수 있어요.' },
]
</script>

<style scoped>
.landing { background: var(--color-bg-secondary); }

/* 히어로 */
.hero {
  background: linear-gradient(135deg, #FFF8EC 0%, #FDF1DC 50%, #FFF4E0 100%);
  border-bottom: 1px solid var(--color-border);
  padding: 80px 0 64px;
}
.hero-inner {
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
  padding: 5px 14px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 12px;
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
.hero-stats {
  display: flex;
  gap: 36px;
}
.stat { display: flex; flex-direction: column; gap: 2px; }
.stat-num { font-size: 22px; font-weight: 700; color: var(--color-primary); }
.stat-label { font-size: 13px; color: var(--color-text-secondary); }
.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-logo {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
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
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.thumb-teal   { background: #E1F5EE; }
.thumb-blue   { background: #E6F1FB; }
.thumb-purple { background: #EEEDFE; }
.thumb-pink   { background: #FBEAF0; }
.thumb-emoji  { font-size: 40px; line-height: 1; }
.card-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }
.card-title { font-size: 15px; font-weight: 600; color: var(--color-text-primary); line-height: 1.4; }
.card-meta { display: flex; justify-content: space-between; align-items: center; }
.instructor { font-size: 13px; color: var(--color-text-secondary); }
.price { font-size: 15px; font-weight: 600; color: var(--color-primary); }

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
.feature-icon { font-size: 32px; margin-bottom: 12px; }
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
