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
    <el-row>
      <el-col :span="8">
        <router-link class="logo" to="/">
          X-DASHBOARD
        </router-link>
      </el-col>
      <el-col :span="16" />
    </el-row>
  </el-menu>
</template>

<script lang="ts">
export default {
  computed: {},

  methods: {},
}
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  color: #fff;
  text-decoration: none;
  flex: 0 1 40px;
  height: 40px;
  line-height: 40px;
  padding-left: 1em;
}
</style>
