<script setup>
import axios from "axios";
import { onMounted, ref, toRaw } from "vue";

let map = ref();
/* select */
const SERVICE_KEY =
  "2RDjx8tvT%2BKeHQfc63dZHPJ877u303PS7zZbq8XOWHL%2BsuGffc89ZKGNzDCAZh0CdM%2BWfd7CXg7AzQzIBAI4Aw%3D%3D";
let url;

// v-model에서 사용
const sidoCode = ref(0);
const sidoCodes = ref([
  { code: 1, sido: "서울" },
  { code: 2, sido: "인천" },
  { code: 3, sido: "대전" },
  { code: 4, sido: "대구" },
  { code: 5, sido: "광주" },
  { code: 6, sido: "부산" },
  { code: 7, sido: "울산" },
  /*{ code: 8, sido: "세종특별자치시" },*/
  { code: 31, sido: "경기도" },
  { code: 32, sido: "강원도" },
  { code: 33, sido: "충청북도" },
  { code: 34, sido: "충청남도" },
  { code: 35, sido: "경상북도" },
  { code: 36, sido: "경상남도" },
  { code: 37, sido: "전라북도" },
  { code: 38, sido: "전라남도" },
  { code: 39, sido: "제주도" },
]);
const gugunCode = ref();
const gugunCodes = ref();
const contentCode = ref(0);
const contents = ref([
  { code: 12, content: "관광지" },
  { code: 14, content: "문화시설" },
  { code: 15, content: "축제공연행사" },
  { code: 25, content: "여행코스" },
  { code: 28, content: "레포츠" },
  { code: 32, content: "숙박" },
  { code: 38, content: "쇼핑" },
  { code: 39, content: "음식점" },
]);

// @change에서 사용
const handleSidoChange = () => {
  url = `https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&areaCode=${sidoCode.value}&_type=json`;
  axios.get(url).then((response) => {
    // make gugun values
    const gugunArrays = response.data.response.body.items.item;
    gugunCodes.value = gugunArrays.map((gugun) => ({
      code: gugun.code,
      gugun: gugun.name,
    }));
    // trigger
    gugunCode.value = 0;
  });
};

const handleGugunChange = () => {
  url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=1&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=C&areaCode=${sidoCode.value}&sigunguCode=${gugunCode.value}`;
  axios.get(url).then((response) => {
    // gugun location
    const location = response.data.response.body.items.item;

    // location array's mapy, mapx -> markerPositions
    markerPositions.value = location.map((location) => {
      return [location.mapy, location.mapx];
    });
    displayMarker(map.value, markerPositions.value);
  });
};

const handleContentChange = () => {
  if (
    sidoCode.value === 0 ||
    gugunCode.value === 0 ||
    contentCode.value === 0
  ) {
    console.log("need input !!!");
    return;
  }
  let url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=C&contentTypeId=${contentCode.value}&areaCode=${sidoCode.value}&sigunguCode=${gugunCode.value}`;
  axios.get(url).then((response) => {
    // sido gugun content location
    const locations = response.data.response.body.items.item;

    // locations array mapy, mapx -> markerPositions
    markerPositions.value = locations.map((location) => {
      console.log(location);
      return [
        location.mapy,
        location.mapx,
        location.title,
        location.firstimage,
        location.addr1,
      ];
    });
    displayMarker(map.value, markerPositions.value);
  });
};

/* map */
const markers = ref([]);
const markerPositions = ref([
  [37.499590490909185, 127.0263723554437],
  [37.499427948430814, 127.02794423197847],
  [37.498553760499505, 127.02882598822454],
  [37.497625593121384, 127.02935713582038],
  [37.49629291770947, 127.02587362608637],
  [37.49754540521486, 127.02546694890695],
  [37.49646391248451, 127.02675574250912],
]);

