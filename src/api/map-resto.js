import { localAxios, formAxios } from "@/util/http-commons";

const local = localAxios();
const form = formAxios();

function listMapResto(param, success, fail) {
  local.get(`/mapresto`, { params: param }).then(success).catch(fail);
  // local.get(`/mapresto`, { params: param }).then(success).catch(fail);
}

function changeLike(param, success, fail) {
  local.post(`/mapresto/like`).then(success).catch(fail);
}

function registMapResto(mapresto, success, fail) {
  form.post(`/mapresto/reg`, mapresto).then(success).catch(fail);
  // local.post(`/mapresCto/reg`, mapresto).then(success).catch(fail);
  // local.post(`/mapresto/reg`, JSON.stringify(article)).then(success).catch(fail);
}

export { listMapResto, changeLike, registMapResto };
