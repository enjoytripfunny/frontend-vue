<script setup></script>

<template>
  <div>
    <div class="container mt-5">
      <div class="justify-content-center">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">회원가입</h3>
          </div>
          <div class="card-body">
            <form action="">
              <div class="mb-3">
                <label class="form-label needs-validation">id</label>

                <!-- input's class : is-valid, is-invalid >> 동적으로 처리 -->
                <input
                  type="text"
                  class="form-control is-valid mb-1"
                  placeholder="Enter id"
                />

                <!-- input's class가 is-valid일 때 적용 -->
                <div class="valid-feedback">사용할 수 있는 아이디입니다.</div>

                <!-- input's class가 is-invalid일 때 적용 -->
                <div class="invalid-feedback">사용할 수 없는 아이디입니다.</div>
              </div>
              <div class="mb-3">
                <label class="form-label">name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter name"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">password</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter password"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">check password</label>
                <input
                  type="text"
                  class="form-control is-invalid"
                  placeholder="Enter check password"
                />
                <!-- input's class가 is-valid일 때 적용 -->
                <div class="valid-feedback">비밀번호가 일치합니다.</div>

                <!-- input's class가 is-invalid일 때 적용 -->
                <div class="invalid-feedback">
                  일치하지 않는 비밀번호입니다.
                </div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">email</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    placeholder="Enter your email"
                  />
                  <span class="input-group-text">@</span>
                  <select class="form-select" id="emailDomain" required>
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
                style="margin-right: 20px"
                @click="memberSignup"
              >
                Login
              </button>

              <router-link to="/">
                <button
                  type="submit"
                  class="btn btn-secondary"
                  @click="memberSignup"
                >
                  Home
                </button>
              </router-link>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
