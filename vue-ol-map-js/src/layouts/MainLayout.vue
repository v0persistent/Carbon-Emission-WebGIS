<template>
  <div class="main-layout">
    <div class="bg-layer"></div>
    <slot />
  </div>
</template>

<style scoped>
.main-layout {
  width: 100%;
  height: 100%;
}

.bg-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  
  /* ✅ 背景图路径（根据你的项目调整） */
  background-image: url('D:\cursor_data\vue-ol-map1_5_12_组件化前\vue-ol-map1\vue-ol-map-js\src\assets\bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  /* ✅ 雾面效果核心 */
  filter: blur(4px);           /* 模糊 */
  transform: scale(1.05);      /* 防止模糊露白边 */
}
</style>
