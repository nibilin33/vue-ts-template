export default [
    {
        path: '/ume/test',
        name: 'testTheme',
        component: () => import(/* webpackChunkName: "pc" */ '@/views/error/pc-test.vue'),
    },
];
