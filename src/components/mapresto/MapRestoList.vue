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

const like = ref(false);
const isChecked = ref(false);
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
  orderkey: "register_time",//정렬할 키
  ordervalue: "desc"//내림차순, 오름차순
});

onMounted(() => {
  getMapRestoList();
});

const getMapRestoList = () => {
  // console.log("isChecked: ", isChecked.value);
  console.log("getUserId : ", getUserId.value);
  console.log("getMapRestoList userId: ", memberStore.getUserId);
  if (isChecked.value) {
    console.log("내것만 불러와");
    mapRestoParam.value.checkUserId = memberStore.getUserId;
  } else {
    mapRestoParam.value.checkUserId = "";
    console.log("모두 불러와");
  }

  if (like.value) {
    console.log("좋아요 순");
    mapRestoParam.value.orderkey = "like_count";
    mapRestoParam.value.ordervalue = "desc";
  } else if(old.value) {
    console.log("오래된 순");
    mapRestoParam.value.orderkey = "register_time";
    mapRestoParam.value.ordervalue = "";
  } else {
    console.log("최신순");
    mapRestoParam.value.orderkey = "register_time";
    mapRestoParam.value.ordervalue = "desc";
  } 
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

watch(
  () => isChecked.value,
  () => {
    getMapRestoList();
  },
);

const addList = () => {
  if (maxPage.value > listCount.value) {
    mapRestoParam.value.num++;
    getMapRestoList();
  }
};

// options 관련

const optionCount = ref(0);
const recent = ref(false);
const old = ref(false);
const clickOptions1 = () => {
  if (like.value === false) {
    if (optionCount.value > 0) {
      recent.value = false;
      old.value = false;
    }

    optionCount.value += 1;
    like.value = true;
  } else {
    optionCount.value -= 1;
    like.value = false;
  }

  console.log(like.value);
  getMapRestoList();
};

const clickOptions2 = () => {
  if (recent.value === false) {
    if (optionCount.value > 0) {
      like.value = false;
      old.value = false;
    }
    optionCount.value += 1;
    recent.value = true;
  } else {
    optionCount.value -= 1;
    recent.value = false;
  }
  getMapRestoList();
};

const clickOptions3 = () => {
  if (old.value === false) {
    if (optionCount.value > 0) {
      recent.value = false;
      like.value = false;
    }
    optionCount.value += 1;
    old.value = true;
  } else {
    optionCount.value -= 1;
    old.value = false;
  }
  getMapRestoList();
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <!-- <div class="row align-self-center mb-2"> -->
      <div id="btn_sticky" class="d-flex justify-content-between">
        <div>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="moveRegMapResto"
          >
            맛지도 등록
          </button>
        </div>
        <!-- 최신순, 좋아요순, 오래된순-->
        <div class="mx-3">
          <template v-if="memberStore.getUserId != null">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="isChecked"/>My
            <span class="checkmark"></span>
          </label>
        </template>
          <div
            class="btn mx-2"
            :class="{
              'btn-danger': like,
              'btn-outline-danger': !like,
            }"
            @click="clickOptions1()"
          >
            좋아요 순
          </div>
          <div
            class="btn mx-2"
            :class="{
              'btn-danger': recent,
              'btn-outline-danger': !recent,
            }"
            @click="clickOptions2()"
          >
            최신순
          </div>
          <div
            class="btn ml-2"
            :class="{
              'btn-danger': old,
              'btn-outline-danger': !old,
            }"
            @click="clickOptions3()"
          >
            오래된 순
          </div>
        </div>
      </div>
      <!-- </div> -->
      <div class="col-lg-12">
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

#btn_sticky {
  position: sticky;
  top: 100px; /* 화면 상단에서의 위치 조절 */
  background-color: rgb(255, 255, 255); /* 배경색 지정 */
  padding: 30px;
}

.custom-checkbox {
  display: inline-block;
  cursor: pointer;
  position: relative;
  padding-left: 50px;
  margin-right: 15px;
}

/* 기본 체크박스 숨기기 */
.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* 커스텀 체크박스 디자인 */
.checkmark {
  position: absolute;
  top: 3px;
  left: 20px;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
}

/* 체크 표시 스타일 */
.custom-checkbox input:checked ~ .checkmark:after {
  content: "";
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 20%;
  background-color: #ff4151;
}
</style>
