import { localAxios } from "@/util/http-commons.js";

const local = localAxios();

const memberLoginAPI = (param, success, fail) => {
  local.post(`/member/login`, param).then(success).catch(fail);
};

export { memberLoginAPI };
