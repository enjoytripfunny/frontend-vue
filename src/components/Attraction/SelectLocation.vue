<script setup>
import { ref } from "vue";

const sidoCode = ref(""); // v-model에서 사용
const handleSidoChange = () => {}; // @change에서 사용
</script>

<template>
  <div>
    <form action="" class="row g-3 m-3">
      <div class="col">
        <select
          class="form-select"
          id="select-sido"
          v-model="sidoCode"
          @change="handleSidoChange"
        >
          <option selected disabled="disabled" value="">시도선택</option>
          <option value="1">서울</option>
          <option value="2">인천</option>
          <option value="3">대전</option>
          <option value="4">대구</option>
          <option value="5">광주</option>
          <option value="6">부산</option>
          <option value="7">울산</option>
          <option value="8">세종특별자치시</option>
          <option value="31">경기도</option>
          <option value="32">강원도</option>
          <option value="33">충청북도</option>
          <option value="34">충청남도</option>
          <option value="35">경상북도</option>
          <option value="36">경상남도</option>
          <option value="37">전라북도</option>
          <option value="38">전라남도</option>
          <option value="39">제주도</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select" id="select-gugun">
          <option selected disabled="disabled" value="">구군선택</option>
        </select>
      </div>
      <div class="col">
        <select class="form-select" id="select-content">
          <option selected disabled="disabled">컨텐츠</option>
          <option value="12">관광지</option>
          <option value="14">문화시설</option>
          <option value="15">축제공연행사</option>
          <option value="25">여행코스</option>
          <option value="28">레포츠</option>
          <option value="32">숙박</option>
          <option value="38">쇼핑</option>
          <option value="39">음식점</option>
          <value></value>
        </select>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
