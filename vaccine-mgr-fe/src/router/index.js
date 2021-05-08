import { createRouter, createWebHashHistory } from 'vue-router';
import { user } from '@/service';
import store from '@/store';
import { message } from 'ant-design-vue';

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth/index.vue'),
  },
  {
    path: '/',
    name: 'BasicLayout',
    redirect: '/auth',
    component: () => import(/* webpackChunkName: "BasicLayout" */ '../layout/BasicLayout/index.vue'),
    children: [
      {
        path: 'vaccines',
        name: 'Vaccines',
        component: () => import(/* webpackChunkName: "Vaccines" */ '../views/Vaccines/index.vue'),
      },
      {
        path: 'vaccines/:id',
        name: 'VaccineDetail',
        component: () => import(/* webpackChunkName: "VaccineDetail" */ '../views/VaccineDetail/index.vue'),
      },
      {
        path: 'user',
        name: 'User',
        component: () => import(/* webpackChunkName: "User" */ '../views/Users/index.vue'),
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import(/* webpackChunkName: "Log" */ '../views/Log/index.vue'),
      },
      {
        path: 'reset/password',
        name: 'ResetPassword',
        component: () => import(/* webpackChunkName: "ResetPassword" */ '../views/ResetPassword/index.vue'),
      },
      {
        path: 'invite-code',
        name: 'InviteCode',
        component: () => import(/* webpackChunkName: "InviteCode" */ '../views/InviteCode/index.vue'),
      },
      {
        path: 'vaccine-classify',
        name: 'VaccineClassify',
        component: () => import(/* webpackChunkName: "VaccineClassify" */ '../views/VaccineClassify/index.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "Profile" */ '../views/Profile/index.vue'),
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "Dashboard" */ '../views/Dashboard/index.vue'),
      },
      {
        path: 'repStatistics',
        name: 'RepStatistics',
        component: () => import(/* webpackChunkName: "Dashboard" */ '../views/RepStatistics/index.vue'),
      }
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  let res = {};

  try {
    res = await user.info();
  } catch (e) {
    if (e.message.includes('code 401')) {
      res.code = 401;
    }
  }

  const { code } = res;

  if (code === 401) {
    if (to.path === '/auth') {
      next();
      return;
    }

    message.error('认证失败，请重新登入');
    next('/auth');

    return;
  }

  if (!store.state.characterInfo.length) {
    await store.dispatch('getCharacterInfo');
  }

  const reqArr = [];

  if (!store.state.userInfo.account) {
    reqArr.push(store.dispatch('getUserInfo'));
  }

  if (!store.state.vaccineClassify.length) {
    reqArr.push(store.dispatch('getVaccineClassify'));
  }

  await Promise.all(reqArr);

  if (to.path === '/auth') {
    next('/vaccines');
    return;
  }

  next();
});

export default router;
