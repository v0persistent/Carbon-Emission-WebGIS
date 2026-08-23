<template>
  <AuthLayout>
    <div class="login-card">
      <h2>登录</h2>
      <div class="form-item">
        <label>用户名</label>
        <input v-model="username" type="text" placeholder="请输入用户名" />
      </div>
      <div class="form-item">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="请输入密码" />
      </div>
      <button class="login-btn" @click="handleLogin">登录</button>
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import { useAuthStore } from '../auth/stores/authStore'

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  errorMsg.value = ''
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/dashboard')
  } else {
    errorMsg.value = '账号或密码错误'
  }
}
</script>

<style scoped>
.login-card {
  width: 360px;
  padding: 40px 32px;
  background: rgba(2, 20, 40, 0.9);
  border: 1px solid rgba(0, 180, 255, 0.2);
  border-radius: 8px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 32px;
  color: #e0f7ff;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #8ec8e8;
}

.form-item input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 30, 60, 0.8);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 4px;
  color: #e0f7ff;
  font-size: 14px;
  outline: none;
}

.form-item input:focus {
  border-color: rgba(0, 180, 255, 0.7);
}

.login-btn {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  background: rgba(0, 120, 200, 0.6);
  border: 1px solid rgba(0, 180, 255, 0.4);
  border-radius: 4px;
  color: #e0f7ff;
  font-size: 16px;
  cursor: pointer;
}

.login-btn:hover {
  background: rgba(0, 140, 220, 0.8);
}

.error-msg {
  margin-top: 12px;
  text-align: center;
  color: #ff6b6b;
  font-size: 14px;
}
</style>
