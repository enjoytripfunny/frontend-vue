<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, toRaw, watch } from "vue";
import { getMapRestoView } from "@/api/map-resto.js";

const route = useRoute();
const { maprestono } = route.params;

const mapRestoView = ref({ fileInfo: "default" }); // 맛지도에 대한 설명 저장
const imageKey = ref(0);
const restoList = ref([]); // 맛지도에 저장된 식당들 저장

// 카카오 맵 관련
const KAKAO_SERVICE_KEY = "066c4bf5fb8745fcc2b066ec145bb938";

const map = ref();
const infowindow = ref();
const ps = ref();
const bounds = ref(); // 마커에 따른 지도 범위 !!

const STAR_IMG =
  "https://user-images.githubusercontent.com/70050038/284016597-7a30594e-bf67-454b-af93-17b100054d02.png";

const restoData = ref([]);
const starMap = ref(new Map());

watch(mapRestoView, (newValue, oldValue) => {
  console.log("값이 변경되었습니다:", newValue);
  imageKey.value += 1;
});

const displayMarker = (data) => {
  console.log("data :::", data);
  starMap.value.set(data.restoApiId, [
    data,
    new kakao.maps.Marker({
      map: toRaw(map.value),
      position: new kakao.maps.LatLng(data.latitude, data.longitude),
      image: new kakao.maps.MarkerImage(STAR_IMG, new kakao.maps.Size(31, 35)),
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
  });

  console.log("end", starMap.value);
  console.log(data.latitude, data.longitude);
  bounds.value.extend(new kakao.maps.LatLng(data.latitude, data.longitude));
};
const initMap = () => {
  // 인포윈도우 생성
  infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 });

  // 맵 생성
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(36.00378611, 127.8248221),
    level: 13,
  };

  map.value = new kakao.maps.Map(container, options);
  map.value.setMapTypeId(kakao.maps.MapTypeId.NORMAL);

  // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
  const zoomControl = new kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  // end add control

  bounds.value = new kakao.maps.LatLngBounds();
};
onMounted(async () => {
  // 맛지도에 대한 제목, 작성자, 내용, 작성 날짜, 식당들
  const getMapResto = () => {
    getMapRestoView(
      maprestono,
      ({ data }) => {
        mapRestoView.value = data.mapResto; // 식당 제외 맛지도 데이터
        restoList.value = data.userRestoList;
        console.log("getMapResto data: ", data.value);
        console.log("resto list ::", restoList.value);

        for (const item of restoList.value) {
          restoData.value.push(item);
        }
        console.log("????", restoData.value);
      },
      (error) => {
        console.error(error);
      }
    );
  };
  await getMapResto();
  // kakao api library를 가져오는 부분, kakao.maps를 통해 map method 접근
  const script = document.createElement("script");

  /* global kakao */
  // script download 후 그리기 실행
  script.onload = () => kakao.maps.load(initMap);

  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_SERVICE_KEY}&libraries=services`;

  // 생성한 스크립트 엘리먼트를 HTML 문서의 <head> 태그에 추가하여 스크립트를 로드하도록 한다
  document.head.appendChild(script);
});

const display = () => {
  console.log("!!!!", restoData.value);
  for (const item of restoData.value) {
    displayMarker(item);
  }

  map.value.setBounds(bounds.value);
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <div id="map"></div>
      </div>
      <div class="col-lg-6">
        <div class="card mb-3">
          <div v-if="mapRestoView.fileInfo != null">
            <img
              :src="`/src/assets/${mapRestoView.fileInfo.saveFolder}/${mapRestoView.fileInfo.saveFile}`"
              class="card-img-top"
              alt="..."
              style="height: 55vh"
            />
          </div>
          <div v-else>
            <img
              :key="imageKey"
              src="https://user-images.githubusercontent.com/70050038/285240337-166b088b-584e-48a2-9e7b-356f9913b2c6.png"
              class="card-img-top"
              alt="..."
              style="height: 55vh"
            />
          </div>
          <div class="card-body" style="height: 20vh">
            <div class="btn btn-outline-secondary" @click="display">
              식당 가져오기
            </div>
            <div
              class="card-text d-flex justify-content-end"
              style="font-weight: bolder"
            >
              {{ mapRestoView.userId }}
            </div>
            <div class="card-title">{{ mapRestoView.subject }}</div>
            <div class="card-text">
              <div>{{ mapRestoView.content }}</div>
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

  margin: 0 0.5em;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#info {
  border: 2px solid rgb(124, 124, 255);
  margin: 0 0.5em;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
