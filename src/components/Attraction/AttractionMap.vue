<script setup>
import { onMounted } from "vue";
// import { axios } from "axios";
const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3,
  };

  const map = new kakao.maps.Map(container, options);
  map.setMapTypeId(kakao.maps.MapTypeId.NORMAL);
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
  <div class="parent">
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
