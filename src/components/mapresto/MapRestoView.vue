<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { getMapRestoView } from "@/api/map-resto.js";

const route = useRoute();
const { maprestono } = route.params;

const mapRestoView = ref({}); // 맛지도에 대한 설명 저장
const restoList = ref([]); // 맛지도에 저장된 식당들 저장

onMounted(() => {
  getMapResto();
});

// 맛지도에 대한 제목, 작성자, 내용, 작성 날짜, 식당들
const getMapResto = () => {
  getMapRestoView(
    maprestono,
    ({ data }) => {
      mapRestoView.value = data.mapResto; // 식당 제외 맛지도 데이터
      restoList.value = data.userRestoList;
      console.log("getMapResto data: ", data);
    },
    (error) => {
      console.error(error);
    }
  );
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">맛지도 View</mark>
        </h2>
      </div>
      <div class="col-lg-6">
        <!-- :src="`/src/assets/${mapRestoView.fileInfo.saveFolder}/${mapRestoView.fileInfo.saveFile}`" -->
        <div>지도존</div>
      </div>
      <div class="col-lg-6">
        <h3>{{ mapRestoView.subject }}</h3>
        <div>
          <span>{{ mapRestoView.userId }}</span>
        </div>
        <div>
          <span>{{ mapRestoView.registerTime }}</span>
        </div>
        <p>{{ mapRestoView.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>