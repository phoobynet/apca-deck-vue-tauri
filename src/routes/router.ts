import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@/routes/dashboard/Dashboard.vue'

export const router = createRouter({
  routes: [
    {
      path: '/',
      component: Dashboard,
      name: 'Dashboard',
    },
  ],
  history: createWebHashHistory(),
})
