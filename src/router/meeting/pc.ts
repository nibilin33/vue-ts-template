export default [
    {
        path: '/ume/meeting',
        name: 'meetingindex',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "pc" */ '@/views/meeting/platform/pc/app.vue'),
        children: [
            {
                path: '/ume/room',
                component: () => import(/* webpackChunkName: "notice" */ '@/views/meeting/platform/pc/room.vue'),
            },
            {
                path: '/ume/video',
                component: () => import(/* webpackChunkName: "notice" */ '@/views/meeting/platform/pc/video.vue'),
            },
        ],
    },
];
