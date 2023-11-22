<script setup>
import { listMyMapResto, listLikeMapResto } from "@/api/map-resto.js";
import { onMounted, ref, watch } from "vue";
import MapRestoCombineListItem from "./item/MapRestoCombineListItem.vue";
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useMemberStore } from '@/stores/member';
import { useRouter } from 'vue-router';

const router = useRouter();
const memberStore = useMemberStore();
const myMapList = ref([]);
const likeMapList = ref([]);
const totalMyMapResto = ref();
const totalLikeMapResto = ref();
const myMapPage = ref(0);
const likeMapPage = ref(0);

const myMapResto = () => {
  listMyMapResto(
    {
      num: myMapPage.value,
      userId: memberStore.getUserId,
    },
    ({ data }) => {
      myMapList.value = data.myMapList;
      totalMyMapResto.value = Math.floor(data.totalMyMapResto / 4);
      console.log("listMyMapResto data: ", myMapList.value);
    },
    (error) => console.log("listMyMapResto error: ", error)
  );
};

const likeMapResto = () => {
  listLikeMapResto(
    {
      num: likeMapPage.value,
      userId: memberStore.getUserId,
    },
    ({ data }) => {
      likeMapList.value = data.likeMapList;
      totalLikeMapResto.value = Math.floor(data.totalLikeMapResto / 4);
      console.log("listLikeMapResto data: ", data);
    },
    (error) => console.log("listLikeMapResto error: ", error)
  );
};

onMounted(() => {
  myMapResto();
  likeMapResto();
});

// 내가 작성한 맛지도 - 이전 페이지 버튼
const prePageMySelect = () => {
  if (myMapPage.value != 0) {
    myMapPage.value--;
    myMapResto();
  }
};
// 내가 작성한 맛지도 - 이후 페이지 버튼
const nextPageMySelect = () => {
  if (totalMyMapResto.value != myMapPage.value) {
    myMapPage.value++;
    myMapResto();
  }
};

// 좋아요 누른 맛지도 - 이전 페이지 버튼
const prePageLikeSelect = () => {
  if (likeMapPage.value != 0) {
    likeMapPage.value--;
    likeMapResto();
  }
};
// 좋아요 누른 맛지도 - 이후 페이지 버튼
const nextPageLikeSelect = () => {
  if (totalLikeMapResto.value != likeMapPage.value) {
    likeMapPage.value++;
    likeMapResto();
  }
};

// 지도 캡처
const captureMap = async () => {
  const captureArea = document.getElementById("captureMapArea");
  const canvas = await html2canvas(captureArea);
  const imgBase64 = canvas.toDataURL();
  // const imgBase64 = canvas.toDataURL('image/jpeg', 'image/octet-stream');
  const decodImg = atob(imgBase64.split(',')[1]);

  let array = [];
  for (let i = 0; i < decodImg .length; i++) {
    array.push(decodImg .charCodeAt(i));
  }

  const file = new Blob([new Uint8Array(array)], {type: 'image/png'});
  const fileName = 'capture_img_' + new Date().getMilliseconds() + '.png';
  let formData = new FormData();
  formData.append('file', file, fileName);
  formData.append("userId", "ssafy");
  formData.append("subject", "화면 캡처 테스트");
  formData.append("content", "화면 캡처 테스트");
  formData.append("tags", ["대전", "서울"]);

  axios
    .post("http://localhost:9090/mapresto/reg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json;charset=utf-8",
      },
    })
    // {
    //   params: restoMap.value,
    //   // params: postData.value,
    // })
    .then((response) => {
      console.log(response);
      router.push({ name: "mapresto-list" });
    })
    .catch((error) => console.log(error));

  
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">지도 Combine</mark>
        </h2>
      </div>
      <div class="col-lg-6" id = "captureMapArea">
        <img
          src="@/assets/231120/dc63959c-e527-4d84-b53c-65261d2acf78.jpg"
          style="width: 600px; height: 600px"
        />
        <button @click="captureMap">Capture</button>
      </div>
      <div class="col-lg-6">
        <div class="row map-list">
          <h3>나의 지도 리스트</h3>
          <ul class="mapRestoCard">
            <img
              src="@/assets/img/left.png"
              class="pre-button"
              @click="prePageMySelect"
            />
            <!-- <button class="mapPage">pre</button> -->
            <MapRestoCombineListItem
              v-for="mapResto in myMapList"
              :key="mapResto.mapRestoNo"
              :mapResto="mapResto"
            >
            </MapRestoCombineListItem>
            <!-- <button class="mapPage">next</button> -->
            <img
              src="@/assets/img/right.png"
              class="next-button"
              @click="nextPageMySelect"
            />
          </ul>
        </div>
        <div class="row map-list">
          <h3>좋아요 지도 리스트</h3>
          <ul class="mapRestoCard">
            <img
              src="@/assets/img/left.png"
              class="pre-button"
              @click="prePageLikeSelect"
            />
            <MapRestoCombineListItem
              v-for="mapResto in likeMapList"
              :key="mapResto.mapRestoNo"
              :mapResto="mapResto"
            >
            </MapRestoCombineListItem>
            <img
              src="@/assets/img/right.png"
              class="next-button"
              @click="nextPageLikeSelect"
            />
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
  margin: 20px;
  /* display: flex; */
}

.pre-button,
.next-button {
  height: 25px;
  widows: 25px;
}
</style>