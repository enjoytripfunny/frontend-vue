import { localAxios, formAxios } from "@/util/http-commons";

const local = localAxios();
const form = formAxios();

// 맛지도 게시물 목록 가져오기
function listMapResto(mapRestoParam, success, fail) {
  local.get(`/mapresto`, mapRestoParam).then(success).catch(fail);
}

// 좋아요 값 변경
function registerLike(likeInfo, success, fail) {
  local.post(`/mapresto/like`, likeInfo).then(success).catch(fail);
}

// 맛지도 생성
function registMapResto(mapresto, success, fail) {
  form.post(`/mapresto/reg`, mapresto).then(success).catch(fail);
  // local.post(`/mapresto/reg`, JSON.stringify(article)).then(success).catch(fail);
}

// 내가 작성한 맛지도 가져오기
function listMyMapResto(param, success, fail) {
  local.get(`/mapresto/myMapResto`, { params: param }).then(success).catch(fail);
}

// 좋아요 누른 맛지도 가져오기
function listLikeMapResto(param, success, fail) {
  local.get(`/mapresto/likeMapResto`, { params: param }).then(success).catch(fail);
}

// 맛지도 상세 보기
function getMapRestoView(maprestono, success, fail) {
  local.get(`/mapresto/view/${maprestono}`).then(success).catch(fail);
}

// 맛지도에 저장한 식당들 가져오기
function getUserMapResto(param, success, fail) {
  local.get(`/mapresto/userResto`, { params: param }).then(success).catch(fail);
}

// 화면 캡처 테스트용
// function captureImg(mapresto, success, fail) {
//   form.post(`/mapresto/reg`, mapresto).then(success).catch(fail);
//   // local.post(`/mapresto/reg`, JSON.stringify(article)).then(success).catch(fail);
// }

export {
  listMapResto,
  registerLike,
  registMapResto,
  listMyMapResto,
  listLikeMapResto,
  getMapRestoView,
  getUserMapResto,
  // captureImg
};
