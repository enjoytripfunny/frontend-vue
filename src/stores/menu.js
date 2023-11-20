import { ref } from "vue";
import { defineStore } from "pinia";

export const useMenuStore = defineStore(
  "menuStore",
  () => {
    const menuList = ref([
      // { name: "회원가입", show: true, routeName: "member-signup" },
      // { name: "로그인", show: true, routeName: "member-login" },
      // { name: "마이페이지", show: false, routeName: "member-modify" },
      // { name: "로그아웃", show: false },
      { name: "로그인상태", show: false },
      { name: "로그아웃상태", show: true },
    ]);

    const changeMenuState = () => {
      menuList.value = menuList.value.map((item) => ({
        ...item,
        show: !item.show,
      }));

      console.log("menu list >> " + menuList.value);
    };

    // 추가: vuex-persistedstate 설정
    // const persistPlugin = createPersistedState({
    //   key: "menuStore", // 저장되는 키 이름 설정
    //   paths: ["menuList"], // 지속시킬 데이터 경로
    // });

    return {
      menuList,
      changeMenuState,
    };
  },
  {
    persist: true,
  }
);
