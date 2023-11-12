<script setup>
import { ref } from "vue";
import { Modal } from "bootstrap";
import axios from "axios";
import router from "@/router";

const URL = "//localhost:9090/";

const userId = ref("");
const userName = ref("");
const userPassword = ref("");
const userPasswordCheck = ref("");
const emailId = ref("");
const emailDomain = ref("");

const passwordValid = ref("form-control");

const checkPasswordMatch = () => {
  if (userPassword.value === userPasswordCheck.value) {
    passwordValid.value = "form-control is-valid";
  } else {
    passwordValid.value = "form-control";
  }
};

const memberJoin = () => {
  if (
    userId.value === "" ||
    userName.value === "" ||
    userPassword.value === "" ||
    userPasswordCheck.value === "" ||
    emailId.value === "" ||
    emailDomain.value === ""
  ) {
    // <form을 모두 작성해주세요> 모달 띄우기 !!!
    new Modal(document.getElementById("emptyCheckModal")).show();
  } else if (userPassword.value !== userPasswordCheck.value) {
    // <비밀번호 확인> 모달 띄우기 !!!
    new Modal(document.getElementById("passwordCheckModal")).show();
  } else {
    axios
      .post(URL + "member/signup", {
        userId: userId.value,
        userName: userName.value,
        userPassword: userPassword.value,
        emailId: emailId.value,
        emailDomain: emailDomain.value,
      })
      .then((response) => {
        console.log(response);
        router.push({ path: "/" });
      });
  }
};
</script>

<template>
  <div>
    <div class="container mt-5">
      <div class="justify-content-center">
        <!-- card -->
        <div class="card">
          <!-- header -->
          <div class="card-header">
            <h3 class="text-center">회원가입</h3>
          </div>

          <!-- body -->
          <div class="card-body">
            <form action="">
              <!-- id -->
              <div class="mb-3">
                <label class="form-label needs-validation">id</label>
                <input
                  type="text"
                  class="form-control mb-1"
                  placeholder="Enter id"
                  v-model="userId"
                />
              </div>
              <!-- name -->
              <div class="mb-3">
                <label class="form-label">name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter name"
                  v-model="userName"
                />
              </div>
              <!-- password -->
              <div class="mb-3">
                <label class="form-label">password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Enter password"
                  v-model="userPassword"
                  @input="checkPasswordMatch"
                />
              </div>
              <!-- password check -->
              <div class="mb-3">
                <label class="form-label">check password</label>
                <input
                  type="password"
                  :class="passwordValid"
                  placeholder="Enter check password"
                  v-model="userPasswordCheck"
                  @input="checkPasswordMatch"
                />
                <!-- input's class가 is-valid일 때 적용 -->
                <div class="valid-feedback">비밀번호가 일치합니다.</div>

                <!-- input's class가 is-invalid일 때 적용 -->
                <!-- <div class="invalid-feedback">
                  일치하지 않는 비밀번호입니다.
                </div> -->
              </div>
              <!-- email -->
              <div class="mb-3">
                <label for="email" class="form-label">email</label>
                <div class="input-group">
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
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                style="margin-right: 15px"
                @click.prevent="memberJoin"
              >
                Join
              </button>

              <router-link to="/">
                <button type="submit" class="btn btn-secondary">Home</button>
              </router-link>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- modal -->
    <!-- field value가 모두 채워 있는지 확인 -->
    <div class="modal fade" id="emptyCheckModal">
      <!-- modal-dialog 없으면 모달창 안뜸 -->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header">
            <h5 class="modal-title">join fail</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <!-- body -->
          <div class="modal-body">fill out all the form fields</div>
        </div>
      </div>
    </div>
    <!-- modal -->
    <!-- 패스워드 입력이 동일한지 확인 -->
    <div class="modal fade" id="passwordCheckModal">
      <!-- modal-dialog 없으면 모달창 안뜸 -->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header">
            <h5 class="modal-title">join fail</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <!-- body -->
          <div class="modal-body">check both password</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
