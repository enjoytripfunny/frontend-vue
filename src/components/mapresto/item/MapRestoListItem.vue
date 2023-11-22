<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const mapRestoProps = defineProps({ mapResto: Object });
const mapResto = mapRestoProps.mapResto;
// console.log("mapResto: ", mapResto);
// console.log("mapResto.mapResto.fileInfo.saveFile",  mapResto.fileInfo.saveFile);
// const imgSrc = "@/assets/img/busan.jpg";

const like = ref(false);
const likeInfo = ref({
  userId: "ssafy",
  likeValue: 1,
  mapRestoNo: 1,
});

const changeLike = () => {
  like.value = like.value == true ? false : true;
  likeInfo.value.likeValue = like.value == true ? 1 : -1;
  changeLike(
    likeInfo.value,
    (response) => {
      console.log("changeLike response: " + response);
    },
    (error) => console.error(error)
  );
};
</script>

<template>
  <li class="marRestoCardItem">
    <!-- <img src="@/assets/img/suwon2.jpg" style="width: 230px; height: 230px" /> -->
    <template v-if="mapResto.fileInfo.saveFile == null">
      <img
        :src="`/src/assets/231120/31c69de1-2c6c-40ed-9748-e9f637c053c6.jpg`"
        style="width: 230px; height: 230px"
      />
    </template>
    <template v-if="mapResto.fileInfo.saveFile != null">
      <img
        :src="`/src/assets/${mapResto.fileInfo.saveFolder}/${mapResto.fileInfo.saveFile}`"
        style="width: 230px; height: 230px"
      />
    </template>
    <div style="display: flex">
      <router-link
        :to="{
          name: 'mapresto-view',
          params: { maprestono: mapResto.mapRestoNo },
        }"
        class="article-title link-dark"
      >
        <h6>{{ mapResto.subject }}</h6>
      </router-link>
      <img
        v-show="like.value == false"
        src="@/assets/img/beforeLike.png"
        style="width: 20px; height: 20px; margin-left: 170px"
        @click="changeLike"
      />
      <img
        v-show="like.value == true"
        src="@/assets/img/afterLike.png"
        style="width: 20px; height: 20px; margin-left: 170px"
        @click="changeLike"
      />
    </div>
    <span>{{ mapResto.userId }}</span>
    <div>
      <span>작성 날짜 </span>
      <span>{{ mapResto.registerTime }}</span>
    </div>
  </li>
</template>

<style scoped>
.marRestoCardItem {
  flex: 0 0 calc(25% - 10px);
  /* 한 줄에 4개의 아이템이 표시되도록 설정, 간격을 위해 margin 설정 */
  margin: 5px;
  box-sizing: border-box;
  /* border와 padding이 요소의 크기에 영향을 주지 않도록 설정 */
}
</style>
