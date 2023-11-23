<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import MapRestoListItem from "./item/MapRestoListItem.vue";
import { listMapResto } from "@/api/map-resto.js";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();
const router = useRouter();

const { getUserId } = storeToRefs(memberStore);

const moveRegMapResto = () => {
  router.push({ name: "makemap" });
};

const listCount = ref(0);
const totalMapResto = ref(12);
const maxPage = ref(1);
const mapRestoList = ref([]);
const mapRestoParam = ref({
  // num: 0,
  // total: 12,
  userId: memberStore.getUserId,
  num: listCount.value,
  total: totalMapResto.value,
  checkUserId: "",//나의 맛지도만 불러오기
    orderkey: "like_count",//정렬할 키
    ordervalue: "desc"//내림차순, 오름차순
});

onMounted(() => {
  getMapRestoList();
});

const getMapRestoList = () => {
  console.log("getUserId : ", getUserId.value);
  console.log("getMapRestoList userId: ", memberStore.getUserId);
  listMapResto(
    mapRestoParam.value,
    ({ data }) => {
      mapRestoList.value = data.list;
      // totalMapResto.value = data.total;
      mapRestoParam.value.total = data.total;
      maxPage.value = Math.floor(mapRestoParam.value.total / 12);
    },
    (error) => console.log("getMapRestoList error: ", error)
  );
  console.log("목록 보기");
};

const addList = () => {
  if (maxPage.value > listCount.value) {
    mapRestoParam.value.num++;
    getMapRestoList();
  }
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="row align-self-center mb-2">
          <div class="col-md-5 offset-5">
            <!-- <label>검색 또는 필터</label><input type="text" /> -->
            <!-- <form class="d-flex" @submit.prevent="getArticleList">
              <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
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
          <ul class="mapRestoCard">
            <MapRestoListItem
              v-for="mapResto in mapRestoList"
              :key="mapResto.mapRestoNo"
              :mapResto="mapResto"
            ></MapRestoListItem>
          </ul>
          <div class="more text-center">
            <button
              class="btn btn-outline-success"
              type="button"
              @click="addList"
            >
              더보기+
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mapRestoCard {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
}
</style>
