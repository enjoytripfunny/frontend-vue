<script setup>
</script>

<template>
  <li class="marRestoCardItem">
    <!-- <img src="@/assets/img/suwon2.jpg" style="width: 230px; height: 230px" /> -->
    <img
      :src="`/src/assets/231120/${mapResto.fileInfo.saveFile}`"
      style="width: 150px; height: 200px"
    />
    <div style="display: flex">
      <h6>{{ mapResto.subject }}</h6>
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