<script setup>
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useMenuStore } from "@/stores/menu";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const menuStore = useMenuStore();
const memberStore = useMemberStore();
const router = useRouter();
// 반응형을 유지하면서 스토어에서 속성을 추출하려면, storeToRefs()를 사용
// https://pinia.vuejs.kr/core-concepts/
const { menuList } = storeToRefs(menuStore);
const { getUserName, getUserId } = storeToRefs(memberStore);
const { userLogout } = memberStore;
// const { getUserName } = memberStore;
const { changeMenuState } = menuStore;

const logout = () => {
  console.log("로그아웃!!!!");
  localStorage.clear();
  sessionStorage.clear();
  console.log("로그아웃하는 아이디: ", getUserId.value);
  changeMenuState();
  userLogout(getUserId.value);
  router.push({ name: "home" });
};
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top">
    <div class="container-fluid d-flex justify-content-between">
      <!-- 반응형 웹에 사용되는 속성, 그리드 시스템과 함께 사용 -->

      <div style="margin-left: 30px; padding-top: 20px">
        <ul
          class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
          style="--bs-scroll-height: 100px"
        >
          <li class="nav-item nav-item-margin">
            <router-link to="/" class="navbar-brand" href="#">
              <img
                src="@/assets/img/logo.png"
                class="rounded mx-auto d-block"
                alt="..."
                width="40"
              />
            </router-link>
          </li>
          <li class="nav-item nav-item-margin">
            <router-link
              :to="{ name: 'mapresto-list' }"
              class="nav-link"
              href="#"
              >맛지도 보기</router-link
            >
          </li>
          <li class="nav-item nav-item-margin">
            <router-link :to="{ name: 'makemap' }" class="nav-link"
              >맛지도 등록</router-link
            >
          </li>
          <li class="nav-item nav-item-margin">
            <router-link
              :to="{ name: 'mapresto-combine' }"
              class="nav-link"
              href="#"
              >지도 합치기</router-link
            >
          </li>
        </ul>
      </div>

      <div>
        <!-- 로그인 X -->
        <div v-if="!menuList[0].show">
          <router-link to="/member/signup">
            <button
              class="btn btn-outline-success"
              type="button"
              style="margin-right: 20px"
            >
              회원가입
            </button>
          </router-link>
          <router-link to="/member/login">
            <button
              class="btn btn-outline-success"
              type="button"
              style="margin-right: 30px"
            >
              로그인
            </button>
          </router-link>
        </div>

        <!-- 로그인 O -->
        <div v-else class="dropdown">
          <a
            class="btn dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <!-- {{ memberStore.getUserName }}님 -->
            {{ getUserName }}님
          </a>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <a class="dropdown-item" href="#" @click="logout">로그아웃</a>
            </li>

            <li>
              <!-- <router-link :to="{ name: 'member-modify' }">마이페이지</router-link> -->
              <router-link :to="{ name: 'member-modify' }" class="nav-link"
                >마이페이지</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-item-margin {
  margin-right: 10px;
}
</style>