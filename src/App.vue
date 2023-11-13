<script setup>
// navbar, footer { } 붙이면 오류남 ...
import HeadingNavigationBar from "@/components/common/HeadingNavigationBar.vue";
import FooterBar from "@/components/common/FooterBar.vue";

import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <!-- header -->
    <heading-navigation-bar />

    <!-- map -->
    <router-view></router-view>

    <!-- footer -->
    <footer-bar></footer-bar>
  </div>
</template>

<style scoped></style>
