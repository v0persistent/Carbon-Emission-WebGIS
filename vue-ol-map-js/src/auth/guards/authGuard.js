import { useAuthStore } from '../stores/authStore'

export function authGuard(router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.path !== '/login' && !authStore.isLogin) {
      return '/login'
    }

    if (to.path === '/login' && authStore.isLogin) {
      return '/dashboard'
    }
  })
}
