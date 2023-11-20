<script setup>
import { onMounted, ref, toRaw } from "vue";

import { useRouter } from "vue-router";
import axios from "axios";
import { registMapResto } from "../../api/map-resto";

const KAKAO_SERVICE_KEY = "066c4bf5fb8745fcc2b066ec145bb938";


const BASIC_MARKER = "https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png";
const STAR_IMG =
  "https://user-images.githubusercontent.com/70050038/284016597-7a30594e-bf67-454b-af93-17b100054d02.png";
const CLICK_IMG =
  "https://user-images.githubusercontent.com/70050038/284038352-dfe61846-ac5e-4ccd-9f64-a738a50fbc9e.png";

const router = useRouter();

const map = ref(); // map object
const ps = ref(); // place search object

const infowindow = ref(); // marker's info window object

const markers = ref([]); // markers
const markersData = ref([]); // markers data 지도에 뜬 모든 마커의 데이터, 지도에 마커 찍을 때 사용

const registeredPlace = ref([]); // 등록된 장소(마커에서 추가한 장소)
const subject = ref(); // 제목
const content = ref(); // 글
const tags = ref([]); // 지역 태그 최대 3개(서울, 대전 ...)

const location = ref([
  "서울",
  "인천",
  "대전",
  "대구",
  "부산",
  "광주",
  "울산",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라남도",
  "전라북도",
  "경상남도",
  "경상북도",
  "제주도",
]);

// 마커 그리는 함수
const displayMarkers = (markersData) => {
  // delete markers
  if (markers.value.length > 0) {
    markers.value.forEach((marker) => {
      //   console.log(marker);
      marker.setMap(null);
    });
  }

  // create new markers, and save values at positions
  const positions = markersData.map(
    // based latitude longitude using kakao.maps method
    (markersData) => new kakao.maps.LatLng(markersData.y, markersData.x)
  );

  // add markers
  if (positions.length > 0) {
    // make markers by positions
    markers.value = positions.map(
      (position) =>
        new kakao.maps.Marker({
          map: toRaw(map.value),
          position,
        })
    );

    markers.value.forEach((marker, index) => {
      kakao.maps.event.addListener(marker, "click", () => {
        infowindow.value.close();
        const infowindowContent = `
        <div class"wrap">
          <div id="infowindow" class="info">
              <div class="title">
                  <div class="infowindow-header">
                      <h3>${markersData[index].place_name}</h3>
                      <div class="closeBtn" onclick="closeOverlay()" title="닫기"></div>
                  </div>
                  <div class="body">
                      <div>
                          <div class="ellipsis">${markersData[index].road_address_name}</div>
                      </div>
                      <div>

                        <button onclick="addResto()">내 지도에 추가</button>
                      </div>
                  </div>
              </div>
          </div>
        </div>`;

        // 내 지도에 추가 버튼 클릭 시 실행되는 함수
        // 함수를 전역에 추가 !!!
        window.addResto = () => {
          console.log(markers.value[index]);
          console.log("내 지도에 추가 버튼이 클릭되었습니다!");

          // 이미 추가됐는지 체크
          for (var i = 0; i < registeredPlace.value.length; i++) {
            if (
              registeredPlace.value[i].restoApiId ===
              markersData.value[index].id
            ) {
              return;
            }
          }

          markersData.value[index].registered = true;
          markers.value[index].setImage(
            new kakao.maps.MarkerImage(STAR_IMG, new kakao.maps.Size(31, 35))
          );
          registeredPlace.value.push({
            restoApiId: markersData.value[index].id,
            restoName: markersData.value[index].place_name,
            restoPhone: markersData.value[index].phone,
            category: markersData.value[index].category_group_code,
            address: markersData.value[index].address_name,
            latitude: markersData.value[index].y,
            longitude: markersData.value[index].x,
          });
          console.log("register place >> ", registeredPlace.value);
          infowindow.value.close();
        };
        // 클릭 이벤트에 인포윈도우 표시
        infowindow.value = new kakao.maps.InfoWindow({
          content: infowindowContent,
          position: marker.getPosition(),
          removable: true,
        });

        infowindow.value.open(map.value, marker);
      });
    });
  }
};

