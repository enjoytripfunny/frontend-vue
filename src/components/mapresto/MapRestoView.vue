<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue'
import {getMapRestoView} from "@/api/map-resto.js";

const route = useRoute();
const {mapRestoNo} = route.params;

const mapRestoView = ref({});

onMounted(() => {
  getMapResto();
})

const getMapResto = () => {
  getMapRestoView(
    mapRestoNo,
    ({data}) => {
      mapRestoView.value = data.mapResto;
      console.log("getMapResto data: ", data);
    },
    (error) => {
      console.error(error);
    }
  )
}

</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">맛지도 View</mark>
        </h2>
      </div>
      <div class="col-lg-6">
        <img
          src="@/assets/231120/dc63959c-e527-4d84-b53c-65261d2acf78.jpg"
          style="width: 600px; height: 600px"
        />
      </div>
      <div class="col-lg-6">
        <h3>{{ mapRestoView.subject }}</h3>
        <div> <span>{{ mapRestoView.userId }}</span></div>
        <div> <span>{{ mapRestoView.registerTime }}</span></div>
        <p>{{ mapRestoView.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>