<script setup>
import { onMounted, ref, toRaw } from "vue";
import axios from "axios";
import { start } from "@popperjs/core";

const KAKAO_SERVICE_KEY = "066c4bf5fb8745fcc2b066ec145bb938";

const BASIC_MARKER = "https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png";
const STAR_IMG =
  "https://user-images.githubusercontent.com/70050038/284016597-7a30594e-bf67-454b-af93-17b100054d02.png";
const CLICK_IMG =
  "https://user-images.githubusercontent.com/70050038/284038352-dfe61846-ac5e-4ccd-9f64-a738a50fbc9e.png";

const map = ref(); // map object
const ps = ref(); // place search object

const infowindow = ref(); // marker's info window object

const markers = ref([]); // markers
const markersData = ref([]); // markers data 지도에 뜬 모든 마커의 데이터, 지도에 마커 찍을 때 사용

const starMarkers = ref([]);
const starMarkersData = ref([]);

const registeredPlace = ref([]); // 등록된 장소(마커에서 추가한 장소)
const subject = ref(); // 제목
const content = ref(); // 글
const tags = ref([]); // 지역 태그 최대 3개(서울, 대전 ...)

const restos = ref([]);

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
const displayMarkers = () => {
  // delete markers
  if (markers.value.length > 0) {
    markers.value.forEach((marker) => {
      //   console.log(marker);
      marker.setMap(null);
    });
  }

  // create new markers, and save values at positions
  const positions = markersData.value.map(
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
          image: new kakao.maps.MarkerImage(
            BASIC_MARKER,
            new kakao.maps.Size(31, 35)
          ),
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
                      <h3>${markersData.value[index].place_name}</h3>
                      <div class="closeBtn" onclick="closeOverlay()" title="닫기"></div>
                  </div>
                  <div class="body">
                      <div>
                          <div class="ellipsis">${markersData.value[index].road_address_name}</div>
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
          zIndex: 1,
          content: infowindowContent,
          position: marker.getPosition(),
          removable: true,
        });

        infowindow.value.open(map.value, marker);
      });
    });
  }
};

// map init map setting // category : FD6 음식점 CE7 카페
const initMap = () => {
  infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 });

  // start basic map
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(37.50378611, 127.0248221),
    level: 3,
  };

  map.value = new kakao.maps.Map(container, options);
  map.value.setMapTypeId(kakao.maps.MapTypeId.NORMAL);
  // end basic map

  // start add control
  // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
  const mapTypeControl = new kakao.maps.MapTypeControl();
  map.value.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
  const zoomControl = new kakao.maps.ZoomControl();
  map.value.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  // end add control

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
      if (markers.value.length > 0) {
        markers.value.forEach((marker) => {
          //   console.log(marker);
          marker.setMap(null);
        });
      }

      return;
    }

    // 카테고리 id FD6, CE7
    ps.value = new kakao.maps.services.Places(map.value);
    ps.value.categorySearch(this.id, placesSearchCB, {
      useMapBounds: true,
    });
  }

  //   ps.value = new kakao.maps.services.Places(map.value); // categorySearch(b, g, e), keywordSearch, setMap
  //   ps.value.categorySearch("FD6", placesSearchCB, { useMapBounds: true });

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function placesSearchCB(data, status) {
    console.log(data);

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
      displayMarkers();
    }
  }
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
        registered: false,
      };
    });

    if (status === kakao.maps.services.Status.OK) {
      displayMarkers();
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
  //   별 모양 제거하고 일반 마크로 변경
  for (var index = 0; index < markersData.value.length; index++) {
    if (markersData.value[index].id === id) {
      markers.value[index].setImage(
        new kakao.maps.MarkerImage(BASIC_MARKER, new kakao.maps.Size(31, 35))
      );
    }
  }

  for (index = 0; index < starMarkersData.value.length; index++) {
    if (starMarkersData.value[index].id === id) {
      starMarkers.value[index].setMap(null);
    }
  }

  // 등록된 장소 목록에서 요소 제거
  registeredPlace.value = registeredPlace.value.filter((place) => {
    return place.restoApiId !== id;
  });
};

// 등록된 장소 클릭 : 해당 위치로 이동
const registeredPlaceClick = () => {
  console.log("click ~!~!~!");
};

const uploadImageFile = ref(); // image source
// 이미지 웹에 띄우기
const onFileSelected = (event) => {
  const input = event.target;
  if (input.files /* && input.files[0] */) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadImageFile.value = e.target.result; // image source 매우 긴 영어
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
  fileInfo: uploadImageFile.value, //맛지도 썸네일
  restos: registeredPlace.value, //맛지도안에 맛집들의 api 아이디
  tags: selectLocation.value, //맛지도에 대한 태그
  registerTime: "", //맛지도 만들어진 날짜
});

// 기본적인 설정
const axiosInstance = axios.create({
  baseURL: "http://localhost:9090", // 기본 URL 설정
  mode: "cors",
  headers: {
    "Content-Type": "multipart/form-data", // Content-Type을 반드시 이렇게 하여야 한다.
  },
});

// 만들기 버튼 클릭 이벤트
// const makeMap = () => {

//   console.log("make map !!!");
//   console.log(restoMap.value.restos[0]);
//   axiosInstance
//     .post("/mapresto/reg", restoMap.value)
//     .then((response) => console.log(response))
//     .catch((error) => console.log(error));
// };
const makeMap = () => {
  console.log("make map !!!");
  console.log(selectLocation);
  const formData = new FormData();
  formData.append("file", uploadImageFile.value.files[0]);
  // // formData.append("fileInfo", uploadImageFile.value);
  // // formData.append("content", "test");
  formData.append("userId", "ssafy");
  formData.append("subject", "제목 test");
  formData.append("content", "testtest");
  // formData.append("restoInfo", JSON.stringify(resData));
  formData.append("restos", JSON.stringify(resData));
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
    .then((response) => console.log(response))
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

<template>
  <div>
    <div class="row">
      <div class="col-md-3">
        <!-- 검색 입력창과 버튼 -->
        <div class="input-group p-3">
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
      <div class="col-8">
        <div class="map_wrap">
          <div id="map" style="position: relative; overflow: hidden"></div>
          <ul id="category" style="margin-left: 20px">
            <li id="FD6" data-order="0" class="restaurant">음식점</li>
            <li id="CE7" data-order="0" class="cafe">카페</li>
            <li id="">X</li>
          </ul>
        </div>
      </div>
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
                      :key="place.restoApiId"
                      :value="place.restoApiId"
                      class="list-item"
                      @click.prevent="registeredPlaceClick"
                    >
                      {{ place.restoName }}
                      <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        @click.prevent="deletePlace(place.restoApiId)"
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
                      class="btn btn-primary mb-3"
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

/* wrapped map button */
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
#category {
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 2px;
  border: 1px solid #909090;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
  background: #fff;
  overflow: hidden;
  z-index: 2;
}
#category li {
  float: left;
  list-style: none;
  width: 50px;
  height: 35px;
  line-height: 25px;
  border-right: 1px solid #acacac;
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
}
#category li.on {
  background: #eee;
}
#category li:hover {
  background: #94befc;
  border-left: 1px solid #acacac;
  margin-left: -1px;
}
#category li:last-child {
  margin-right: 0;
  border-right: 0;
}
#category li span {
  display: block;
  margin: 0 auto 3px;
  width: 27px;
  height: 28px;
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

/* 호버 시 이미지 변경 */
.list-item:hover {
  background-image: url("https://user-images.githubusercontent.com/70050038/284016597-7a30594e-bf67-454b-af93-17b100054d02.png");
  /* 다른 스타일 */
}
</style>