// map init setting
const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(37.50378611, 127.0248221),
    level: 3,
  };

  map.value = new kakao.maps.Map(container, options);
  map.value.setMapTypeId(kakao.maps.MapTypeId.NORMAL);

  // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
  var mapTypeControl = new kakao.maps.MapTypeControl();

  // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
  // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
  map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
  var zoomControl = new kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  // 지도 객체를 인자로 넣을경우, 검색(categorySearch)에 필요한 옵션들 중 location이 자동으로 현재 지도의 중심 좌표로 설정되어 검색을 시도한다.
  // 필요에 따라서는 useMapBounds 옵션을 통해 현재 지도에 보여지는 영역을 자동 지정할 수 있다.

  ps.value = new kakao.maps.services.Places(map.value); // categorySearch(b, g, e), keywordSearch, setMap
  ps.value.categorySearch("FD6", placesSearchCB, { useMapBounds: true });

  infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 });

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function placesSearchCB(data, status) {
    // delete markers
    if (markers.value.length > 0) {
      markers.value.forEach((marker) => marker.setMap(null));
    }

    // make markers
    markers.value = data.map((data) => {
      return new kakao.maps.Marker({
        map: toRaw(map.value),
        position: new kakao.maps.LatLng(data.y, data.x),
      });
    });

    markersData.value = data.map((data) => {
      return {
        address_name: data.address_name,
        category_group_code: data.category_group_code,
        category_group_name: data.category_group_name,
        category_name: data.category_name,
        distance: data.distance,
        id: data.id,
        phone: data.phone,
        place_name: data.place_name,
        place_url: data.place_url,
        road_address_name: data.road_address_name,
        x: data.x,
        y: data.y,
      };
    });

    if (status === kakao.maps.services.Status.OK) {
      displayMarkers(markersData.value);
    }
  }
  // displayMarker(map.value, markersData.value);

  kakao.maps.event.addListener(map.value, "dragend", function () {
    // 지도 드래그가 끝날 때 수행할 동작
    console.log("지도 드래그가 끝났습니다.");

    ps.value = new kakao.maps.services.Places(map.value); // categorySearch(b, g, e), keywordSearch, setMap
    ps.value.categorySearch("FD6", placesSearchCB, { useMapBounds: true });
  });
};

