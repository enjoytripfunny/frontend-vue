<script setup>
import { ref } from "vue";
import { registerLike } from "@/api/map-resto";
import { useMemberStore } from "@/stores/member";

const DEFAULT_IMG = `https://user-images.githubusercontent.com/70050038/285240337-166b088b-584e-48a2-9e7b-356f9913b2c6.png`;

const mapRestoProps = defineProps({ mapResto: Object });
const mapResto = mapRestoProps.mapResto;
const memberStore = useMemberStore();
const like = ref();
like.value = mapResto.likeValue == 1 ? 1 : -1;

const likeInfo = ref({
  userId: memberStore.getUserId,
  likeValue: "",
  mapRestoNo: mapResto.mapRestoNo,
});

const changeLike = () => {
  if (memberStore.getUserId != null) {
    like.value = like.value == 1 ? -1 : 1;
    likeInfo.value.likeValue = like.value;
    registerLike(
      likeInfo.value,
      (response) => {
        console.log("changeLike response: " + response);
      },
      (error) => console.error(error)
    );
  }
};
</script>

<template>
  <div id="box" class="marRestoCardItem">
    <!-- <img src="@/assets/img/suwon2.jpg" style="width: 230px; height: 230px" /> -->

    <div
      v-if="mapResto.fileInfo != null"
      style="overflow: hidden; border: 0.3px solid #3e3e3e"
    >
      <router-link
        :to="{
          name: 'mapresto-view',
          params: { maprestono: mapResto.mapRestoNo },
        }"
        class="article-title link-dark"
      >
        <img
          :src="`/src/assets/${mapResto.fileInfo.saveFolder}/${mapResto.fileInfo.saveFile}`"
          style="width: 100%; height: 32vh"
        />
      </router-link>
    </div>
    <!--style="overflow: hidden"-->
    <div v-else>
      <router-link
        :to="{
          name: 'mapresto-view',
          params: { maprestono: mapResto.mapRestoNo },
        }"
        class="article-title link-dark"
      >
        <img :src="DEFAULT_IMG" style="width: 100%; height: 32vh" />
      </router-link>
    </div>

    <div>
      <div>
        <img
          v-show="like == -1"
          src="@/assets/img/beforeLike.png"
          style="width: 20px; height: 20px; margin-left: 91%"
          @click="changeLike"
        />
        <img
          v-show="like == 1"
          src="@/assets/img/afterLike.png"
          style="width: 20px; height: 20px; margin-left: 91%"
          @click="changeLike"
        />
      </div>
    </div>
    <span style="margin: 5%; font-weight: bolder">{{ mapResto.userId }}</span>
    <span style="margin-left: -2%; margin-bottom: 10%">
      {{ mapResto.subject }}
    </span>
  </div>
</template>

<style scoped>
.marRestoCardItem {
  flex: 0 0 calc(25% - 10px);
  /* 한 줄에 4개의 아이템이 표시되도록 설정, 간격을 위해 margin 설정 */
  margin: 5px;
  box-sizing: border-box;
  /* border와 padding이 요소의 크기에 영향을 주지 않도록 설정 */
}

#box {
  border: 1px solid #1d1d1d; /* border 설정 */
  border-radius: 10px; /* border 둥글기 설정 */
  overflow: hidden;
  height: 42vh;
  width: 40vh;
}
</style>
