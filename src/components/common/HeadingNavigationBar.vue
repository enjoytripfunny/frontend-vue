<script setup>
defineProps({
  userName: String,
});
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
            <router-link to="/attraction" class="nav-link" href="#"
              >지도</router-link
            >
          </li>
          <li class="nav-item nav-item-margin">
            <router-link :to="{ name: 'trip-board' }" class="nav-link"
              >게시판</router-link
            >
          </li>

          <li class="nav-item nav-item-margin">
            <form class="d-flex" role="search">
              <input
                class="form-control me-2"
                type="search"
                placeholder="검색..."
                aria-label="Search"
              />
              <button class="btn btn-outline-success" type="button">
                search
              </button>
            </form>
          </li>
        </ul>
      </div>

      <!-- 로그인 X -->
      <button
        class="btn btn-outline-success"
        type="button"
        style="margin-right: 30px"
      >
        로그인
      </button>

      <!-- 로그인 O -->
      <!-- <div class="dropdown">
        <a
          class="btn dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          사용자님 {{ userName }}
        </a>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li><a class="dropdown-item" href="#">로그아웃</a></li>
          <li><a class="dropdown-item" href="#">마이페이지</a></li>
        </ul>
      </div> -->
    </div>
  </nav>
</template>

<style scoped>
.nav-item-margin {
  margin-right: 10px;
}
</style>
