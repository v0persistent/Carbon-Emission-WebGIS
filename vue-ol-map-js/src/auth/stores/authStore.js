import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const isLogin = ref(!!localStorage.getItem('token'))
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  async function login(username, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const result = await response.json()
      if (result.code !== 200) return false

      const { token: jwt, userInfo: info } = result.data
      token.value = jwt
      isLogin.value = true
      userInfo.value = info
      localStorage.setItem('token', jwt)
      localStorage.setItem('userInfo', JSON.stringify(info))
      return true
    } catch {
      return false
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` }
      })
    } catch {
      // 即使服务端请求失败也不影响本地退出
    }
    token.value = ''
    isLogin.value = false
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return { token, isLogin, userInfo, login, logout }
})
