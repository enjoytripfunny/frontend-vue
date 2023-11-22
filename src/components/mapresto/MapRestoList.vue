<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import MapRestoListItem from "./item/MapRestoListItem.vue";
import { listMapResto } from "@/api/map-resto.js";
import { useMemberStore } from '@/stores/member';
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();
const router = useRouter();

const { getUserId } = storeToRefs(memberStore);

const moveRegMapResto = () => {
  router.push({ name: "makemap" });
};

const listCount = ref(1);
const totalMapResto = ref(12);
const maxPage = ref(1);
// const calMaxPage = computed(() => {
//   maxPage.value = Math.ceil(totalMapResto.value / 12);
// })
// watch(totalMapResto, (newData, oldData) => {
//   maxPage.value = Math.ceil(totalMapResto.value / 12);
//   console.log("maxPage.value: " + maxPage.value);
// });

const mapRestoList = ref([]);
const mapRestoParam = ref({
  num: 0,
  total: 12,
  userId: memberStore.getUserId,
  // num: listCount.value,
  // total: totalMapResto.value,
  // userId: "ssafy",
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
      maxPage.value = Math.ceil(mapRestoParam.value.total / 12);
    },
    (error) => console.log("getMapRestoList error: ", error)
  );
  console.log("목록 보기");
};

const addList = () => {
  if (totalMapResto.value >= listCount.value) {
    listCount.value = listCount.value + 1;
    getMapRestoList();
  }
  // if (maxPage.value >= listCount.value) {
  //   listCount.value++;
  //   getMapRestoList();
  // }
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