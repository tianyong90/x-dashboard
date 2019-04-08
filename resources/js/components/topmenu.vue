<template>
  <el-menu
    default-active="/"
    class="topmenu"
    mode="horizontal"
    :router="true"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <router-link class="logo" to="/">
      GH-DASHBOARD
    </router-link>
  </el-menu>
</template>

<script>
export default {
  computed: {},

  methods: {},
}
</script>

<style scoped lang="scss"></style>
