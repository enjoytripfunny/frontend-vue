import { localAxios } from "@/util/http-commons";

const local = localAxios();

function listMapResto(param, success, fail) {
  local.get(`/mapresto`, {parms: param}).then(success).catch(fail);
  // local.get(`/mapresto`, { params: param }).then(success).catch(fail);
}

function changeLike(param, success, fail) {
  local.post(`/tripboard/like`).then(success).catch(fail);
}

export { listMapResto, changeLike };
