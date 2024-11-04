import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import SettingsView from '@/views/SettingsView.vue';
import SupportView from '@/views/SupportView.vue';
import CommunityView from '@/views/CommunityView.vue';
import ChatView from '@/views/ChatView.vue';
import ForumView from '@/views/ForumView.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/om',
    name: 'About',
    component: AboutView,
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
    path: '/community',
    name: 'Community',
    component: CommunityView,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
  },
  {
    path: '/forum',
    name: 'Forum',
    component: ForumView,
  },
];

const router = createRouter({
  history: createWebHistory(), // Brug history-mode for at fjerne hash fra URL'en
  routes,
});

export default router;