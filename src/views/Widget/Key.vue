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
  padding: 5px;
  margin-left: 5px;
  width: 90px;
  height: 70px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
}

.key-square-child {
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 60px;
  border-radius: 10px;
  border: 3px solid #4f6259;
  font-size: 30px;
  text-align: center;
  background-color: var(--select-bg-color);
  /* backdrop-filter: blur(10px); */
  color: #4f6259;
  position: relative;
}

.key-square:hover {
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3)
}

.key-square-child::after {
  content: "";
  background-color: #94b4a3;
  width: 73px;
  height: 7px;
  position: absolute;
  
  bottom: 0;
  left: 0.5;
  border-radius: 0px 0px 10px 10px;
}
</style>