<script setup>
import {
  listMyMapResto,
  listLikeMapResto,
  getMapRestos,
} from "@/api/map-resto.js";
import { onMounted, ref, toRaw, watch } from "vue";
import MapRestoCombineListItem from "./item/MapRestoCombineListItem.vue";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

const swiperOptions = ref({
  direction: "horizontal",
  loop: true,
});

const count = {
  count: false,
};

const mapRestoNo = defineEmits({ mapRestoNo: String });

const router = useRouter();
const memberStore = useMemberStore();

const myMapList = ref([]);
const likeMapList = ref([]);
const totalMyMapResto = ref();
const totalLikeMapResto = ref();
const myMapPage = ref(0);
const likeMapPage = ref(0);
const newMap = ref(new Map());

const myRestoList = ref();
const bookmarkRestoList = ref([]);
const addRestoList = ref([]);

const KAKAO_SERVICE_KEY = "066c4bf5fb8745fcc2b066ec145bb938";

const BASIC_IMG = "https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png";
const STAR_IMG =
  "https://user-images.githubusercontent.com/70050038/284016597-7a30594e-bf67-454b-af93-17b100054d02.png";
const CLICK_IMG =
  "https://user-images.githubusercontent.com/70050038/284038352-dfe61846-ac5e-4ccd-9f64-a738a50fbc9e.png";
const RED_STAR_IMG =
  "https://user-images.githubusercontent.com/70050038/284425565-a9fbb114-dba8-4b0e-93c9-769de765b914.png";

// 카카오 맵 관련 객체
const map = ref();
const infowindow = ref();
const ps = ref();
const bounds = ref(); // 마커에 따른 지도 범위 !!

// 마커 관련 객체
const basicMap = ref();
const starMap = ref(new Map());

// resto 관련
const mapRestoMap = ref(new Map());

// div id

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

