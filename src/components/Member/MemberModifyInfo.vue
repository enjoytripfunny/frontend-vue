<script setup>
import { ref } from "vue";
import axios from "axios";
import { Modal } from "bootstrap";
import router from "@/router";

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

const deleteModal = () => {
  const myModal = new Modal(document.getElementById("delete"));
  myModal.show();
};

const userDelete = () => {
  // delete

  axios
    .get(URL + "member/delete", {
      params: {
        userId: userId.value,
      },
    })
    .then((response) => {
      if (response.data.msg === "success") {
        localStorage.clear();
        router.push({ path: "/" });
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
              <button class="btn btn-danger" @click.prevent="deleteModal">
                delete
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- delete modal -->
    <div
      class="modal fade"
      id="delete"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- modal head -->
          <div class="modal-header">
            <h5 class="modal-title text-red" id="exampleModalLabel">
              정말 삭제하시겠습니까?
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- modal body-->
          <div class="modal-body">
            삭제 이후, 더 이상 계정을 사용할 수 없습니다.
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              style="margin-right: 15px"
              data-bs-dismiss="modal"
              @click="userDelete()"
            >
              delete
            </button>
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

<style scoped></style>
