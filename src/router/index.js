import { createRouter, createWebHistory } from "vue-router";
import TripBoardView from "../views/TripBoardView.vue";
import BoardList from "@/components/tripboard/BoardList.vue";
import BoardWrite from "@/components/tripboard/BoardWrite.vue";
import BoardDetail from "@/components/tripboard/BoardDetail.vue";
import BoardModify from "@/components/tripboard/BoardModify.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/tripboard",
      name: "trip-board",
      component: TripBoardView,
      // redirect: "/r06/board/list",
      redirect: { name: "trip-board-list" },
      children: [
        {
          path: "list",
          name: "trip-board-list",
          component: BoardList,
          // component: () => import("@/components/tripboard/BoardList.vue"),
        },
        {
          path: "write",
          name: "trip-board-write",
          component: BoardWrite,
          // component: () => import("@/components/tripboard/BoardWrite.vue"),
        },
        {
          path: "modify/:articleno",
          name: "trip-board-modify",
          component: BoardModify,
          // component: () => import("@/components/tripboard/BoardModify.vue"),
        },
        {
          path: "detail/:articleno",
          name: "trip-board-detail",
          component: BoardDetail,
          // component: () => import("@/components/tripboard/BoardDetail.vue"),
        },
      ],
    },
  ],
});

export default router;
