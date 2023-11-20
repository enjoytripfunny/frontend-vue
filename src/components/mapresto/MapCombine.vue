<script setup>
import { listMyMapResto, listLikeMapResto } from "@/api/map-resto.js";
import { onMounted } from "vue";

const myMapResto = () => {
  listMyMapResto(
    {
      num: 1,
      userId: "ssafy",
    },
    (response) => {
      console.log("listMyMapResto response: ", response);
    },
    (error) => console.log("listMyMapResto error: ", error)
  );
};

const likeMapResto = () => {
  listLikeMapResto(
    {
      num: 1,
      userId: "ssafy",
    },
    (response) => {
      console.log("listLikeMapResto response: ", response);
    },
    (error) => console.log("listLikeMapResto error: ", error)
  );
};

onMounted(() => {
  myMapResto();
  likeMapResto();
});
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">지도 Combine</mark>
        </h2>
      </div>
      <div class="col-lg-6">
        <img
          src="@/assets/231120/dc63959c-e527-4d84-b53c-65261d2acf78.jpg"
          style="width: 600px; height: 600px"
        />
      </div>
      <div class="col-lg-6">
        <div class="row">
          <h3>나의 지도 리스트</h3>
        </div>
        <div class="row">
          <h3>좋아요 지도 리스트</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>