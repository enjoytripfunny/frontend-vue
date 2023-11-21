<script setup>
import { listMyMapResto, listLikeMapResto } from "@/api/map-resto.js";
import { onMounted, ref, watch } from "vue";
import MapRestoCombineListItem from "./item/MapRestoCombineListItem.vue";

const myMapList = ref([]);
const likeMapList = ref([]);
const myMapPage = ref(0);
const likeMapPage = ref(0);

const myMapResto = () => {
  listMyMapResto(
    {
      num: 1,
      userId: "ssafy",
    },
    ({ data }) => {
      myMapList.value = data.myMapList;
      console.log("listMyMapResto data: ", myMapList.value);
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
    ({ data }) => {
      likeMapList.value = data.likeMapList;
      console.log("listLikeMapResto data: ", data);
    },
    (error) => console.log("listLikeMapResto error: ", error)
  );
};

onMounted(() => {
  myMapResto();
  likeMapResto();
});

const prePage = (num) => {};
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
        <div class="row map-list">
          <h3>나의 지도 리스트</h3>

          <ul class="mapRestoCard">
            <img src="@/assets/img/left.png" class="pre-button" />
            <!-- <button class="mapPage">pre</button> -->
            <MapRestoCombineListItem
              v-for="mapResto in myMapList"
              :key="mapResto.mapRestoNo"
              :mapResto="mapResto"
            >
            </MapRestoCombineListItem>
            <!-- <button class="mapPage">next</button> -->
            <img src="@/assets/img/right.png" class="next-button" />
          </ul>
        </div>
        <div class="row">
          <h3>좋아요 지도 리스트</h3>
          <ul class="mapRestoCard">
            <img src="@/assets/img/left.png" class="pre-button" />
            <MapRestoCombineListItem
              v-for="mapResto in likeMapList"
              :key="mapResto.mapRestoNo"
              :mapResto="mapResto"
            >
            </MapRestoCombineListItem>
            <img src="@/assets/img/right.png" class="next-button" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mapRestoCard {
  list-style-type: none;
  display: flex;
  /* flex-wrap: wrap; */
}

.map-list {
  background-color: rgb(250, 247, 247);
}

.pre-button,
.next-button {
  height: 25px;
  widows: 25px;
}
</style>