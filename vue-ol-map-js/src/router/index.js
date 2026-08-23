import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import MapPage from '../pages/MapPage.vue'
import CarbonAnalysisDashboard from '../components/dashboard/CarbonAnalysisDashboard.vue'
import { authGuard } from '../auth/guards/authGuard.js'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/map',
    redirect: '/dashboard/map'
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    children: [
      { path: '', redirect: '/dashboard/map' },
      { path: 'map', component: MapPage },
      { path: 'analysis', component: CarbonAnalysisDashboard }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

authGuard(router)

export default router
