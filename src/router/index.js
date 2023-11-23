import { createRouter, createWebHistory } from "vue-router";
import TripBoardView from "../views/TripBoardView.vue";
import MapRestoView from "../views/MapRestoView.vue";
import BoardList from "@/components/tripboard/BoardList.vue";
import BoardWrite from "@/components/tripboard/BoardWrite.vue";
import BoardDetail from "@/components/tripboard/BoardDetail.vue";
import BoardModify from "@/components/tripboard/BoardModify.vue";

import { storeToRefs } from "pinia";
import { useMemberStore } from "../stores/member";

const onlyAuthUser = async (to, from, next) => {
  const memberStore = useMemberStore();
  const { userInfo, isValidToken } = storeToRefs(memberStore);
  const { getUserInfo } = memberStore;

  let token = sessionStorage.getItem("accessToken");

  if (userInfo.value != null && token) {
    await getUserInfo(token);
  }
  if (!isValidToken.value || userInfo.value === null) {
    alert("로그인 후 이용가능합니다.");
    // next({ name: "member-login" });
  } else {
    next();
  }
};

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
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/Member/MemberModifyInfo.vue"),
        },
        {
          path: "modify/info",
          name: "member-modify-info",
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/Member/MemberModifyInfo.vue"),
        },
        {
          path: "modify/pw",
          name: "member-modify-pw",
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/Member/MemberModifyPW.vue"),
        },
      ],
    },
    {
      path: "/makemap",
      name: "makemap",
      beforeEnter: onlyAuthUser,
      component: () => import("@/components/Attraction/MakeMap.vue"),
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
          path: "combine",
          name: "mapresto-combine",
          beforeEnter: onlyAuthUser,
          component: () => import("@/components/mapresto/MapCombine.vue"),
        },
        {
          path: "view/:maprestono",
          name: "mapresto-view",
          component: () => import("@/components/mapresto/MapRestoView.vue"),
        },
      ],
    },
  ],
});

export default router;
