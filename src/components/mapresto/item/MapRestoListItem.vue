<script setup>
import { ref } from "vue";
import { registerLike } from "@/api/map-resto";
import { useMemberStore } from "@/stores/member";

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
  like.value = like.value == 1 ? -1 : 1;
  likeInfo.value.likeValue = like.value;
  registerLike(
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
      <router-link
        :to="{
          name: 'mapresto-view',
          params: { maprestono: mapResto.mapRestoNo },
        }"
        class="article-title link-dark"
      >
        <img
          :src="`/src/assets/231120/ceefd905-1a26-405a-8487-3d91be816778.jpg`"
          style="width: 230px; height: 230px"
        />
      </router-link>
    </template>
    <template v-if="mapResto.fileInfo.saveFile != null">
      <router-link
        :to="{
          name: 'mapresto-view',
          params: { maprestono: mapResto.mapRestoNo },
        }"
        class="article-title link-dark"
      >
        <img
          :src="`/src/assets/${mapResto.fileInfo.saveFolder}/${mapResto.fileInfo.saveFile}`"
          style="width: 230px; height: 230px"
        />
      </router-link>
    </template>
    <div style="display: flex">
      <div style="display: flex">
        <h6>{{ mapResto.subject }}</h6>

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
          v-show="like == -1"
          src="@/assets/img/beforeLike.png"
          style="width: 20px; height: 20px; margin-left: auto"
          @click="changeLike"
        />
        <img
          v-show="like == 1"
          src="@/assets/img/afterLike.png"
          style="width: 20px; height: 20px; margin-left: auto"
          @click="changeLike"
        />
      </div>
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
