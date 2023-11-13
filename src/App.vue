<script setup>
import HeadingNavigationBar from "./components/common/HeadingNavigationBar.vue";

import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <heading-navigation-bar />

    <!-- Map -->
    <router-view></router-view>

    <!-- footer -->
  </div>
</template>

<style scoped></style>
