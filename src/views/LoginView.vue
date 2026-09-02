<template>
  <div class="login-page">
    <div class="login-layout">
      <!-- 좌측 브랜딩 -->
      <div class="login-left">
        <div class="brand-blob blob-a"></div>
        <div class="brand-blob blob-b"></div>
        <div class="left-inner">
          <div class="brand">
            <img src="@/assets/images/logo/main_logo.png" alt="다시봄" class="brand-logo" />
          </div>
          <div class="brand-content">
            <span class="brand-tagline">🌼 배움으로 만나는 새로운 봄</span>
            <h2>다시 만나서<br>반갑습니다</h2>
            <p>로그인하고 나만의 학습 여정을 이어가세요.</p>
            <ul class="feature-list">
              <li v-for="f in features" :key="f">
                <span class="dot">✓</span>{{ f }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 우측 -->
      <div class="login-right">
        <div class="right-blob blob-c"></div>
        <div class="right-blob blob-d"></div>
        <div class="login-box fade-in-up">
          <router-link to="/" class="back-link">← 홈으로</router-link>

          <!-- 로그인 영역 -->
          <div v-if="!showRegister" class="section">
            <div class="auth-icon">👋</div>
            <h3 class="section-title">반가워요!</h3>
            <p class="section-desc">다시봄 계정으로 로그인해주세요.</p>
            <button class="btn btn-primary btn-full" @click="handleOAuth">🔑 로그인하기</button>
            <div class="switch-link">
              계정이 없으신가요?
              <button class="text-btn" @click="showRegister = true">회원가입 하기 →</button>
            </div>
          </div>

          <!-- 회원가입 영역 -->
          <div v-else class="section">
            <div class="auth-icon">✍️</div>
            <h3 class="section-title">회원가입</h3>
            <form @submit.prevent="handleRegister" class="form">
              <div class="form-group">
                <label class="form-label">이름</label>
                <input v-model="registerForm.name" type="text" class="form-input" placeholder="홍길동" required />
              </div>
              <div class="form-group">
                <label class="form-label">이메일</label>
                <input v-model="registerForm.email" type="email" class="form-input" placeholder="user@example.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">비밀번호</label>
                <input v-model="registerForm.password" type="password" class="form-input" placeholder="8자 이상" required />
              </div>
              <div class="form-group">
                <label class="form-label">역할</label>
                <select v-model="registerForm.role" class="form-input">
                  <option value="STUDENT">학생</option>
                  <option value="INSTRUCTOR">강사</option>
                </select>
              </div>
              <div v-if="error" class="error-msg">{{ error }}</div>
              <div v-if="success" class="success-msg">{{ success }}</div>
              <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
                <span v-if="loading">가입 중...</span>
                <span v-else>회원가입</span>
              </button>
            </form>
            <div class="switch-link">
              이미 계정이 있으신가요?
              <button class="text-btn" @click="showRegister = false">로그인</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { authApi } from '@/api/auth.js'

const auth = useAuthStore()

const showRegister = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const registerForm = ref({ name: '', email: '', password: '', role: 'STUDENT' })

const features = ['수강 중인 강의 이어보기', '맞춤 강의 추천', '수료증 관리']

function handleOAuth() {
  auth.redirectToLogin()
}

async function handleRegister() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await authApi.register(registerForm.value)
    success.value = '회원가입 완료! 로그인 페이지로 이동합니다.'
    registerForm.value = { name: '', email: '', password: '', role: 'STUDENT' }
    setTimeout(() => {
      showRegister.value = false
      success.value = ''
    }, 2000)
  } catch (e) {
    error.value = e.response?.data?.message || '회원가입에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
}
.login-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  min-height: 100vh;
}
.login-left {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #E8A33D 0%, #D98A15 40%, #A8650B 75%, #6B3D06 100%);
  padding: 56px 48px;
  display: flex;
  align-items: center;
}
.brand-blob { position: absolute; border-radius: 50%; filter: blur(55px); opacity: 0.35; pointer-events: none; }
.blob-a { width: 260px; height: 260px; background: #fff6df; top: -80px; right: -60px; }
.blob-b { width: 220px; height: 220px; background: #fddca0; bottom: -70px; left: -50px; }
.left-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 440px;
  margin: 0 auto;
  width: 100%;
}
.brand { display: flex; }
.brand-logo {
  width: 120px;
  height: 120px;
  padding: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffffff 55%, rgba(255,255,255,0.5) 75%, rgba(255,255,255,0) 100%);
  object-fit: contain;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,0.18));
}
.brand-tagline {
  display: inline-block;
  width: fit-content;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: rgba(255,255,255,0.18);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 16px;
}
.brand-content h2 {
  font-size: 34px; font-weight: 800; color: #fff;
  line-height: 1.35; margin-bottom: 14px;
}
.brand-content p { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 28px; }
.feature-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background: rgba(255,255,255,0.14);
  padding: 12px 16px;
  border-radius: 16px;
}
.dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  color: var(--color-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.login-right {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: var(--color-bg-primary);
}
.right-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.18; pointer-events: none; }
.blob-c { width: 260px; height: 260px; background: var(--color-secondary); top: -60px; right: -40px; }
.blob-d { width: 220px; height: 220px; background: var(--color-primary-light); bottom: -50px; left: -30px; }
.login-box {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  background: var(--color-bg-primary);
  border: 1.5px solid var(--color-primary-light);
  border-radius: 28px;
  padding: 44px 40px;
  box-shadow: 0 20px 50px -12px rgba(217, 138, 21, 0.22);
}
.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  transition: var(--transition);
}
.back-link:hover { color: var(--color-primary); }

.section { display: flex; flex-direction: column; gap: 16px; }
.auth-icon {
  width: 60px;
  height: 60px;
  align-self: center;
  border-radius: 50%;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 2px;
}
.section-title { font-size: 26px; font-weight: 800; color: var(--color-text-primary); margin-bottom: 2px; text-align: center; }
.section-desc { font-size: 16px; color: var(--color-text-secondary); margin-bottom: 8px; text-align: center; line-height: 1.5; }

.form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); }
.form-input {
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  transition: var(--transition);
  outline: none;
}
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.btn-full {
  width: 100%;
  padding: 16px;
  font-size: 17px;
  font-weight: 700;
  justify-content: center;
  margin-top: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary-dark));
  box-shadow: 0 10px 24px -8px rgba(217, 138, 21, 0.5);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-full:hover { transform: translateY(-2px); box-shadow: 0 14px 28px -8px rgba(217, 138, 21, 0.6); }

.switch-link {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: 12px;
  padding: 12px 16px;
  background: var(--color-primary-light);
  border-radius: 999px;
}
.text-btn {
  background: none;
  border: none;
  color: var(--color-primary-dark);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  padding: 0 2px;
  text-decoration: none;
}
.text-btn:hover { text-decoration: underline; }
.error-msg {
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #dc2626;
}
.success-msg {
  padding: 10px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #16a34a;
}

@media (max-width: 900px) {
  .login-layout { grid-template-columns: 1fr; }
  .login-left { padding: 40px 24px; }
  .left-inner { max-width: 100%; }
  .login-right { padding: 32px 20px; }
}
</style>
