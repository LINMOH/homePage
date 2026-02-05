import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/MainLayout.vue';
import BlogDetail from '../components/BlogDetail.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        // 默认显示首页
      },
      {
        path: 'blog',
        name: 'blog',
        // 博客列表页
      }
    ]
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: BlogDetail,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;