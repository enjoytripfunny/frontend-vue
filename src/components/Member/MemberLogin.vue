<script setup>
import { ref } from "vue";
const remember = ref();
const memberLogin = () => {
  // REST API를 통한 로그인 구현
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
                <label for="username" class="form-label">email</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  placeholder="Enter your email"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Enter your password"
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
              <button
                type="submit"
                class="btn btn-primary"
                @click="memberLogin"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
