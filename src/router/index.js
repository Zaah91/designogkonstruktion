import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SettingsView from '@/views/SettingsView.vue';
import SupportView from '@/views/SupportView.vue';
import CommunityView from '@/views/CommunityView.vue';
import ForumView from '@/views/ForumView.vue';

import AdminPanel from '@/views/AdminPanel.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/indstillinger',
    name: 'Settings',
    component: SettingsView,
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportView,
  },
  {
    path: '/community/:id',
    name: 'Community',
    component: CommunityView,
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: ForumView,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/vfl/' : '/'), // Brug history-mode for at fjerne hash fra URL'en
  routes,
});

export default router;