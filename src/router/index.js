import { createRouter, createWebHistory } from "vue-router";
import TripBoardView from "../views/TripBoardView.vue";
import MapRestoView from "../views/MapRestoView.vue";
import BoardList from "@/components/tripboard/BoardList.vue";
import BoardWrite from "@/components/tripboard/BoardWrite.vue";
import BoardDetail from "@/components/tripboard/BoardDetail.vue";
import BoardModify from "@/components/tripboard/BoardModify.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/attraction",
      name: "attraction",
      component: () => import("@/views/AttractionView.vue"),
    },
    {
      path: "/tripboard",
      name: "trip-board",
      component: TripBoardView,
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
    {
      path: "/member",
      name: "member",
      component: () => import("@/views/MemberView.vue"),
      redirect: { name: "member" },
      children: [
        {
          path: "login",
          name: "member-login",
          component: () => import("@/views/LoginView.vue"),
        },
        {
          path: "signup",
          name: "member-signup",
          component: () => import("@/views/SignupView.vue"),
        },
        {
          path: "modify",
          name: "member-modify",
          component: () => import("@/components/Member/MemberModifyInfo.vue"),
        },
        {
          path: "modify/info",
          name: "member-modify-info",
          component: () => import("@/components/Member/MemberModifyInfo.vue"),
        },
        {
          path: "modify/pw",
          name: "member-modify-pw",
          component: () => import("@/components/Member/MemberModifyPW.vue"),
        },
      ],
    },
    {
      path: "/mapresto",
      name: "mapresto",
      component: MapRestoView,
      redirect: { name: "mapresto-list" },
      children: [
        {
          path: "list",
          name: "mapresto-list",
          component: () => import("@/components/mapresto/MapRestoList.vue"),
        },
        {
          path: "register",
          name: "mapresto-register",
          component: () => import("@/components/mapresto/MapRestoReg.vue"),
        },
      ],
    },
  ],
});

export default router;
