import { localAxios, formAxios } from "@/util/http-commons";

const local = localAxios();
const form = formAxios();

// 맛지도 게시물 목록 가져오기
function listMapResto(param, success, fail) {
  local.get(`/mapresto`, { params: param }).then(success).catch(fail);
}

function changeLike(param, success, fail) {
  local.post(`/mapresto/like`).then(success).catch(fail);
}

function registMapResto(mapresto, success, fail) {
  form.post(`/mapresto/reg`, mapresto).then(success).catch(fail);
  // local.post(`/mapresto/reg`, JSON.stringify(article)).then(success).catch(fail);
}

// 내가 작성한 맛지도 가져오기
function listMyMapResto(param, success, fail) {
  local
    .get(`/mapresto/myMapResto`, { params: param })
    .then(success)
    .catch(fail);
}

//좋아요 누른 맛지도 가져오기
function listLikeMapResto(param, success, fail) {
  local
    .get(`/mapresto/likeMapResto`, { params: param })
    .then(success)
    .catch(fail);
}

function getMapRestoView(mapRestoNo, success, fail) {
  local.get(`/mapresto/${mapRestoNo}`).then(success).catch(fail);
}

function getMapRestos(args, success, fail) {
  local
    .get(`/mapresto/userResto`, { params: { mapRestoNo: args } })
    .then(success)
    .catch(fail);
}

export {
  listMapResto,
  changeLike,
  registMapResto,
  listMyMapResto,
  listLikeMapResto,
  getMapRestoView,
  getMapRestos,
};
