<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div>
    <!-- carousel -->
    <div id="carouselExampleCaptions" class="carousel slide">
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="@/assets/img/hanriver.jpg"
            class="d-block carousel-inner"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block carousel-text">
            <h3>Enjoy Trip</h3>
            <p>Let's travel together</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="@/assets/img/busan.jpg"
            class="d-block carousel-inner"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block carousel-text">
            <h3>Enjoy Trip</h3>
            <p>Let's travel together</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="@/assets/img/suwon2.jpg"
            class="d-block carousel-inner"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block carousel-text">
            <h3>Enjoy Trip</h3>
            <p>Let's travel together</p>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- 중앙 content 시작 -->
    <div class="m-5">
      <div class="row">
        <!-- <div class="container row" style="float: none: margin:100 auto;"> -->
        <!-- 중앙 left content start -->
        <div class="col-md-3 mt-auto mb-auto">
          <!--중앙 왼쪽 글씨 -->
          <div class="leftbox">
            <div class="middle-left-letter">
              <h4 class="font fw-bold">지역사랑!</h4>
              <h2 class="font fw-bold">우리지역 관광지</h2>
              <h6 class="font">
                우리지역의 숨어있는 아름다운 관광지를 알려드립니다.<br />관광지
                주변의 맛집, 숙박업소와 여행코스, 지역 축제등을 보실수도
                있습니다.
              </h6>
            </div>

            <!-- 중앙 왼쪽 버튼 -->
            <router-link to="/attraction">
              <button type="button" class="btn btn-primary">더보기...</button>
            </router-link>
          </div>
        </div>

        <!-- 중앙 center content start -->
        <div class="col-lg-9">
          <!-- 사진 3개 넣기 -->
          <div class="row">
            <!-- 첫번째 사진 -->
            <div class="our_area col-lg-4 col-md-6 col-sm-12 p-2">
              <img
                src="@/assets/img/suwon.jpg"
                alt=""
                class="h-100 w-100 object-fit-cover"
              />
            </div>
            <!-- 두번째 사진 -->
            <div class="our_area col-lg-4 col-md-6 col-sm-12 p-2">
              <img
                src="@/assets/img/suwon1.jpg"
                alt=""
                class="h-100 w-100 object-fit-cover"
              />
            </div>
            <!-- 세번째 사진 -->
            <div class="our_area col-lg-4 col-md-6 col-sm-12 p-2">
              <img
                src="@/assets/img/suwon2.jpg"
                alt=""
                class="h-100 w-100 object-fit-cover"
              />
            </div>
          </div>

          <!-- 사진 3개 넣기 -->
          <div class="row mt-3">
            <div class="our_area col-lg-4 col-md-6 col-sm-12 p-2">
              <img
                src="@/assets/img/kwangwhamoon.png"
                alt=""
                class="h-100 w-100 object-fit-cover"
              />
            </div>
            <!-- 두번째 사진 -->
            <div class="our_area col-lg-4 col-md-6 col-sm-12 p-2">
              <img
                src="@/assets/img/hanriver.jpg"
                alt=""
                class="h-100 w-100 object-fit-cover"
              />
            </div>
            <!-- 세번째 사진 -->
            <div class="our_area col-lg-4 col-md-6 col-sm-12 p-2">
              <img
                src="@/assets/img/busan.jpg"
                alt=""
                class="h-100 w-100 object-fit-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-inner img {
  width: 100%;
  height: auto;
  aspect-ratio: 2/1;
}

.carousel-text {
  color: whitesmoke;
}
</style>
