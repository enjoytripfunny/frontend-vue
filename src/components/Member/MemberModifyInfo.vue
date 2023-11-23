<script setup>
import { ref } from "vue";
import { Modal } from "bootstrap";
import router from "@/router";
import { RouterLink } from "vue-router";
import { useMemberStore } from "@/stores/member";
import { modifyUserInfo, deleteUser } from "@/api/user";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/stores/menu";

const menuStore = useMenuStore();
const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);
const { changeMenuState } = menuStore;
const { userLogout, getUserInfo } = memberStore;

console.log("userInfo: ", userInfo.value);

const newUserInfo = ref({
  userId: userInfo.value.userId,
  userName: userInfo.value.userName,
  emailId: userInfo.value.emailId,
  emailDomain: userInfo.value.emailDomain,
});

const infoModify = () => {
  modifyUserInfo(
    newUserInfo.value,
    (response) => {
      console.log("infoModify response: ", response);
      let token = sessionStorage.getItem("accessToken");
      if (userInfo.value != null && token) {
        getUserInfo(token);
      }

      // router.push({ name: "home" });
    },
    (error) => console.log("infoModify error: ", error)
  );
};

const deleteModal = () => {
  const myModal = new Modal(document.getElementById("delete"));
  myModal.show();
};

const userDelete = () => {
  // delete
  deleteUser(
    { userId: userInfo.value.userId },
    (response) => {
      console.log("userDelete response: ", response);
      localStorage.clear();
      sessionStorage.clear();
      changeMenuState();
      userLogout(userInfo.value.userId);
      router.push({ name: "home" });
    },
    (error) => console.log("userDelete error: ", error)
  );
};
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <!-- header -->
          <div class="card-header">
            <h3 class="text-center">회원 정보 수정</h3>
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
                  v-model="newUserInfo.userId"
                  readonly
                />
              </div>
              <!-- name -->
              <div class="mb-3">
                <label class="form-label">name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newUserInfo.userName"
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
                  v-model="newUserInfo.emailId"
                />
                <!-- @ -->
                <span class="input-group-text">@</span>
                <!-- email domain -->
                <select
                  class="form-select"
                  id="emailDomain"
                  v-model="newUserInfo.emailDomain"
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
              <router-link to="/member/modify/pw">
                <button class="btn btn-success" style="margin-right: 15px">
                  pw modify
                </button>
              </router-link>
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
