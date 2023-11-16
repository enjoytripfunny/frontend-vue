<script setup>
import { ref /*watch*/ } from "vue";
import "vue-router";
import axios from "axios";

import { Modal } from "bootstrap";
import router from "@/router";

const URL = "//localhost:9090/";

// why ref?
const postMember = ref({
  userId: "",
  userPassword: "",
});

const remember = ref();

// postMember 객체의 변경을 감시하고, 변경 시 로그에 출력
// postNenber.value 사용할 것 !!!
// watch(postMember.value, (newValue, oldValue) => {});

const memberLogin = () => {
  // REST API를 통한 로그인 구현
  axios.post(URL + "member/login", postMember.value).then((res) => {
    if (res.data.userId === postMember.value.userId) {
      // login success
      console.log(res.data.userId);
      console.log(res.data.userName);
      console.log(res.data.userPassword);
      console.log(res.data.emailId);
      console.log(res.data.emailDomain);

      // 저장할 때, JSON.stringify
      // 사용할 때, JSON.parse
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          userId: res.data.userId,
          userName: res.data.userName,
          userPassword: res.data.userPassword,
          emailId: res.data.emailId,
          emailDomain: res.data.emailDomain,
        })
      );

      localStorage.setItem("userName", res.data.userName);

      // router 사용하기 위해 < import router from "@/router" >
      router.push({ path: "/" });
    } else {
      // login fail
      // Modal 객체 사용하기 위해 < import { Modal } from "bootstrap" >
      let myModal = new Modal(document.getElementById("loginModal"));
      myModal.show();
    }
  });
  console.log(postMember);
};
</script>

<!-- use bootstrap's card component -->
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Login</h3>
          </div>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label for="userid" class="form-label">id</label>
                <input
                  type="text"
                  class="form-control"
                  id="userid"
                  placeholder="Enter your id"
                  v-model="postMember.userId"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Enter your password"
                  v-model="postMember.userPassword"
                />
              </div>
              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="rememberMe"
                  v-model="remember"
                />
                <label class="form-check-label" for="rememberMe"
                  >remember email</label
                >
              </div>

              <div>
                <button
                  type=""
                  class="btn btn-primary"
                  data-bs-toggle=""
                  data-bs-target="#exampleModal"
                  id="loginbtn"
                  @click.prevent="memberLogin"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- modal -->
    <div
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- modal head -->
          <div class="modal-header">
            <h5 class="modal-title text-red" id="exampleModalLabel">
              login fail
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- modal body-->
          <div class="modal-body">check id, password</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-red {
  color: red;
}
</style>