const displayMarker = (map, markerPositions) => {
  console.log(markerPositions);
  // delete markers
  if (markers.value.length > 0) {
    markers.value.forEach((marker) => marker.setMap(null));
  }

  // create new markers, and save values at positions
  const positions = markerPositions.map(
    // based latitude longitude using kakao.maps method
    (position) => new kakao.maps.LatLng(...position)
  );

  // add markers
  if (positions.length > 0) {
    // make markers by positions
    markers.value = positions.map(
      (position) =>
        new kakao.maps.Marker({
          map: toRaw(map),
          position,
        })
    );

    markers.value.forEach((marker, index) => {
      kakao.maps.event.addListener(marker, "click", () => {
        const infowindowContent = `
          <div class="wrap">
              <div class="info">
                  <div class="title">
                      ${markerPositions[index][2]}
                      <div class="close" onclick="closeOverlay()" title="닫기"></div>
                  </div>
                  <div class="body">
                      <div class="img">
                          <img src="${markerPositions[index][3]}" width="100" height="100">
                      </div>
                      <div>
                          <div class="ellipsis">${markerPositions[index][4]}</div>
                      </div>
                  </div>
              </div>
          </div>`;

        // 클릭 이벤트에 인포윈도우 표시
        const infowindow = new kakao.maps.InfoWindow({
          content: infowindowContent,
          position: marker.getPosition(),
          removable: true,
        });

        infowindow.open(map, marker);
      });
    });

    // show markers
    const bounds = positions.reduce(
      (bounds, latlng) => bounds.extend(latlng),
      new kakao.maps.LatLngBounds()
    );

    // adjust maps location
    toRaw(map).setBounds(bounds);

    console.log(markers);
  }
};
const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3,
  };

  map.value = new kakao.maps.Map(container, options);
  map.value.setMapTypeId(kakao.maps.MapTypeId.NORMAL);

  displayMarker(map.value, markerPositions.value);
};

onMounted(() => {
  // kakao api library를 가져오는 부분, kakao.maps를 통해 map method 접근
  const script = document.createElement("script");

  /* global kakao */
  // script download 후 그리기 실행
  script.onload = () => kakao.maps.load(initMap);

  script.src =
    "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=066c4bf5fb8745fcc2b066ec145bb938";
  document.head.appendChild(script);
});
</script>

<!-- <script>
export default {
  mounted() {
    // kakao api library를 가져오는 부분 / kakao.maps를 통해 method 접근
    const script = document.createElement("script");
    /* global kakao */
    script.onload = () => kakao.maps.load(this.initMap);
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=066c4bf5fb8745fcc2b066ec145bb938";
    document.head.appendChild(script);
  },
  methods: {
    initMap() {
      // Map 그리는 부분
      var container = document.getElementById("map");
      var options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      var map = new kakao.maps.Map(container, options);
      map.setMapTypeId(kakao.maps.MapTypeId.NORMAL); // 지도 타입 : 위성 뷰, 그림, 등
    },
  },
};
</script> -->

<template>
  <div class="parent row">
    <div>
      <form action="" class="row g-3 m-3">
        <!-- sido -->
        <div class="col">
          <select
            class="form-select"
            id="select-sido"
            v-model="sidoCode"
            @change="handleSidoChange"
          >
            <option value="0" selected disabled>시도선택</option>
            <option
              v-for="sidoCode in sidoCodes"
              :key="sidoCode.code"
              :value="sidoCode.code"
            >
              {{ sidoCode.sido }}
            </option>
          </select>
        </div>
        <!-- gugun -->
        <div class="col">
          <select
            class="form-select"
            id="select-gugun"
            v-model="gugunCode"
            @change="handleGugunChange"
          >
            <option selected disabled value="0">구군선택</option>
            <option
              v-for="gugunCode in gugunCodes"
              :key="gugunCode.code"
              :value="gugunCode.code"
            >
              {{ gugunCode.gugun }}
            </option>
          </select>
        </div>
        <!-- contents -->
        <div class="col">
          <select
            class="form-select"
            id="select-content"
            v-model="contentCode"
            @change="handleContentChange"
          >
            <option selected disabled="disabled" value="0">컨텐츠</option>
            <option
              v-for="content in contents"
              :key="content.code"
              :value="content.code"
            >
              {{ content.content }}
            </option>
          </select>
        </div>
      </form>
    </div>
    <div id="map" class="child"></div>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  width: 100%;
  height: 75vh;
}

.child {
  width: 90%;
  height: 90%;
  margin: auto;
}
</style>
