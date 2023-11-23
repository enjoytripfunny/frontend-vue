<script setup>
import { ref, watch } from "vue";

const mapResto = defineProps({
  mapResto: Object,
  ischekced: Boolean,
  restoApiIds: Object,
  starApiIds: Object,
  count: Object,
});
const emit = defineEmits(["someEvent", "emitArgs"]);

const ischekced = ref(false);

const emitArgs = () => {
  ischekced.value = !ischekced.value;
  emit("emitArgs", [ischekced.value, mapResto.mapResto.mapRestoNo]);
  console.log(ischekced.value);
};

watch(
  () => mapResto.count[0],
  (newValue, oldValue) => {
    if (newValue < 1) {
      ischekced.value = false;
    }
  },
  {
    immediate: true, // 초기 변경에도 즉시 반응하도록 설정
    deep: true, // 객체 내부의 변경도 감지
    // 그 외 추가 옵션들을 여기에 추가할 수 있습니다.
  }
);
// 변경된 값에 따라 원하는 작업을 수행할 수 있습니다.
</script>

<template>
  <!-- <li class="marRestoCardItem"> -->
  <div class="marRestoCardItem">
    <div
      :class="{
        checkedItem: ischekced,
        notChecked: !ischekced,
      }"
    >
      <!-- <img src="@/assets/img/suwon2.jpg" style="width: 230px; height: 230px" /> -->
      <img
        :src="`/src/assets/${mapResto.mapResto.fileInfo.saveFolder}/${mapResto.mapResto.fileInfo.saveFile}`"
        style="width: 15vh; height: 20vh"
        @click="emitArgs"
      />
      <div>
        <h6>{{ mapResto.mapResto.subject }}</h6>
        <div>{{ mapResto.apiIds }}</div>
      </div>
    </div>
  </div>
  <!-- </li> -->
</template>

<style scoped>
.marRestoCardItem {
  flex: 0 0 calc(25% - 10px);
  /* 한 줄에 4개의 아이템이 표시되도록 설정, 간격을 위해 margin 설정 */
  margin: 5px;
  box-sizing: border-box;
  /* border와 padding이 요소의 크기에 영향을 주지 않도록 설정 */
}

.checkedItem {
  border: 2px solid rgb(245, 105, 249);
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
  /* background-color: #3498db;
  opacity: 0.5; */
}

.notChecked {
  border: 1px solid #000;
  background-color: rgb(255, 255, 255);
  opacity: 0.5;
}
</style>