const displayMarker = (data) => {
  starMap.value.set(data.restoApiId, [
    data,
    new kakao.maps.Marker({
      map: toRaw(map.value),
      position: new kakao.maps.LatLng(data.latitude, data.longitude),
      image: new kakao.maps.MarkerImage(
        RED_STAR_IMG,
        new kakao.maps.Size(31, 35)
      ),
    }),
  ]);
  const marker = starMap.value.get(data.restoApiId)[1];
  kakao.maps.event.addListener(marker, "click", () => {
    infowindow.value.close();

    const infowindowContent = `
        <div style="padding:3px 0px 0px 5px;" onclick="toLink">
          <a href="https://place.map.kakao.com/${data.restoApiId}" target="_blank">${data.restoName}</a></div>`;

    // 내 지도에 추가 버튼 클릭 시 실행되는 함수
    // 함수를 전역에 추가 !!!
    window.toLink = () => {
      console.log("내 지도에 추가 버튼이 클릭되었습니다!");

      console.log("?", marker);
      // 제거
      marker.setMap(null);
      starMap.value.delete(data.restoApiId);

      console.log("star map >> ", starMap.value);
      infowindow.value.close();
    };

    // 클릭 이벤트에 인포윈도우 표시
    infowindow.value = new kakao.maps.InfoWindow({
      zIndex: 1,
      content: infowindowContent,
      position: new kakao.maps.LatLng(data.latitude, data.longitude),
      removable: true,
    });
    infowindow.value.close();
    infowindow.value.open(map.value, marker);

    console.log("basic map ...", basicMap.value);
  });
};
const initMap = () => {
  // 인포윈도우 생성
  infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 });

  // 맵 생성
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(37.50378611, 127.0248221),
    level: 3,
  };

  map.value = new kakao.maps.Map(container, options);
  map.value.setMapTypeId(kakao.maps.MapTypeId.NORMAL);

  // start add control
  // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
  const mapTypeControl = new kakao.maps.MapTypeControl();
  map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
  const zoomControl = new kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  // end add control

  ps.value = new kakao.maps.services.Places(map.value);

  // 각 카테고리에 클릭 이벤트를 등록합니다
  addCategoryClickEvent();

  // 각 카테고리에 클릭 이벤트를 등록합니다
  function addCategoryClickEvent() {
    const category = document.getElementById("category");
    const children = category.children;

    for (var i = 0; i < children.length; i++) {
      children[i].onclick = onClickCategory;
    }
  }

  // 카테고리를 클릭했을 때 호출되는 함수입니다
  function onClickCategory() {
    // 카테고리 옵션 'X'
    if (this.id === "") {
      // delete markers
      if (basicMap.value.size > 0) {
        basicMap.value.forEach((key) => key.setMap(null));
      }
      // basicMarkers에서 marker 제거
      basicMap.value.clear();
      return;
    }

    // 카테고리 id FD6, CE7
    ps.value.categorySearch(this.id, categorySearch, {
      useMapBounds: true,
    });
  }

  //   ps.value = new kakao.maps.services.Places(map.value); // categorySearch(b, g, e), keywordSearch, setMap
  //   ps.value.categorySearch("FD6", placesSearchCB, { useMapBounds: true });

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function categorySearch(data, status) {
    console.log("category search !! ", data);

    if (status === kakao.maps.services.Status.OK) {
      console.log("success !!!");
    }

    console.log("baisc map after search ", basicMap.value);
  }
};
onMounted(() => {
  myMapResto();
  likeMapResto();

  // kakao api library를 가져오는 부분, kakao.maps를 통해 map method 접근
  const script = document.createElement("script");

  /* global kakao */
  // script download 후 그리기 실행
  script.onload = () => kakao.maps.load(initMap);

  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_SERVICE_KEY}&libraries=services`;

  // 생성한 스크립트 엘리먼트를 HTML 문서의 <head> 태그에 추가하여 스크립트를 로드하도록 한다
  document.head.appendChild(script);

  // Drag Event

  // const item = document.querySelector(".myMapList");

  // item.addEventListener("dragstart", (e) => {
  //   console.log(e);
  //   console.log("드래그를 시작하면 발생하는 이벤트");
  //   isDragStarted.value = true;
  // });
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

const deletePlace = (resto) => {
  // list : myRestoList, bookmarkRestoList, addRestoList

  console.log("delete place", resto.value);

  // 마커 제거
  starMap.value.get(resto.restoApiId)[1].setMap(null);
  starMap.value.delete(resto.restoApiId);

  mapRestoMap.value.forEach((item) => {
    // const ids = item[1]
    for (const id of item[1]) {
      if (id === resto.restoApiId) {
        item[0]--;
        break;
      }
    }
  });
  console.log(starMap.value.size);
  if (starMap.value.size === 0) {
    map.value.setLevel(5);
    map.value.setCenter(new kakao.maps.LatLng(37.50378611, 127.0248221));
  } else {
    infowindow.value.close();
    setBounds();
  }
  console.log(mapRestoMap);
  console.log(starMap.value);
};
const clicking = () => {
  console.log("clicking !!!", mapRestoNo);
};
const getRestos = (args) => {
  console.log("수신 >> ", args);
  // api 요청
  getMapRestos(
    args[1],
    ({ data }) => {
      console.log("listLikeMapResto data: ", data);
      const restoIds = [];
      data.userRestoList.forEach((item) => restoIds.push(item.restoApiId));

      mapRestoMap.value.set(args[1], [restoIds.length, restoIds]);
      console.log(mapRestoMap.value);

      // 마커 가져와서 찍기
      data.userRestoList.forEach((data) => {
        if (args[0] === true) {
          // 추가할 맛집이 이미 존재하면 다음으로
          if (starMap.value.has(data.restoApiId)) return;

          displayMarker(data);
        } else {
          // 삭제할 맛집이 없으면 다음으로
          if (!starMap.value.has(data.restoApiId)) return;

          // 마커 제거
          starMap.value.get(data.restoApiId)[1].setMap(null);
          starMap.value.delete(data.restoApiId);
        }
      });

      // 마커에 기반해서 위치 이동
      if (args[0] === true) setBounds();
      console.log("star map", starMap.value);
      console.log("map location", map.value);
    },
    (error) => console.log("listLikeMapResto error: ", error)
  );

  console.log(
    "asdafiuwenr",
    Array.from(starMap.value.values()).map((item) => item[0])
  );
};
const setBounds = () => {
  bounds.value = new kakao.maps.LatLngBounds();

  for (const [, value] of starMap.value) {
    // console.log(key, value); // 순서대로 엔트리를 출력합니다.
    bounds.value.extend(
      new kakao.maps.LatLng(value[0].latitude, value[0].longitude)
    );
  }

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.value.setBounds(bounds.value);
};
const registeredRestoClick = (a, b) => {
  console.log("a", a);
  console.log("b", b);
};
// 외부 버튼 클릭 시 실행되는 함수 (Vue.js 예시)
const itemClick = (markerId) => {
  const marker = starMap.value.get(markerId)[1]; // 마커 가져오기
  const place = starMap.value.get(markerId)[0];

  infowindow.value = new kakao.maps.InfoWindow({
    content: `<div style="padding:3px 0px 0px 5px;" onclick="toLink">
          <a href="https://place.map.kakao.com/${place.restoApiId}" target="_blank">${place.restoName}</a></div>`,
    removable: true,
  });

  infowindow.value.close();
  infowindow.value.open(map.value, marker);

  // 마커 클릭 시 InfoWindow 열기
  kakao.maps.event.addListener(marker, "click", function () {
    infowindow.value.close();

    infowindow.value.open(map.value, marker); // 해당 마커의 InfoWindow 열기
  });

  // 지도 클릭 시 InfoWindow 닫기 (원치 않을 시 생략 가능)
  kakao.maps.event.addListener(map.value, "click", function () {
    infowindow.value.close();
  });

  map.value.setLevel(4);
  // 해당 마커의 위치로 지도 이동 (원치 않을 시 생략 가능)
  map.value.setCenter(marker.getPosition());

  console.log(starMap.value);
};
const animateButton = function (e) {
  e.preventDefault;
  //reset animation
  e.target.classList.remove("animate");

  e.target.classList.add("animate");
  setTimeout(function () {
    e.target.classList.remove("animate");
  }, 700);
};
const classname = document.getElementsByClassName("confetti-button");
for (var i = 0; i < classname.length; i++) {
  classname[i].addEventListener("click", animateButton, false);
}

const sliding = () => {
  console.log("sliding !!!");
  myMapResto();
};

const startX = ref();
const startY = ref();
const endX = ref();
const endY = ref();

function mousedown(event) {
  startX.value = event.clientX; // 클릭 시작 X 좌표
  startY.value = event.clientY; // 클릭 시작 Y 좌표
}

function mouseup(event) {
  // 마우스 클릭 끝날 시 실행되는 코드
  endX.value = event.clientX; // 클릭 끝 X 좌표
  endY.value = event.clientY; // 클릭 끝 Y 좌표

  // 클릭 시작과 끝 지점의 좌표를 출력합니다.
  console.log(`시작 좌표: (${startX.value}, ${startY.value})`);
  console.log(`끝 좌표: (${endX.value}, ${endY.value})`);
}
</script>

<template>
  <ChildComponent @custom-event="handleCustomEvent" />
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">지도 Combine</mark>
        </h2>
      </div>
      <div class="">
        <div class="row justify-content-center">
          <!-- left side -->
          <div class="row">
            <div class="col-5">
              <div class="map_wrap">
                <div
                  id="map"
                  :class="{ notHasMarker: starMap.size === 0 ? true : false }"
                  style="position: relative; overflow: hidden"
                ></div>
                <ul id="category" style="margin-left: 20px">
                  <li id="FD6" data-order="0" class="restaurant">음식점</li>
                  <li id="CE7" data-order="0" class="cafe">카페</li>
                  <li id="">X</li>
                </ul>
              </div>
            </div>

            <!-- right side -->
            <!-- 나의 지도 리스트 -->
            <div id="mapList" class="col-4">
              <div class="row" style="overflow-y: auto">
                <h3 class="text-center">나의 지도 리스트</h3>
                <ul class="mapRestoCard">
                  <!-- <button class="mapPage">pre</button> -->
                  <MapRestoCombineListItem
                    v-for="mapResto in myMapList"
                    :key="mapResto.mapRestoNo"
                    :value="mapResto.restoApiId"
                    :mapResto="mapResto"
                    draggable="true"
                    @some-event="clicking"
                    @emit-args="getRestos"
                    :count="
                      mapRestoMap.get(mapResto.mapRestoNo) != null
                        ? mapRestoMap.get(mapResto.mapRestoNo)
                        : [0, null]
                    "
                  >
                  </MapRestoCombineListItem>
                  <!-- <button class="mapPage">next</button> -->
                </ul>
              </div>

              <!-- 북마크 지도 리스트 -->
              <div class="row" style="overflow-y: auto">
                <h3 class="text-center">좋아 지도 리스트</h3>
                <ul class="mapRestoCard">

                  <!-- <button class="mapPage">pre</button> -->
                  <MapRestoCombineListItem
                    v-for="mapResto in likeMapList"
                    :key="mapResto.mapRestoNo"
                    :value="mapResto.restoApiId"
                    :mapResto="mapResto"
                    draggable="true"
                    @some-event="clicking"
                    @emit-args="getRestos"
                    :count="
                      mapRestoMap.get(mapResto.mapRestoNo) != null
                        ? mapRestoMap.get(mapResto.mapRestoNo)
                        : [0, null]
                    "
                  >
                  </MapRestoCombineListItem>
                  <!-- <button class="mapPage">next</button> -->
                </ul>
              </div>
            </div>
            <div
              id="restoList"
              class="col-2"
              style="height: 75vh; overflow-y: auto"
              :style="{
                border:
                  starMap.size === 0 ? '2px solid #000' : '2px solid #ec8dbc',
              }"
            >
              <div class="text-center" style="margin-top: 10px">
                내 지도 맛집
              </div>
              <div>
                <div
                  v-for="resto in Array.from(starMap.values()).map(
                    (item) => item[0]
                  )"
                  :key="resto.restoApiId"
                  :value="resto.restoApiId"
                  class="list-item badge-item confetti-button"
                  style="line-height: 200%; margin: 10px 0"
                  @click.prevent="itemClick(resto.restoApiId)"
                >
                  <div class="item-container">
                    <div class="" style="padding: 5px">
                      {{ resto.restoName }}
                    </div>

                    <button
                      type="button"
                      class="btn-close"
                      aria-label="close"
                      @click.prevent="deletePlace(resto)"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#map {
  /* width: 100%; */
  height: 75vh;

  border: 2px solid rgb(124, 124, 255);
  margin: 0 0.5em;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#mapList {
  border: 2px solid #000;
  margin: 0 1em;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#restoList {
  /* border: 2px solid #ec8dbc; */
  margin: 0 1em;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.map_wrap,
.map_wrap * {
  margin: 0;
  padding: 0;
  font-family: "Malgun Gothic", dotum, "돋움", sans-serif;
  font-size: 12px;
}
.map_wrap {
  position: relative;
  width: 100%;
  height: 350px;
}
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

.drag-start {
  border: 2px solid #7eb4d8;
  box-shadow: 0 0 10px rgba(83, 163, 216, 0.5);
}

.badge-item {
  background-color: palevioletred;
  color: rgb(255, 255, 255);
  padding: 4px 8px;
  text-align: center;
  border-radius: 5px;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #333;
  text-align: center;
}

a {
  display: inline-block;
  position: relative;
  margin-top: 300px;
  padding: 30px;
  background-color: black;
  color: white;
  text-decoration: none;
  font-size: 25px;
  font-weight: bold;
}
.notHasMarker {
  opacity: 0.7;
}

.confetti-button {
  font-family: "Helvetica", "Arial", sans-serif;
  display: inline-block;
  font-size: 1em;
  padding: 5px 5px;
  margin-top: 100px;
  margin-bottom: 60px;
  -webkit-appearance: none;
  appearance: none;
  background-color: #ff0081;
  color: #fff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  position: relative;
  width: 100%;
  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);
}

.confetti-button:focus {
  outline: 0;
}

.confetti-button:before,
.confetti-button:after {
  position: absolute;
  content: "";
  display: block;
  width: 140%;
  height: 100%;
  left: -20%;
  z-index: -1000;
  transition: all ease-in-out 0.5s;
  background-repeat: no-repeat;
}

.confetti-button:before {
  display: none;
  top: -75%;
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%);
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%,
    10% 10%, 18% 18%;
}

.confetti-button:after {
  display: none;
  bottom: -75%;
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%);
  background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
}

.confetti-button:active {
  transform: scale(0.9);
  background-color: #e60074;
  box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
}

.confetti-button.animate:before {
  display: block;
  animation: topBubbles ease-in-out 0.75s forwards;
}

.confetti-button.animate:after {
  display: block;
  animation: bottomBubbles ease-in-out 0.75s forwards;
}
@keyframes topBubbles {
  0% {
    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%,
      40% 90%, 55% 90%, 70% 90%;
  }
  50% {
    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%,
      50% 50%, 65% 20%, 90% 30%;
  }
  100% {
    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%,
      50% 40%, 65% 10%, 90% 20%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
@keyframes bottomBubbles {
  0% {
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%,
      70% -10%, 70% 0%;
  }
  50% {
    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%,
      105% 0%;
  }
  100% {
    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%,
      110% 10%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}

.item-container {
  display: flex;
  justify-content: space-between; /* 요소를 양쪽 끝으로 정렬합니다 */
}
</style>
