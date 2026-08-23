<template>
  <MainLayout>
    <div class="dashboard-page">
      <header class="top-nav">
        <div class="nav-left">
          <!-- <div class="logo-placeholder"> -->
            <img class="logo-icon" src="../assets/logo.png" alt="logo" />
            <!-- <span class="logo-text">LOGO</span> -->
          <!-- </div> -->
          <div class="system-title">中国城市碳排放可视化与分析系统</div>
        </div>

        <div class="nav-center">
          <button
            :class="['nav-tab', { active: isMapActive }]"
            @click="router.push('/dashboard/map')"
          >地图展示</button>
          <button
            :class="['nav-tab', { active: isAnalysisActive }]"
            @click="router.push('/dashboard/analysis')"
          >图表分析</button>
        </div>

        <div class="nav-right">
          <button class="nav-link" @click="showAbout = true">关于</button>
          <button class="nav-link">用户</button>
          <button class="logout-btn" @click="handleLogout">退出登录</button>
        </div>
      </header>

      <div class="page-content">
        <router-view />
      </div>

      <div v-if="showAbout" class="about-overlay" @click.self="showAbout = false">
        <div class="about-dialog">
          <div class="about-header">
            <span class="about-title">关于</span>
            <button class="about-close" @click="showAbout = false">✕</button>
          </div>
          <div class="about-body">
            <div class="about-item">
              <span class="about-label">版本：</span>
              <span class="about-value">1.0.0</span>
            </div>
            <div class="about-item">
              <span class="about-label">数据来源：</span>
              <span class="about-value">CHRED 3.0数据库、中国城市温室气体工作组（CCG）公开数据、统计年鉴、政府工作报告、调研报告等</span>
            </div>
            <div class="about-item">
              <span class="about-label">开发意见与反馈：</span>
              <span class="about-value">dengbiqing@qq.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useAuthStore } from '../auth/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showAbout = ref(false)

const isMapActive = computed(() => route.path.includes('/dashboard/map'))
const isAnalysisActive = computed(() => route.path.includes('/dashboard/analysis'))

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.top-nav {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(180deg, rgba(10, 30, 55, 0.95), rgba(17, 47, 83, 0.92));
  border-bottom: 1px solid rgba(0, 229, 255, 0.25);
  box-sizing: border-box;
  z-index: 200;
  flex-shrink: 0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-placeholder {
  display: flex;
  align-items: center;
  /* gap: 6px; */
  /* padding: 2px 10px; */
  /* border: 1px solid rgba(0, 229, 255, 0.3); */
  /* border-radius: 3px; */
}

.logo-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.logo-text {
  font-size: 13px;
  font-weight: bold;
  color: #00e5ff;
  letter-spacing: 2px;
}

.system-title {
  font-size: 20px;
  font-weight: 500;
  color: rgba(180, 220, 255, 0.95);
  letter-spacing: 2px;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-tab {
  padding: 6px 20px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.6);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-tab:hover {
  color: #00e5ff;
  border-color: rgba(0, 229, 255, 0.2);
}

.nav-tab.active {
  color: #00e5ff;
  background: rgba(0, 229, 255, 0.12);
  border-color: rgba(0, 229, 255, 0.35);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-link {
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: rgba(180, 220, 255, 0.7);
  font-size: 12px;
  cursor: pointer;
}

.nav-link:hover {
  color: #00e5ff;
}

.logout-btn {
  padding: 4px 14px;
  background: rgba(0, 120, 200, 0.4);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 3px;
  color: rgba(180, 220, 255, 0.9);
  font-size: 12px;
  cursor: pointer;
}

.logout-btn:hover {
  background: rgba(0, 140, 220, 0.7);
  border-color: #00e5ff;
}

.page-content {
  flex: 1;
  min-height: 0;
}

.about-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.about-dialog {
  width: 480px;
  background: rgba(17, 47, 83, 0.95);
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 6px;
  backdrop-filter: blur(10px);
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
}

.about-title {
  font-size: 14px;
  letter-spacing: 2px;
  color: rgba(180, 220, 255, 0.9);
}

.about-close {
  background: none;
  border: none;
  color: rgba(180, 220, 255, 0.6);
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.about-close:hover {
  color: #00e5ff;
}

.about-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.about-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.about-label {
  font-size: 12px;
  color: rgba(180, 220, 255, 0.6);
}

.about-value {
  font-size: 13px;
  color: rgba(180, 220, 255, 0.9);
  line-height: 1.6;
}
</style>