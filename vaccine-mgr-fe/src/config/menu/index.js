import _ from '../common';

export default [
  {
    title: '总览',
    url: '/dashboard',
    onlyAdmin: true,
  },
  {
    title: `${_.KEYWORD}管理`,
    url: '/vaccines',
    onlyAdmin: false,
  },
  {
    title: '用户管理',
    url: '/user',
    onlyAdmin: true,
  },
  {
    title: `数据统计`,
    url: '/RepStatistics',
    onlyAdmin: false,
  },
  {
    title: '操作日志',
    url: '/log',
    onlyAdmin: true,
  },
  {
    title: '其他',
    onlyAdmin: false,
    children: [
      {
        title: `${_.KEYWORD}分类管理`,
        url: '/vaccine-classify',
        onlyAdmin: true,
      },
      {
        title: '重制密码列表',
        url: '/reset/password',
        onlyAdmin: true,
      },
      {
        title: '邀请码管理',
        url: '/invite-code',
        onlyAdmin: true,
      },
    ],
  },
  {
    title: '个人设置',
    url: '/profile',
    onlyAdmin: false,
  },
];
