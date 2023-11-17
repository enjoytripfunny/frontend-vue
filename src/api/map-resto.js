import { localAxios } from "@/util/http-commons";

const local = localAxios();

function listMapResto(param, success, fail) {
  local.get(`/mapresto/test`, { params: param }).then(success).catch(fail);
}

export { listMapResto };
