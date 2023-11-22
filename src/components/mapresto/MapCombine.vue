<script setup>
import {
  listMyMapResto,
  listLikeMapResto,
  getMapRestos,
} from "@/api/map-resto.js";
import axios from "axios";
import { onMounted, ref, toRaw } from "vue";
import MapRestoCombineListItem from "./item/MapRestoCombineListItem.vue";

const props = defineProps({
  apiId: Array,
});

const mapRestoNo = defineEmits({ mapRestoNo: String });

const myMapList = ref([]);
const likeMapList = ref([]);
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
const restoApiId = ref(new Map());

const myMapResto = () => {
  listMyMapResto(
    {
      num: 0,
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
      num: 0,
      userId: "ssafy",
    },
    ({ data }) => {
      likeMapList.value = data.likeMapList;
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
  console.log("sss", starMap.value.get(data.restoApiId)[1]);
  const marker = starMap.value.get(data.restoApiId)[1];
  kakao.maps.event.addListener(marker, "click", () => {
    infowindow.value.close();

    const infowindowContent = `
        <div class"wrap">
          <div id="infowindow" class="info">
              <div class="title">
                  <div class="infowindow-header">
                      <h3>${data.restoName}</h3>
                      <div class="closeBtn" onclick="closeOverlay()" title="닫기"></div>
                  </div>
                  <div class="body">
                      <div>
                          <div class="ellipsis">${data.address}</div>
                      </div>
                      <div>

                        <button onclick="deleteResto()">내 지도에서 삭제</button>
                      </div>
                  </div>
              </div>
          </div>
        </div>`;

    // 내 지도에 추가 버튼 클릭 시 실행되는 함수
    // 함수를 전역에 추가 !!!
    window.deleteResto = () => {
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
const deletePlace = (resto) => {
  // list : myRestoList, bookmarkRestoList, addRestoList

  console.log(resto.value);

  // 마커 제거
  starMap.value.get(resto.restoApiId)[1].setMap(null);
  starMap.value.delete(resto.restoApiId);
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

      restoApiId.value.length = 0;
      // 마커 가져와서 찍기
      data.userRestoList.forEach((data) => {
        restoApiId.value.push(data.restoApiId);
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
</script>

<template>
  <ChildComponent @custom-event="handleCustomEvent" />
  <div class="container">
    <div class="col-lg-12">
      <h2 class="my-3 py-3 shadow-sm bg-light text-center">
        <mark class="sky">지도 Combine</mark>
      </h2>
    </div>
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
        <!-- <div class="row"> -->
        <div class="col-5" style="height: 75vh; overflow-y: auto">
          <!-- 나의 지도 리스트 -->
          <div class="row">
            <h3 class="text-center">나의 지도 리스트</h3>
            <ul class="mapRestoCard" style="height: 300px">
              <MapRestoCombineListItem
                v-for="mapResto in myMapList"
                :key="mapResto.mapRestoNo"
                :value="mapResto.restoApiId"
                :mapResto="mapResto"
                draggable="true"
                :class="{ 'drag-start': isDragStarted }"
                @some-event="clicking"
                @emit-args="getRestos"
                :api-ids="starMap.values()"
              >
              </MapRestoCombineListItem>
            </ul>
          </div>

          <!-- 북마크 지도 리스트 -->
          <div class="row">
            <h3 class="text-center">좋아요 지도 리스트</h3>
            <ul class="mapRestoCard" style="height: 300px">
              <MapRestoCombineListItem
                v-for="mapResto in likeMapList"
                :key="mapResto.mapRestoNo"
                :mapResto="mapResto"
              >
              </MapRestoCombineListItem>
            </ul>
          </div>
        </div>

        <div class="col-2" style="height: 75vh; overflow-y: auto">
          <div class="text-center">내 지도 맛집</div>
          <ul>
            <li
              v-for="resto in Array.from(starMap.values()).map(
                (item) => item[0]
              )"
              :key="resto.restoApiId"
              :value="resto.restoApiId"
              class="list-item badge-item"
              style="line-height: 200%; margin: 10px 0"
              @click.prevent="registeredRestoClick(resto)"
            >
              {{ resto.restoName }}
              <button
                type="button"
                class="btn-close"
                aria-label="close"
                @click.prevent="deletePlace(resto)"
              ></button>
            </li>
          </ul>
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
#map {
  /* width: 100%; */
  height: 75vh;
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

.drag-start {
  border: 2px solid #7eb4d8;
  box-shadow: 0 0 10px rgba(83, 163, 216, 0.5);
}

.badge-item {
  background-color: rgb(94, 85, 200);
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
</style>
