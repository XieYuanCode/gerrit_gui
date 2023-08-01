<template>
  <div class="key-square">
    <div class="key-square-child">
      {{ props.keyString }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  keyString: String
})
</script>

<style scoped>
.key-square {
  padding-left: 7.5px;
  padding-top: 5px;
  background-size: cover;
  margin-left: 5px;
  font-size: 30px;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background-color: #b8e2cc;
}

.key-square-child {
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65px;
  height: 65px;
  border-radius: 10px;
  text-align: center;
  background-color: rgb(255 255 255 / 0.7);
  backdrop-filter: blur(10px);
  color: #4f6259;
}
</style>