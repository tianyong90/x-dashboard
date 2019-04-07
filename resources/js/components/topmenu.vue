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
      VISION NETWORK
    </router-link>

    <el-button class="btn-logout"
               size="small"
               type="primary"
               @click="logout"
    >
      退出登录
    </el-button>
  </el-menu>
</template>

<script>
import config from '../config'
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  },

  methods: {
    ...mapActions(['clearUserInSessionStorage']),

    // 退出登录
    logout () {
      this.axios
        .post('logout')
        .then(() => {
          window.localStorage.removeItem(config.authTokenKey)
          this.clearUserInSessionStorage({})

          this.$router.replace('/login')
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
}
</script>

<style scoped lang="scss">

</style>
