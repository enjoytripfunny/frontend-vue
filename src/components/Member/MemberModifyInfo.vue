<script setup>
import { ref } from "vue";
import axios from "axios";

const userInfo = ref(JSON.parse(localStorage.getItem("userInfo")));
const URL = "//localhost:9090/";

const userId = ref(userInfo.value.userId);
const userName = ref(userInfo.value.userName);
const userPassword = ref(userInfo.value.userPassword);
const emailId = ref(userInfo.value.emailId);
const emailDomain = ref(userInfo.value.emailDomain);

const infoModify = () => {
  axios
    .post(URL + "/member/modify", {
      userId: userId.value,
      userName: userName.value,
      userPassword: userInfo.value.userPassword,
      emailId: emailId.value,
      emailDomain: emailDomain.value,
    })
    .then((response) => {
      console.log(response);
      if (response.data.msg === "success") {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            userId: userId.value,
            userName: userName.value,
            userPassword: userPassword.value,
            emailId: emailId.value,
            emailDomain: emailDomain.value,
          })
        );
      }
    });
};
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <!-- header -->
          <div class="card-header">
            <h3 class="text-center">my page</h3>
          </div>
          <!-- body-->
          <div class="card-body">
            <form>
              <!-- id -->
              <div class="mb-3">
                <label class="form-label">id</label>
                <input
                  type="text"
                  class="form-control"
                  :placeholder="userInfo.userId"
                  v-model="userId"
                  readonly
                />
              </div>
              <!-- name -->
              <div class="mb-3">
                <label class="form-label">name</label>
                <input
                  type="text"
                  class="form-control"
                  :placeholder="userInfo.userName"
                  v-model="userName"
                />
              </div>

              <!-- email -->

              <label class="form-label">email</label>
              <div class="input-group mb-5">
                <!-- email id -->
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  placeholder="Enter your email"
                  v-model="emailId"
                />
                <!-- @ -->
                <span class="input-group-text">@</span>
                <!-- email domain -->
                <select
                  class="form-select"
                  id="emailDomain"
                  v-model="emailDomain"
                  required
                >
                  <option value="" selected disabled>Select domain</option>
                  <option value="ssafy.com">ssafy.com</option>
                  <option value="naver.com">naver.com</option>
                  <option value="google.com">google.com</option>
                </select>
              </div>
              <!-- button-->
              <button
                class="btn btn-primary"
                style="margin-right: 15px"
                @click.prevent="infoModify"
              >
                info modify
              </button>
              <button class="btn btn-success" style="margin-right: 15px">
                pw modify
              </button>
              <button class="btn btn-danger">delete</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
