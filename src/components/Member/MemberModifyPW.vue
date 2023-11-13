<script setup>
import axios from "axios";
import { Modal } from "bootstrap";
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";

const userInfo = ref(JSON.parse(localStorage.getItem("userInfo")));
const URL = "//localhost:9090/";

const currentPassword = ref();
const changingPassword = ref();
const changingPasswordCheck = ref();
const checked = ref(false);
const chk = computed(() => {
  if (checked.value) {
    return "checked";
  } else {
    return "unchked";
  }
});

const passwordCheck = () => {
  if (userInfo.value.userPassword === currentPassword.value) {
    checked.value = true;
  } else {
    checked.value = false;
  }
};

const passwordModify = () => {
  if (
    checked.value === true &&
    changingPassword.value === changingPasswordCheck.value
  ) {
    axios
      .post(URL + "member/modify", {
        userId: userInfo.value.userId,
        userPassword: changingPassword.value,
        userName: userInfo.value.userName,
        emailId: userInfo.value.emailId,
        emailDomain: userInfo.value.emailDomain,
      })
      .then((response) => {
        console.log(response);
      });
  } else {
    // 비밀번호 확인 모달 !!!
    let myModal = new Modal(document.getElementById("fail"));
    myModal.show();
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <!-- header -->
          <div class="card-header">
            <h3 class="text-center">modify password</h3>
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
                  readonly
                />
              </div>
              <!-- current password -->
              <div class="mb-3">
                <label class="form-label">current password</label>

                <!-- input, button 한줄에 배치-->
                <div class="row">
                  <div class="col-md-9">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Enter current password"
                      v-model="currentPassword"
                    />
                  </div>
                  <div class="col-md-3">
                    <button
                      class="btn"
                      :class="{
                        'btn-primary': checked,
                        'btn-danger': !checked,
                      }"
                      @click.prevent="passwordCheck()"
                      value=""
                    >
                      {{ chk }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- changing password -->
              <div class="mb-3">
                <label class="form-label">changing password</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter changing password"
                  v-model="changingPassword"
                />
              </div>
              <!-- check password -->
              <div class="mb-3">
                <label class="form-label">changing password check</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter changing password check"
                  v-model="changingPasswordCheck"
                />
              </div>

              <!-- button-->
              <button
                class="btn btn-success"
                style="margin-right: 15px"
                @click.prevent="passwordModify"
              >
                pw modify
              </button>
              <router-link to="/member/modify/info">
                <button class="btn btn-secondary">my page</button>
              </router-link>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- modal -->
    <div
      class="modal fade"
      id="fail"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- modal head -->
          <div class="modal-header">
            <h5 class="modal-title text-red" id="exampleModalLabel">fail</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- modal body-->
          <div class="modal-body">check input</div>
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

<style scoped></style>
