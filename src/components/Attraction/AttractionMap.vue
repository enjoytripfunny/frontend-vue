<!-- <script setup>
import { ref, onMounted } from 'vue'

const initMap = () => {
  console.log('start')
  const container = document.getElementById('map')
  const options = {
    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
    level: 3
  }
  console.log('OK ?')
  const map = new window.kakao.maps.Map(container, options)
  map.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID)
}

onMounted(() => {
  const script = document.createElement('script')
  script.type = 'text/javascript'

  script.src =
    '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=066c4bf5fb8745fcc2b066ec145bb938'
  script.async = true

  script.onload = () => {
    // 스크립트가 로드된 후에 수행할 작업
    console.log('Script loaded successfully!')
    console.log(kakao.maps)
    kakao.maps.load(initMap())
  }

  script.onerror = () => {
    // 스크립트 로드 중 에러 발생 시 처리
    console.error('Error loading script.')
  }

  document.head.appendChild(script)
})

// onMounted(async () => {
//   if (window.kakao && window.kakao.maps) {
//     console.log('.')
//     initMap()
//   } else {
//     console.log('..')
//     const script = document.createElement('script')
//     /* global kakao */
//     script.src =
//       '//dapi.kakao.com/v2/maps/sdk.js?&autoload=false&appkey=066c4bf5fb8745fcc2b066ec145bb938'
//     script.type = 'text/javascript'

//     // 스크립트 로드를 Promise로 감싸서 로드 완료 후에 initMap 함수를 호출하도록 함
//     await new Promise((resolve, reject) => {
//       script.onload = resolve
//       script.onerror = reject

//       // html head tag에 script 추가 !!!
//       document.template.appendChild(script)
//     })
//     console.log(script)
//     // Kakao 지도 API가 로드된 후에 initMap 함수를 호출
//     initMap()
//   }
// })
</script> -->

<script>
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
</script>

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
