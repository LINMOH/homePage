import { createRouter, createWebHistory } from 'vue-router';
import HomeContent from '../components/HomeContent.vue';
import LogContent from '../components/LogContent.vue';
import BlogContent from '../components/BlogContent.vue';
import BlogDetail from '../components/BlogDetail.vue';
import NotFound from '../components/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeContent
  },
  {
    path: '/log',
    name: 'log',
    component: LogContent
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogContent
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: BlogDetail,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

export default router;