onMounted(() => {
  // kakao api library를 가져오는 부분, kakao.maps를 통해 map method 접근
  const script = document.createElement("script");

  /* global kakao */
  // script download 후 그리기 실행
  script.onload = () => kakao.maps.load(initMap);

  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_SERVICE_KEY}&libraries=services`;

  // 생성한 스크립트 엘리먼트를 HTML 문서의 <head> 태그에 추가하여 스크립트를 로드하도록 한다
  document.head.appendChild(script);
});

const searchValue = ref(); // 검색어
const searchPlace = () => {
  // 키워드로 장소를 검색합니다
  ps.value.keywordSearch(searchValue.value, placesSearchCB);

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function placesSearchCB(data, status) {
    // delete markers
    if (markers.value.length > 0) {
      markers.value.forEach((marker) => marker.setMap(null));
    }

    // make markers
    markers.value = data.map((data) => {
      return new kakao.maps.Marker({
        map: toRaw(map.value),
        position: new kakao.maps.LatLng(data.y, data.x),
      });
    });

    markersData.value = data.map((data) => {
      return {
        address_name: data.address_name,
        category_group_code: data.category_group_code,
        category_group_name: data.category_group_name,
        category_name: data.category_name,
        distance: data.distance,
        id: data.id,
        phone: data.phone,
        place_name: data.place_name,
        place_url: data.place_url,
        road_address_name: data.road_address_name,
        x: data.x,
        y: data.y,
      };
    });

    if (status === kakao.maps.services.Status.OK) {
      displayMarkers(markersData.value);
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var bounds = new kakao.maps.LatLngBounds();

      for (var i = 0; i < markersData.value.length; i++) {
        bounds.extend(
          new kakao.maps.LatLng(markersData.value[i].y, markersData.value[i].x)
        );
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.value.setBounds(bounds);
    }
  }
};

// 등록된 장소 지우기
const deletePlace = (id) => {
  for (var i = 0; i < registeredPlace.value.length; i++) {
    registeredPlace.value = registeredPlace.value.filter(
      (place) => place.id !== id
    );
  }
};

const uploadImageFile = ref(); // image source
// 이미지 웹에 띄우기
const onFileSelected = (event) => {
  const input = event.target;
  if (input.files /* && input.files[0] */) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadImageFile.value = input; // image source 매우 긴 영어
      // uploadImageFile.value = e.target.result; // image source 매우 긴 영어
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const selectLocation = ref([]); // 선택된 지역 카테고리 배열 (서울, 대전 ...)
const optionClick = (locate) => {
  if (
    selectLocation.value.length > 2 &&
    !selectLocation.value.includes(locate)
  ) {
    return;
  }

  if (selectLocation.value.includes(locate)) {
    selectLocation.value = selectLocation.value.filter(
      (location) => location !== locate
    );
  } else {
    selectLocation.value.push(locate);
  }

  console.log(selectLocation.value);
};

const restoMap = ref({
  mapRestoNo: 0, //맛지도 인덱스
  userId: "ssafy", //맛지도 만든 사용자 아이디
  subject: subject.value, //맛지도 제목
  content: content.value, //맛지도 간단 설명
  // fileInfo: null, //uploadImageFile.value, //맛지도 썸네일
  // restos: null, //맛지도안에 맛집들의 api 아이디
  // restos: registeredPlace.value, //맛지도안에 맛집들의 api 아이디
  // tags: null, //맛지도에 대한 태그
  // tags: tags.value, //맛지도에 대한 태그
  registerTime: "", //맛지도 만들어진 날짜
});

const postData = ref({
  content: restoMap.value,
});

// 기본적인 설정
const axiosInstance = axios.create({
  baseURL: "http://localhost:9090", // 기본 URL 설정
  mode: "cors",
  headers: {
    "Content-Type": "multipart/form-data", // Content-Type을 반드시 이렇게 하여야 한다.
  },
});

const resData = [
  {
    restoApiId: "test",
    restoName: "test",
    restoPhone: "test",
    category: "test",
    address: "test",
    latitude: "test",
    longitude: "test",
  },
  {
    restoApiId: "test",
    restoName: "test",
    restoPhone: "test",
    category: "test",
    address: "test",
    latitude: "test",
    longitude: "test",
  },
];

const tagsTest = ["대전", "서울"];

// 만들기 버튼 클릭 이벤트
const makeMap = () => {
  console.log("make map !!!");

  for (let index = 0; index < registeredPlace.value.length; index++) {
    console.log("test: ", registeredPlace.value[index]);
  }
  console.log("registeredPlace: ", registeredPlace.value.target);

  const formData = new FormData();
  formData.append("file", uploadImageFile.value.files[0]);
  // // formData.append("fileInfo", uploadImageFile.value);
  // // formData.append("content", "test");
  formData.append("userId", "ssafy");
  formData.append("subject", "제목 test");
  formData.append("content", "testtest");
  formData.append("tags", tagsTest);
  // formData.append("restoInfo", JSON.stringify(resData));
  // formData.append("restos", JSON.stringify(resData));

  resData.forEach((data, index) => {
    formData.append(`restos[${index}].restoApiId`, data.restoApiId);
    formData.append(`restos[${index}].restoName`, data.restoName);
    formData.append(`restos[${index}].restoPhone`, data.restoPhone);
    formData.append(`restos[${index}].category`, data.category);
    formData.append(`restos[${index}].address`, data.address);
    formData.append(`restos[${index}].latitude`, data.latitude);
    formData.append(`restos[${index}].longitude`, data.longitude);
    // ... append other RestoDto fields
  });
  // formData.append("registerTime", "");
  // formData.append("content", JSON.stringify(restoMap.value));

  // // .post("/mapresto", restoMap.value)
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
  // registMapResto(
  //   restoMap.value,
  //   (response) => {
  //     console.log("registMapResto response의 값: " + response);
  //   },
  //   (error) => {
  //     console.error(error);
  //   }
  // );
};
</script>
// const makeMap = () => {
//   console.log("make map !!!");

//   axiosInstance
//     // .post("/mapresto", restoMap.value)
//     .post("/mapresto/reg", formData.value) 
//     // {
//     //   params: restoMap.value,
//     //   // params: postData.value,
//     // })
//     .then((response) => console.log(response))
//     .catch((error) => console.log(error));
// };

<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <!-- 검색 입력창과 버튼 -->
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search"
            id="searchInput"
            v-model="searchValue"
          />
          <div class="input-group-append">
            <button
              class="btn btn-primary"
              type="button"
              id="searchBtn"
              @click="searchPlace()"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div id="map" class="col-8"></div>
      <div class="container mt-3 col-4">
        <div class="row justify-content-center">
          <div class="col-md-11">
            <div class="card" style="height: 600px; overflow-y: auto">
              <div class="card-header">
                <h5 class="text-center">나만의 지도 만들기</h5>
              </div>
              <div class="card-body">
                <div class="thumbnail-container">
                  <img
                    class="thumbnail"
                    :src="uploadImageFile"
                    alt="사진 없음"
                  />
                  <!-- <div>썸네일 사진</div> -->
                </div>
                <div>
                  <input type="file" @change="onFileSelected" />
                </div>
                <form action="">
                  <div class="mb-3">
                    <label for="subject" class="form-label">글 제목</label>
                    <input
                      type="text"
                      class="form-control"
                      id="subject"
                      placeholder="제목 입력"
                      v-model="subject"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="content" class="form-label">글</label>
                    <input
                      type="text"
                      class="form-control"
                      id="content"
                      placeholder="글 입력"
                      v-model="content"
                    />
                  </div>
                  <ul>
                    <li
                      v-for="place in registeredPlace"
                      :key="place.id"
                      :value="place.id"
                    >
                      {{ place.place_name }}
                      <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        @click.prevent="deletePlace(place.id)"
                      ></button>
                    </li>
                  </ul>

                  <!-- location options start -->
                  <label>scroll</label>
                  <div id="selectLocation" class="select-options mb-3">
                    <button
                      v-for="(locate, index) in location"
                      :key="index"
                      :value="locate"
                      :class="[
                        'btn',
                        'rounded-pill',
                        'slide-item',
                        {
                          'btn-secondary': !selectLocation.includes(locate),
                          'btn-primary': selectLocation.includes(locate),
                        },
                      ]"
                      @click.prevent="optionClick(locate)"
                    >
                      {{ locate }}
                    </button>
                  </div>
                  <div id="selectCategory"></div>
                  <!-- location options end -->

                  <div class="d-flex justify-content-end">
                    <button
                      type=""
                      class="btn btn-primary"
                      data-bs-toggle=""
                      data-bs-target="#exampleModal"
                      id="loginbtn"
                      @click.prevent="makeMap"
                    >
                      만들기
                    </button>
                  </div>
                </form>
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
  height: 80vh;
}
.list-group-item {
  flex: 1; /* 모든 리스트 아이템이 동일한 너비를 갖도록 함 */
  width: 33%; /* 최소 너비를 지정할 수 있음 */
  /*max-width: 150px; /* 최대 너비를 지정할 수 있음 */
  overflow: hidden; /* 내용이 넘칠 경우 숨김 처리 */
  text-overflow: ellipsis; /* 내용이 넘칠 경우 ... 으로 표시 */
  white-space: wrap; /* 줄바꿈 방지 */
}

.thumbnail-container {
  width: 100%;
  height: 60%;
  text-align: center;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.select-options {
  display: flex; /* 요소들을 가로로 나란히 정렬하기 위해 Flexbox 사용 */
  overflow-x: auto; /* 가로로 스크롤 가능하도록 설정 */
  scroll-snap-type: x mandatory; /* 스크롤 스냅 타입을 가로로 설정하여 스크롤 시 가까운 요소에 자동으로 스냅 */
}

.slide-item {
  flex: 0 0 auto; /* 가로 크기를 자동으로 조정하지 않고 고정으로 유지 */
  scroll-snap-align: start; /* 스크롤 시 스냅할 위치 설정 */
}
</style>
