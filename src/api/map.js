import { localAxios } from "@/util/http-commons";

const local = localAxios();

// api ...

// have param
const mapRegister = (param, success, fail) => {
  local.get(`/mapresto/register`, param).then(success).catch(fail);
};

// no param
// const ex = (success, fail) => {
//   local.get(`/address`).then(success).catch(fail);
// };

export { mapRegister };
