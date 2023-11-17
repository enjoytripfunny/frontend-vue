<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MapRestoListItem from "./item/MapRestoListItem.vue";
import { listMapResto } from "@/api/map-resto.js";

const router = useRouter();

const moveRegMapResto = () => {
  router.push({ name: "trip-board-write" });
};

const listCount = ref(1);

const mapRestoList = ref([]);

onMounted(() => {
  getMapRestoList();
});

const getMapRestoList = () => {
  listMapResto(
    { num: listCount.value },
    ({data}) => {
      listCount.value++;
      mapRestoList.value = data;
      console.log("getMapRestoList data: ", data);
    },
    (error) => console.log("getMapRestoList error: ", error)
  );
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">맛지도</mark>
        </h2>
      </div>
      <div class="col-lg-10">
        <div class="row align-self-center mb-2">
          <div class="col-md-5 offset-5">
            <label>검색 또는 필터</label><input type="text" />
            <!-- <form class="d-flex" @submit.prevent="getArticleList">
              <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
              <div class="input-group input-group-sm">
                <input
                  type="text"
                  class="form-control"
                  v-model="param.word"
                  placeholder="검색어..."
                />
                <button
                  class="btn btn-dark"
                  type="button"
                  @click="getArticleList"
                >
                  검색
                </button>
              </div>
            </form> -->
          </div>
          <div class="col-md-2 text-start">
            <button
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="moveRegMapResto"
            >
              맛지도 등록
            </button>
          </div>
        </div>

        <div class="row align-self-center mb-2">
          <ul class="marRestoCard">
            <MapRestoListItem
              v-for="mapResto in mapRestoList"
              :key="mapResto.mapRestoNo"
              :mapResto="mapResto"
            ></MapRestoListItem>
          </ul>
          <div class="more text-center">
            <button class="btn btn-outline-success" type="button">
              더보기+
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marRestoCard {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
}
</style>